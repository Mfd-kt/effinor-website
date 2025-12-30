"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCategory, updateCategory, deleteCategory } from "@/lib/services/categories";
import { Category, CategoryTranslation, Language } from "@/lib/types/product";
import { ArrowLeft, Save, Trash2, Globe } from "lucide-react";

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Translations state for 3 languages
  const [translations, setTranslations] = useState<Record<Language, CategoryTranslation>>({
    fr: { lang: "fr", name: "", description: "" },
    en: { lang: "en", name: "", description: "" },
    ar: { lang: "ar", name: "", description: "" },
  });

  // Common category data (not language-specific)
  const [formData, setFormData] = useState({
    slug: "",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const categoryData = await getCategory(categoryId);

        if (!categoryData) {
          addToast({
            title: "Erreur",
            description: "Catégorie introuvable",
            variant: "destructive",
          });
          router.push("/admin/categories");
          return;
        }

        setCategory(categoryData);

        // Initialize translations from category data
        const translationsData: Record<Language, CategoryTranslation> = {
          fr: { lang: "fr", name: "", description: "" },
          en: { lang: "en", name: "", description: "" },
          ar: { lang: "ar", name: "", description: "" },
        };

        // Charger les traductions existantes
        if (categoryData.translations && categoryData.translations.length > 0) {
          categoryData.translations.forEach((trans: CategoryTranslation) => {
            translationsData[trans.lang] = {
              lang: trans.lang,
              name: trans.name || "",
              description: trans.description || "",
            };
          });
        } else {
          // Fallback : utiliser les données FR du produit pour compatibilité
          translationsData.fr = {
            lang: "fr",
            name: categoryData.name || "",
            description: categoryData.description || "",
          };
        }

        setTranslations(translationsData);

        // Initialize common form data
        setFormData({
          slug: categoryData.slug || "",
          order: categoryData.order || 0,
          visible: categoryData.visible !== undefined ? categoryData.visible : true,
        });
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les données de la catégorie",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) {
      loadData();
    }
  }, [categoryId, router, addToast]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (lang: Language, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        name: value,
      },
    }));
  };

  const handleDescriptionChange = (lang: Language, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        description: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation : au moins le nom FR est requis
    if (!translations.fr.name.trim()) {
      addToast({
        title: "Erreur",
        description: "Le nom de la catégorie (FR) est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const slug = formData.slug.trim() || generateSlug(translations.fr.name);

      // Préparer les traductions pour la sauvegarde
      const translationsArray: CategoryTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        if (trans.name.trim() || trans.description?.trim()) {
          translationsArray.push({
            lang: trans.lang,
            name: trans.name.trim() || "",
            description: trans.description?.trim() || undefined,
          });
        }
      });

      const updatedCategory = await updateCategory(categoryId, {
        translations: translationsArray,
        slug: slug,
        order: formData.order,
        visible: formData.visible,
      });

      if (updatedCategory) {
        setCategory(updatedCategory);
        // Mettre à jour les traductions avec les données retournées
        if (updatedCategory.translations) {
          const updatedTranslations: Record<Language, CategoryTranslation> = {
            fr: { lang: "fr", name: "", description: "" },
            en: { lang: "en", name: "", description: "" },
            ar: { lang: "ar", name: "", description: "" },
          };
          updatedCategory.translations.forEach((trans) => {
            updatedTranslations[trans.lang] = trans;
          });
          setTranslations(updatedTranslations);
        }
        addToast({
          title: "Succès",
          description: "La catégorie a été mise à jour avec succès",
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCategory(categoryId);
      addToast({
        title: "Succès",
        description: "La catégorie a été supprimée avec succès",
      });
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error deleting category:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
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

  if (!category) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Catégorie introuvable"
          description="La catégorie demandée n'existe pas"
        />
        <Button onClick={() => router.push("/admin/categories")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={translations.fr.name || category.name || "Catégorie"}
        description="Modifiez les informations de la catégorie"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/categories")}
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
              <Globe className="h-5 w-5 text-[#10B981]" />
              <CardTitle>Traductions</CardTitle>
            </div>
            <CardDescription>
              Définissez les informations de la catégorie dans chaque langue
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
                      placeholder={`Nom de la catégorie en ${lang === "fr" ? "français" : lang === "en" ? "anglais" : "arabe"}`}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${lang}`} className="text-sm font-semibold">
                      Description
                    </Label>
                    <textarea
                      id={`description-${lang}`}
                      value={translations[lang].description || ""}
                      onChange={(e) => handleDescriptionChange(lang, e.target.value)}
                      className="w-full min-h-[120px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:border-[#10B981] resize-y"
                      placeholder={`Description de la catégorie en ${lang === "fr" ? "français" : lang === "en" ? "anglais" : "arabe"}`}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

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
              <Label htmlFor="slug" className="text-sm font-semibold">
                Slug
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="slug-categorie"
                className="h-11"
              />
              <p className="text-xs text-[#4B5563] mt-1.5">
                Généré automatiquement depuis le nom (FR) si vide
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Paramètres</CardTitle>
            <CardDescription>
              Configurez l'ordre d'affichage et la visibilité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="order" className="text-sm font-semibold">
                Ordre
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className="h-11"
              />
              <p className="text-xs text-[#4B5563] mt-1.5">
                Détermine l'ordre d'affichage dans la liste (plus petit = affiché en premier)
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <input
                type="checkbox"
                id="visible"
                checked={formData.visible}
                onChange={(e) => setFormData((prev) => ({ ...prev, visible: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]"
              />
              <Label htmlFor="visible" className="cursor-pointer text-sm font-medium">
                Visible
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/categories")}
            disabled={saving}
            size="lg"
          >
            Annuler
          </Button>
          <Button type="submit" disabled={saving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la catégorie</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "{translations.fr.name || category.name}" ?
              {category.productCount && category.productCount > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  Attention : Cette catégorie contient {category.productCount} produit(s).
                </span>
              )}
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
