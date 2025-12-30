"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import { Product, Category, ProductStatus } from "@/lib/types/product";
import { StatBadge } from "@/components/admin/StatBadge";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createProduct } from "@/lib/services/products";
import Image from "next/image";

const columns: Column<Product>[] = [
  {
    header: "Image",
    accessor: (row) => {
      const mainImage = row.images?.[0];
      if (!mainImage) {
        return (
          <div className="w-16 h-16 bg-effinor-gray-medium rounded-md flex items-center justify-center text-effinor-gray-text text-xs">
            Aucune
          </div>
        );
      }
      return (
        <div className="w-16 h-16 relative rounded-md overflow-hidden border border-gray-200 bg-white">
          <Image
            src={mainImage}
            alt={row.name}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized
            onError={(e) => {
              // Fallback si l'image ne charge pas
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = '<div class="w-full h-full bg-effinor-gray-medium flex items-center justify-center text-effinor-gray-text text-xs">Erreur</div>';
              }
            }}
          />
        </div>
      );
    },
  },
  {
    header: "Nom",
    accessor: "name",
    sortable: true,
  },
  {
    header: "Catégorie",
    accessor: (row) => {
      return row.category?.name || "N/A";
    },
    sortable: true,
    sortKey: "categoryId" as keyof Product,
  },
  {
    header: "Prix",
    accessor: (row) => {
      if (row.priceOnQuote) return "Sur devis";
      if (row.promoActive && row.promoPrice) {
        return `${row.promoPrice.toLocaleString()} € (promo)`;
      }
      return row.price ? `${row.price.toLocaleString()} €` : "N/A";
    },
    sortable: true,
    sortKey: "price" as keyof Product,
  },
  {
    header: "Promo",
    accessor: (row) => (row.promoActive ? "Oui" : "Non"),
  },
  {
    header: "Stock",
    accessor: "stock",
    sortable: true,
  },
  {
    header: "Statut",
    accessor: (row) => (
      <StatBadge
        label={row.status === "active" ? "Actif" : row.status === "draft" ? "Brouillon" : "Inactif"}
        variant={row.status === "active" ? "default" : "secondary"}
      />
    ),
  },
  {
    header: "Actions",
    accessor: (row) => (
      <Link href={`/admin/produits/${row.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

export default function ProduitsPage() {
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Formulaire nouveau produit
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    priceOnQuote: false,
    description: "",
    status: "active" as ProductStatus,
  });
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        // Initialiser la catégorie par défaut si disponible
        if (categoriesData.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: categoriesData[0].id }));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [addToast]);

  // Réinitialiser le formulaire quand le dialog se ferme
  useEffect(() => {
    if (!dialogOpen) {
      setFormData({
        name: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        price: "",
        priceOnQuote: false,
        description: "",
        status: "active",
      });
    }
  }, [dialogOpen, categories]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      addToast({
        title: "Erreur",
        description: "Le nom du produit est requis",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoryId) {
      addToast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const slug = generateSlug(formData.name);
      
      const newProduct = await createProduct({
        name: formData.name,
        slug: slug,
        description: formData.description,
        categoryId: formData.categoryId,
        price: formData.price ? parseFloat(formData.price) : undefined,
        priceOnQuote: formData.priceOnQuote,
        promoActive: false,
        promoPrice: undefined,
        stock: 0,
        status: formData.status,
        images: [],
      });

      addToast({
        title: "Succès",
        description: "Le produit a été créé avec succès.",
      });

      // Recharger les produits
      const productsData = await getProducts();
      setProducts(productsData);

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        categoryId: "",
        price: "",
        priceOnQuote: false,
        description: "",
        status: "active",
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
      addToast({
        title: "Erreur",
        description: "Impossible de créer le produit",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Filtre par catégorie
      if (selectedCategory !== "all") {
        if (product.categoryId !== selectedCategory) return false;
      }

      // Filtre par statut
      if (selectedStatus !== "all") {
        if (product.status !== selectedStatus) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    // La pagination sera réinitialisée automatiquement par le DataTable
  }, [searchQuery, selectedCategory, selectedStatus]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produits"
        description="Gérez vos produits et services"
        actions={
          <Button 
            onClick={() => {
              setFormData({
                name: "",
                categoryId: categories.length > 0 ? categories[0].id : "",
                price: "",
                priceOnQuote: false,
                description: "",
                status: "active",
              });
              setDialogOpen(true);
            }}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Button>
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nouveau produit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Nom *</Label>
                    <Input 
                      placeholder="Nom du produit" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Catégorie *</Label>
                    <Select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Prix HT (€)</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        disabled={formData.priceOnQuote}
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.priceOnQuote}
                          onChange={(e) => setFormData({ ...formData, priceOnQuote: e.target.checked, price: "" })}
                        />
                        <span className="text-sm">Sur devis</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-effinor-gray-dark"
                      placeholder="Description du produit"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                      <option value="draft">Brouillon</option>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setDialogOpen(false);
                        setFormData({
                          name: "",
                          categoryId: "",
                          price: "",
                          priceOnQuote: false,
                          description: "",
                          status: "active",
                        });
                      }}
                      disabled={saving}
                    >
                      Annuler
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

      <FiltersBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher par nom, description ou catégorie..."
        filters={
          <>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-[200px]"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-[180px]"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="draft">Brouillon</option>
            </Select>
          </>
        }
      />

      <DataTable data={filteredProducts} columns={columns} />
    </div>
  );
}
