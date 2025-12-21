"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO_CONTENT_PAGES, SeoScript } from "@/lib/types/seo";
import { getSeoContents } from "@/lib/services/seo";
import { getSeoScripts } from "@/lib/services/seo-scripts";
import { SeoContent, SeoContentLang } from "@/lib/types/seo";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Plus, CheckCircle2, Circle, Globe, Code, ArrowRight } from "lucide-react";

export function ContentPageContent() {
  const router = useRouter();
  const { addToast } = useToast();
  const [contents, setContents] = useState<SeoContent[]>([]);
  const [scripts, setScripts] = useState<SeoScript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContents() {
      try {
        setLoading(true);
        const [contentsData, scriptsData] = await Promise.all([
          getSeoContents(),
          getSeoScripts().catch(() => []), // Ne pas bloquer si la table n'existe pas encore
        ]);
        setContents(contentsData);
        setScripts(scriptsData);
      } catch (error) {
        console.error("Error loading seo contents:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les contenus",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadContents();
  }, [addToast]);

  const getContentBySlug = (slug: string, lang: SeoContentLang = 'fr'): SeoContent | undefined => {
    return contents.find((c) => c.slug === slug && c.lang === lang);
  };

  const getAvailableLangs = (slug: string): SeoContentLang[] => {
    return contents
      .filter((c) => c.slug === slug)
      .map((c) => c.lang)
      .sort();
  };

  const handleEdit = (slug: string, lang: SeoContentLang = 'fr') => {
    router.push(`/admin/seo/contenu/${slug}?lang=${lang}`);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SEO_CONTENT_PAGES.map((page) => {
          const availableLangs = getAvailableLangs(page.slug);
          const hasFr = availableLangs.includes('fr');
          const hasEn = availableLangs.includes('en');
          const hasAr = availableLangs.includes('ar');
          const langCount = availableLangs.length;

          return (
            <Card key={page.slug} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{page.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {page.description}
                    </CardDescription>
                  </div>
                  {langCount > 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-effinor-emerald flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-effinor-gray-text flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={langCount > 0 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {langCount > 0 ? `${langCount}/3 langues` : "Non créé"}
                  </Badge>
                  <span className="text-xs text-effinor-gray-text">
                    /{page.slug}
                  </span>
                </div>
                
                {/* Indicateurs de langues */}
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-effinor-gray-text" />
                  <div className="flex gap-1">
                    <Badge variant={hasFr ? "default" : "outline"} className="text-xs px-1.5 py-0.5">
                      FR
                    </Badge>
                    <Badge variant={hasEn ? "default" : "outline"} className="text-xs px-1.5 py-0.5">
                      EN
                    </Badge>
                    <Badge variant={hasAr ? "default" : "outline"} className="text-xs px-1.5 py-0.5">
                      AR
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => handleEdit(page.slug, 'fr')}
                    variant={hasFr ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    {hasFr ? <Edit className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                    FR
                  </Button>
                  <Button
                    onClick={() => handleEdit(page.slug, 'en')}
                    variant={hasEn ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    {hasEn ? <Edit className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                    EN
                  </Button>
                  <Button
                    onClick={() => handleEdit(page.slug, 'ar')}
                    variant={hasAr ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    {hasAr ? <Edit className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                    AR
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section Scripts de tracking */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-effinor-gray-dark flex items-center gap-2">
              <Code className="h-5 w-5 text-effinor-emerald" />
              Scripts de tracking et publicité
            </h3>
            <p className="text-sm text-effinor-gray-text mt-1">
              Gérez les scripts de tracking (Meta Ads, Google Ads, etc.)
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/seo/contenu/scripts")}
            variant="outline"
            size="sm"
          >
            Gérer les scripts
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {scripts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scripts.slice(0, 6).map((script) => (
              <Card key={script.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{script.label}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {script.description || "Aucune description"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={script.active ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {script.active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-effinor-gray-text mb-3">
                    <span className="capitalize">{script.scriptPosition}</span>
                    <span>•</span>
                    <span>Priorité: {script.priority}</span>
                  </div>
                  <Button
                    onClick={() => router.push(`/admin/seo/contenu/scripts/${script.name}`)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Éditer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Code className="h-10 w-10 text-effinor-gray-text mx-auto mb-3" />
              <p className="text-sm text-effinor-gray-text mb-4">
                Aucun script configuré
              </p>
              <Button
                onClick={() => router.push("/admin/seo/contenu/scripts")}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un script
              </Button>
            </CardContent>
          </Card>
        )}

        {scripts.length > 6 && (
          <div className="mt-4 text-center">
            <Button
              onClick={() => router.push("/admin/seo/contenu/scripts")}
              variant="ghost"
              size="sm"
            >
              Voir tous les scripts ({scripts.length})
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

