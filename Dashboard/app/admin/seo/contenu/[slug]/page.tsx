"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { getSeoContent, createSeoContent, updateSeoContent, downloadSeoContentAsFile } from "@/lib/services/seo";
import { SEO_CONTENT_PAGES, SeoContent, SeoContentLang } from "@/lib/types/seo";
import { ArrowLeft, Save, Download, Eye, Globe } from "lucide-react";
import { format } from "date-fns";

const LANG_LABELS: Record<SeoContentLang, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

export default function SeoContentEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const slug = params.slug as string;
  const [currentLang, setCurrentLang] = useState<SeoContentLang>(
    (searchParams.get('lang') as SeoContentLang) || 'fr'
  );

  const [content, setContent] = useState<SeoContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const pageInfo = SEO_CONTENT_PAGES.find((p) => p.slug === slug);

  const [formData, setFormData] = useState({
    title: pageInfo?.title || "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const contentData = await getSeoContent(slug, currentLang);

        if (contentData) {
          setContent(contentData);
          setIsNew(false);
          setFormData({
            title: contentData.title,
            content: contentData.content,
            metaTitle: contentData.metaTitle || "",
            metaDescription: contentData.metaDescription || "",
            metaKeywords: contentData.metaKeywords || "",
          });
        } else {
          setIsNew(true);
          setFormData({
            title: pageInfo?.title || "",
            content: "",
            metaTitle: "",
            metaDescription: "",
            metaKeywords: "",
          });
        }
      } catch (error) {
        console.error("Error loading content:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger le contenu",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadContent();
    }
  }, [slug, currentLang, addToast, pageInfo]);

  const handleLangChange = (newLang: string) => {
    setCurrentLang(newLang as SeoContentLang);
    router.replace(`/admin/seo/contenu/${slug}?lang=${newLang}`, { scroll: false });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (isNew) {
        const newContent = await createSeoContent({
          slug,
          lang: currentLang,
          title: formData.title,
          content: formData.content,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
        });
        setContent(newContent);
        setIsNew(false);
        addToast({
          title: "Succès",
          description: "Contenu créé avec succès",
        });
      } else {
        const updatedContent = await updateSeoContent(slug, currentLang, {
          title: formData.title,
          content: formData.content,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
        });
        setContent(updatedContent);
        addToast({
          title: "Succès",
          description: "Contenu mis à jour avec succès",
        });
      }
    } catch (error) {
      console.error("Error saving content:", error);
      addToast({
        title: "Erreur",
        description: "Impossible de sauvegarder le contenu",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (content) {
      downloadSeoContentAsFile(content);
      addToast({
        title: "Succès",
        description: "Contenu exporté avec succès",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!pageInfo) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Page introuvable"
          description="La page demandée n'existe pas"
        />
        <Button onClick={() => router.push("/admin/seo")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${pageInfo.title} - ${LANG_LABELS[currentLang]}`}
        description={pageInfo.description}
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={currentLang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="w-32"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
              <option value="ar">🇸🇦 العربية</option>
            </Select>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/seo?tab=contenu")}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
              <CardDescription>
                Éditez le contenu de la page (HTML/Markdown)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Titre de la page
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de la page"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold">
                  Contenu
                </Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full min-h-[400px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-effinor-gray-dark placeholder:text-effinor-gray-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-effinor-emerald focus-visible:ring-offset-2 focus-visible:border-effinor-emerald resize-y font-mono"
                  placeholder="Entrez le contenu HTML ou Markdown ici..."
                />
                <p className="text-xs text-effinor-gray-text">
                  Vous pouvez utiliser du HTML ou du Markdown. Le contenu sera rendu sur la page publique.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section SEO */}
          <Card>
            <CardHeader>
              <CardTitle>Métadonnées SEO</CardTitle>
              <CardDescription>
                Optimisez le référencement de cette page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-sm font-semibold">
                  Meta Title
                </Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Titre SEO (50-60 caractères recommandés)"
                  className="h-11"
                  maxLength={60}
                />
                <p className="text-xs text-effinor-gray-text">
                  {formData.metaTitle.length}/60 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-sm font-semibold">
                  Meta Description
                </Label>
                <textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-effinor-gray-dark placeholder:text-effinor-gray-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-effinor-emerald focus-visible:ring-offset-2 focus-visible:border-effinor-emerald resize-y"
                  placeholder="Description SEO (150-160 caractères recommandés)"
                  maxLength={160}
                />
                <p className="text-xs text-effinor-gray-text">
                  {formData.metaDescription.length}/160 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords" className="text-sm font-semibold">
                  Meta Keywords
                </Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  placeholder="Mots-clés séparés par des virgules"
                  className="h-11"
                />
                <p className="text-xs text-effinor-gray-text">
                  Séparez les mots-clés par des virgules (ex: seo, marketing, web)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec infos et actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-effinor-gray-text">Slug</Label>
                <p className="text-sm font-medium text-effinor-gray-dark mt-1">
                  /{slug}
                </p>
              </div>
              <div>
                <Label className="text-xs text-effinor-gray-text flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Langue
                </Label>
                <p className="text-sm font-medium text-effinor-gray-dark mt-1">
                  {LANG_LABELS[currentLang]}
                </p>
              </div>
              {content && (
                <>
                  <div>
                    <Label className="text-xs text-effinor-gray-text">Créé le</Label>
                    <p className="text-sm text-effinor-gray-dark mt-1">
                      {format(content.createdAt, "dd MMM yyyy à HH:mm")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-effinor-gray-text">Modifié le</Label>
                    <p className="text-sm text-effinor-gray-dark mt-1">
                      {format(content.updatedAt, "dd MMM yyyy à HH:mm")}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Enregistrement..." : isNew ? "Créer" : "Enregistrer"}
              </Button>
              {content && (
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter en fichier
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

