"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProduct, updateProduct, deleteProduct } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import { Product, Category, ProductTranslation, Language } from "@/lib/types/product";
import { ArrowLeft, Save, Trash2, Save as SaveIcon, Globe } from "lucide-react";
import { StatBadge } from "@/components/admin/StatBadge";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { PdfUploader } from "@/components/admin/PdfUploader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Translations state for 3 languages
  const [translations, setTranslations] = useState<Record<Language, ProductTranslation>>({
    fr: { lang: "fr", name: "", slug: "", description: "" },
    en: { lang: "en", name: "", slug: "", description: "" },
    ar: { lang: "ar", name: "", slug: "", description: "" },
  });
  
  // Common product data (not language-specific)
  const [formData, setFormData] = useState({
    categoryId: "",
    price: "",
    priceOnQuote: false,
    status: "active" as Product["status"],
  });
  
  // Images and PDF state (managed separately from form)
  const [productImages, setProductImages] = useState<string[]>([]);
  const [technicalSheetUrl, setTechnicalSheetUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [productData, categoriesData] = await Promise.all([
          getProduct(productId),
          getCategories(),
        ]);

        if (!productData) {
          addToast({
            title: "Erreur",
            description: "Produit introuvable",
            variant: "destructive",
          });
          router.push("/admin/produits");
          return;
        }

        setProduct(productData);
        setCategories(categoriesData);

        // Initialize translations from product data
        const translationsData: Record<Language, ProductTranslation> = {
          fr: { lang: "fr", name: "", slug: "", description: "" },
          en: { lang: "en", name: "", slug: "", description: "" },
          ar: { lang: "ar", name: "", slug: "", description: "" },
        };

        // Charger les traductions existantes
        if (productData.translations && productData.translations.length > 0) {
          productData.translations.forEach((trans: ProductTranslation) => {
            translationsData[trans.lang] = {
              lang: trans.lang,
              name: trans.name || "",
              slug: trans.slug || "",
              description: trans.short_description || trans.description || "",
              short_description: trans.short_description,
              long_description: trans.long_description,
              application: trans.application,
            };
          });
        } else {
          // Fallback : utiliser les données FR du produit pour compatibilité
          translationsData.fr = {
            lang: "fr",
            name: productData.name || "",
            slug: productData.slug || "",
            description: productData.description || "",
          };
        }

        setTranslations(translationsData);

        // Initialize common form data
        setFormData({
          categoryId: productData.categoryId || "",
          price: productData.price?.toString() || "",
          priceOnQuote: productData.priceOnQuote || false,
          status: productData.status || "active",
        });
        
        // Set images and PDF separately
        setProductImages(productData.images || []);
        setTechnicalSheetUrl(productData.technicalSheetUrl || null);
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les données du produit",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadData();
    }
  }, [productId, router, addToast]);

  // Auto-generate slug from name for a specific language
  const handleNameChange = (lang: Language, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        name: value,
        slug: prev[lang].slug || generateSlug(value),
      },
    }));
  };

  const handleSlugChange = (lang: Language, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        slug: value,
      },
    }));
  };

  const handleDescriptionChange = (lang: Language, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        description: value,
        short_description: value,
      },
    }));
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation : au moins le nom FR est requis
    if (!translations.fr.name.trim()) {
      addToast({
        title: "Erreur",
        description: "Le nom du produit (FR) est requis",
        variant: "destructive",
      });
      return;
    }

    if (!formData.priceOnQuote && formData.price && parseFloat(formData.price) < 0) {
      addToast({
        title: "Erreur",
        description: "Le prix doit être positif",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      // Préparer les traductions pour la sauvegarde
      const translationsArray: ProductTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        if (trans.name.trim() || trans.slug.trim() || trans.description?.trim()) {
          translationsArray.push({
            lang: trans.lang,
            name: trans.name.trim() || "",
            slug: trans.slug.trim() || generateSlug(trans.name.trim() || ""),
            description: trans.description?.trim() || "",
            short_description: trans.description?.trim() || "",
          });
        }
      });

      const updateData: Partial<Product> = {
        // Pour compatibilité, utiliser les données FR
        name: translations.fr.name,
        slug: translations.fr.slug || generateSlug(translations.fr.name),
        description: translations.fr.description,
        translations: translationsArray,
        categoryId: formData.categoryId,
        price: formData.priceOnQuote ? undefined : (formData.price ? parseFloat(formData.price) : undefined),
        priceOnQuote: formData.priceOnQuote,
        status: formData.status,
        images: productImages,
        technicalSheetUrl: technicalSheetUrl || undefined,
      };

      const updatedProduct = await updateProduct(productId, updateData);
      
      if (updatedProduct) {
        setProduct(updatedProduct);
        // Mettre à jour les traductions avec les données retournées
        if (updatedProduct.translations) {
          const updatedTranslations: Record<Language, ProductTranslation> = {
            fr: { lang: "fr", name: "", slug: "", description: "" },
            en: { lang: "en", name: "", slug: "", description: "" },
            ar: { lang: "ar", name: "", slug: "", description: "" },
          };
          updatedProduct.translations.forEach((trans) => {
            updatedTranslations[trans.lang] = trans;
          });
          setTranslations(updatedTranslations);
        }
        addToast({
          title: "Succès",
          description: "Le produit a été mis à jour avec succès",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProduct(productId);
      addToast({
        title: "Succès",
        description: "Le produit a été supprimé avec succès",
      });
      router.push("/admin/produits");
    } catch (error) {
      console.error("Error deleting product:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Produit introuvable"
          description="Le produit demandé n'existe pas"
        />
        <Button onClick={() => router.push("/admin/produits")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={translations.fr.name || product.name || "Produit"}
        description="Modifiez les informations du produit"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/produits")}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Traductions par langue */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-effinor-emerald" />
              <CardTitle>Traductions</CardTitle>
            </div>
            <CardDescription>
              Définissez les informations du produit dans chaque langue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fr" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="fr" className="flex items-center gap-2">
                  <span className="text-lg">🇫🇷</span>
                  <span>Français</span>
                </TabsTrigger>
                <TabsTrigger value="en" className="flex items-center gap-2">
                  <span className="text-lg">🇬🇧</span>
                  <span>English</span>
                </TabsTrigger>
                <TabsTrigger value="ar" className="flex items-center gap-2">
                  <span className="text-lg">🇸🇦</span>
                  <span>العربية</span>
                </TabsTrigger>
              </TabsList>
              
              {(["fr", "en", "ar"] as Language[]).map((lang) => (
                <TabsContent key={lang} value={lang} className="space-y-5 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${lang}`} className="text-sm font-semibold">
                      Nom {lang === "fr" && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id={`name-${lang}`}
                      value={translations[lang].name}
                      onChange={(e) => handleNameChange(lang, e.target.value)}
                      required={lang === "fr"}
                      placeholder={`Nom du produit en ${lang === "fr" ? "français" : lang === "en" ? "anglais" : "arabe"}`}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`slug-${lang}`} className="text-sm font-semibold">
                      Slug
                    </Label>
                    <Input
                      id={`slug-${lang}`}
                      value={translations[lang].slug}
                      onChange={(e) => handleSlugChange(lang, e.target.value)}
                      placeholder={`slug-du-produit-${lang}`}
                      className="h-11"
                    />
                    <p className="text-xs text-effinor-gray-text mt-1.5">
                      Généré automatiquement depuis le nom si vide
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${lang}`} className="text-sm font-semibold">
                      Description
                    </Label>
                    <textarea
                      id={`description-${lang}`}
                      value={translations[lang].description || ""}
                      onChange={(e) => handleDescriptionChange(lang, e.target.value)}
                      className="w-full min-h-[120px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-effinor-gray-dark placeholder:text-effinor-gray-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-effinor-emerald focus-visible:ring-offset-2 focus-visible:border-effinor-emerald resize-y"
                      placeholder={`Description du produit en ${lang === "fr" ? "français" : lang === "en" ? "anglais" : "arabe"}`}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Informations communes et Prix/Statut */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Informations communes */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Informations communes</CardTitle>
              <CardDescription>
                Informations partagées entre toutes les langues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">
                  Catégorie
                </Label>
                <Select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="h-11"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Prix et statut */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Prix et statut</CardTitle>
              <CardDescription>
                Configurez le prix et le statut du produit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold">
                  Prix HT (€)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                  disabled={formData.priceOnQuote}
                  className="h-11"
                />
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <input
                  type="checkbox"
                  id="priceOnQuote"
                  checked={formData.priceOnQuote}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceOnQuote: e.target.checked,
                      price: e.target.checked ? "" : prev.price,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-effinor-emerald focus:ring-effinor-emerald"
                />
                <Label htmlFor="priceOnQuote" className="cursor-pointer text-sm font-medium">
                  Sur devis uniquement
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Statut
                </Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as Product["status"],
                    }))
                  }
                  className="h-11"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="draft">Brouillon</option>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images and PDF Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Images */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Images du produit</CardTitle>
              <CardDescription>
                Ajoutez et gérez les images du produit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                productId={productId}
                images={productImages}
                onImagesChange={setProductImages}
              />
            </CardContent>
          </Card>

          {/* PDF */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Fiche technique / Plaquette</CardTitle>
              <CardDescription>
                Téléchargez la fiche technique ou la plaquette du produit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PdfUploader
                productId={productId}
                pdfUrl={technicalSheetUrl || undefined}
                onPdfChange={setTechnicalSheetUrl}
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/produits")}
            disabled={saving}
            size="lg"
          >
            Annuler
          </Button>
          <Button type="submit" disabled={saving} size="lg">
            <SaveIcon className="h-4 w-4 mr-2" />
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit "{product.name}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
