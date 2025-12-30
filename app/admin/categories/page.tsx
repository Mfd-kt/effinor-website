"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { getCategories, createCategory } from "@/lib/services/categories";
import { Category } from "@/lib/types/product";
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
import { Label } from "@/components/ui/label";

const columns: Column<Category>[] = [
  {
    header: "Nom",
    accessor: "name",
    sortable: true,
  },
  {
    header: "Slug",
    accessor: "slug",
  },
  {
    header: "Nb produits",
    accessor: (row) => row.productCount || 0,
    sortable: true,
  },
  {
    header: "Ordre",
    accessor: "order",
    sortable: true,
  },
  {
    header: "Visible",
    accessor: (row) => (
      <StatBadge
        label={row.visible ? "Oui" : "Non"}
        variant={row.visible ? "default" : "secondary"}
      />
    ),
  },
  {
    header: "Actions",
    accessor: (row) => (
      <Link href={`/admin/categories/${row.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

export default function CategoriesPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Formulaire nouveau catégorie
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les catégories",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [addToast]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      addToast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const slug = formData.slug.trim() || generateSlug(formData.name);
      
      const newCategory = await createCategory({
        name: formData.name.trim(),
        slug: slug,
        description: formData.description.trim() || undefined,
        order: formData.order,
        visible: formData.visible,
      });

      if (newCategory) {
        // Recharger la liste
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        addToast({
          title: "Succès",
          description: "La catégorie a été créée avec succès.",
        });
        
        // Réinitialiser le formulaire
        setFormData({
          name: "",
          slug: "",
          description: "",
          order: 0,
          visible: true,
        });
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      addToast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Réinitialiser le formulaire quand le dialog se ferme
  useEffect(() => {
    if (!dialogOpen) {
      setFormData({
        name: "",
        slug: "",
        description: "",
        order: 0,
        visible: true,
      });
    }
  }, [dialogOpen]);

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
        title="Catégories"
        description="Gérez les catégories de produits"
        actions={
          <Button 
            onClick={() => setDialogOpen(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle catégorie
          </Button>
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle catégorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nom de la catégorie"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name: name,
                    slug: prev.slug || generateSlug(name),
                  }));
                }}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-semibold">
                Slug
              </Label>
              <Input
                id="slug"
                placeholder="slug-categorie"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="h-11"
              />
              <p className="text-xs text-effinor-gray-text mt-1.5">
                Généré automatiquement depuis le nom si vide
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-effinor-gray-dark placeholder:text-effinor-gray-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-effinor-emerald focus-visible:ring-offset-2 focus-visible:border-effinor-emerald resize-y"
                placeholder="Description de la catégorie"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order" className="text-sm font-semibold">
                Ordre
              </Label>
              <Input
                id="order"
                type="number"
                placeholder="0"
                value={formData.order}
                onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className="h-11"
              />
            </div>
            <div className="flex items-center space-x-3 pt-1">
              <input
                type="checkbox"
                id="visible"
                checked={formData.visible}
                onChange={(e) => setFormData((prev) => ({ ...prev, visible: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-effinor-emerald focus:ring-effinor-emerald"
              />
              <Label htmlFor="visible" className="cursor-pointer text-sm font-medium">
                Visible
              </Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DataTable data={categories} columns={columns} />
    </div>
  );
}
