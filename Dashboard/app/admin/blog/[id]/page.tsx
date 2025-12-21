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
import { getPost, createPost, updatePost, deletePost } from "@/lib/services/blog";
import { getCategories } from "@/lib/services/categories";
import { getCurrentUser } from "@/lib/auth/mockAuth";
import { BlogPost, BlogPostStatus } from "@/lib/types/blog";
import { Category } from "@/lib/types/product";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BlogImageUploader } from "@/components/admin/BlogImageUploader";

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const postId = params.id as string;
  const isNew = postId === "new";

  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft" as BlogPostStatus,
    tags: [] as string[],
    categoryId: "",
    seoTitle: "",
    seoDescription: "",
    seoOgImageUrl: "",
    coverImageUrl: "",
  });

  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    }
    loadCurrentUser();
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        if (isNew) {
          // Nouvel article : initialiser avec des valeurs par défaut
          setFormData({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            status: "draft",
            tags: [],
            categoryId: "",
            seoTitle: "",
            seoDescription: "",
            seoOgImageUrl: "",
            coverImageUrl: "",
          });
          setLoading(false);
          return;
        }

        // Charger l'article existant
        const postData = await getPost(postId);

        if (!postData) {
          addToast({
            title: "Erreur",
            description: "Article introuvable",
            variant: "destructive",
          });
          router.push("/admin/blog");
          return;
        }

        setPost(postData);
        setFormData({
          title: postData.title || "",
          slug: postData.slug || "",
          excerpt: postData.excerpt || "",
          content: postData.content || "",
          status: postData.status || "draft",
          tags: postData.tags || [],
          categoryId: postData.categoryId || "",
          seoTitle: postData.seoTitle || "",
          seoDescription: postData.seoDescription || "",
          seoOgImageUrl: postData.seoOgImageUrl || "",
          coverImageUrl: postData.coverImageUrl || "",
        });
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les données de l'article",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      loadData();
    }
  }, [postId, isNew, router, addToast]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      addToast({
        title: "Erreur",
        description: "Le titre de l'article est requis",
        variant: "destructive",
      });
      return;
    }

    if (!formData.slug.trim()) {
      addToast({
        title: "Erreur",
        description: "Le slug est requis",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      addToast({
        title: "Erreur",
        description: "Le contenu de l'article est requis",
        variant: "destructive",
      });
      return;
    }

    if (!currentUserId) {
      addToast({
        title: "Erreur",
        description: "Impossible de déterminer l'auteur",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorName'> = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || generateSlug(formData.title),
        excerpt: formData.excerpt.trim() || undefined,
        content: formData.content.trim(),
        status: formData.status,
        authorId: currentUserId,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        categoryId: formData.categoryId || undefined,
        seoTitle: formData.seoTitle.trim() || undefined,
        seoDescription: formData.seoDescription.trim() || undefined,
        seoOgImageUrl: formData.seoOgImageUrl.trim() || undefined,
        coverImageUrl: formData.coverImageUrl.trim() || undefined,
        publishedAt: formData.status === "published" ? new Date() : undefined,
      };

      if (isNew) {
        const newPost = await createPost(postData);
        if (newPost) {
          addToast({
            title: "Succès",
            description: "L'article a été créé avec succès",
          });
          router.push(`/admin/blog/${newPost.id}`);
        }
      } else {
        const updatedPost = await updatePost(postId, postData);
        if (updatedPost) {
          setPost(updatedPost);
          addToast({
            title: "Succès",
            description: "L'article a été mis à jour avec succès",
          });
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      addToast({
        title: "Erreur",
        description: `Impossible de ${isNew ? 'créer' : 'mettre à jour'} l'article`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;

    try {
      setDeleting(true);
      await deletePost(postId);
      addToast({
        title: "Succès",
        description: "L'article a été supprimé avec succès",
      });
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error deleting post:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
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
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Nouvel article" : post?.title || "Article"}
        description={isNew ? "Créez un nouvel article de blog" : "Modifiez les informations de l'article"}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/blog")}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            {!isNew && (
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Informations principales */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Informations principales</CardTitle>
              <CardDescription>
                Titre, slug et contenu de l'article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Titre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="Titre de l'article"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-semibold">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                  placeholder="slug-de-l-article"
                  className="h-11"
                />
                <p className="text-xs text-effinor-gray-text mt-1.5">
                  Généré automatiquement depuis le titre si vide
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-semibold">
                  Extrait
                </Label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full min-h-[80px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-effinor-gray-dark placeholder:text-effinor-gray-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-effinor-emerald focus-visible:ring-offset-2 focus-visible:border-effinor-emerald resize-y"
                  placeholder="Court résumé de l'article (affiché dans les listes)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold">
                  Contenu <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  required
                  className="w-full min-h-[300px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-effinor-gray-dark placeholder:text-effinor-gray-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-effinor-emerald focus-visible:ring-offset-2 focus-visible:border-effinor-emerald resize-y font-mono"
                  placeholder="Contenu de l'article (Markdown supporté)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Métadonnées et statut */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Métadonnées et statut</CardTitle>
              <CardDescription>
                Statut, catégorie, tags et informations de publication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Statut
                </Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as BlogPostStatus }))}
                  className="h-11"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-sm font-semibold">
                  Catégorie
                </Label>
                <Select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className="h-11"
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-semibold">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={formData.tags.join(", ")}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="h-11"
                />
                <p className="text-xs text-effinor-gray-text mt-1.5">
                  Séparez les tags par des virgules
                </p>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-effinor-gray-medium text-effinor-gray-dark rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!isNew && post && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <p className="text-sm font-semibold">Informations</p>
                  <div className="text-sm text-effinor-gray-text space-y-1">
                    <p>Auteur: {post.authorName}</p>
                    <p>Créé le: {format(post.createdAt, "dd MMMM yyyy à HH:mm", { locale: fr })}</p>
                    {post.updatedAt && (
                      <p>Modifié le: {format(post.updatedAt, "dd MMMM yyyy à HH:mm", { locale: fr })}</p>
                    )}
                    {post.publishedAt && (
                      <p>Publié le: {format(post.publishedAt, "dd MMMM yyyy à HH:mm", { locale: fr })}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Image de couverture */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Image de couverture</CardTitle>
            <CardDescription>
              Image principale de l'article (affichée dans les listes et en en-tête). Vous pouvez uploader une image ou utiliser une URL externe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BlogImageUploader
              postId={isNew ? "new" : postId}
              coverImageUrl={formData.coverImageUrl}
              onCoverImageChange={(url) => setFormData((prev) => ({ ...prev, coverImageUrl: url }))}
            />
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>SEO (Optimisation pour les moteurs de recherche)</CardTitle>
            <CardDescription>
              Métadonnées pour améliorer le référencement de l'article
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="seoTitle" className="text-sm font-semibold">
                Titre SEO
              </Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="Titre optimisé pour les moteurs de recherche"
                className="h-11"
              />
              <p className="text-xs text-effinor-gray-text mt-1.5">
                Si vide, le titre de l'article sera utilisé
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription" className="text-sm font-semibold">
                Description SEO
              </Label>
              <textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                className="w-full min-h-[80px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-effinor-gray-dark placeholder:text-effinor-gray-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-effinor-emerald focus-visible:ring-offset-2 focus-visible:border-effinor-emerald resize-y"
                placeholder="Description optimisée pour les moteurs de recherche (150-160 caractères recommandés)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoOgImageUrl" className="text-sm font-semibold">
                Image Open Graph (SEO)
              </Label>
              <Input
                id="seoOgImageUrl"
                value={formData.seoOgImageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, seoOgImageUrl: e.target.value }))}
                placeholder="https://example.com/og-image.jpg"
                className="h-11"
              />
              <p className="text-xs text-effinor-gray-text mt-1.5">
                Image affichée lors du partage sur les réseaux sociaux (1200x630px recommandé)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blog")}
            disabled={saving}
            size="lg"
          >
            Annuler
          </Button>
          <Button type="submit" disabled={saving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Enregistrement..." : isNew ? "Créer l'article" : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>

      {/* Delete confirmation dialog */}
      {!isNew && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer l'article</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer l'article "{post?.title}" ?
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
      )}
    </div>
  );
}

