"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { getSeoContent, createSeoContent, updateSeoContent } from "@/lib/services/seo";
import { SeoContent, SeoContentLang } from "@/lib/types/seo";
import { ArrowLeft, Save, Mail, Phone, MapPin, Clock, Globe } from "lucide-react";
import { format } from "date-fns";

const LANG_LABELS: Record<SeoContentLang, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

// Données par défaut pour la page Contact
const DEFAULT_CONTACT_DATA = {
  email: "contact@effinor.fr",
  phone: "09 78 45 50 63",
  address: "Tour Europa, Av. de l'Europe, 94320 Thiais",
  hours: "Lun-Ven: 8h-18h",
};

const DEFAULT_CONTENT = `<div class="contact-page">
  <section class="contact-info">
    <h2>Contactez-nous</h2>
    <div class="contact-details">
      <div class="contact-item">
        <strong>Email :</strong> ${DEFAULT_CONTACT_DATA.email}
      </div>
      <div class="contact-item">
        <strong>Téléphone :</strong> ${DEFAULT_CONTACT_DATA.phone}
      </div>
      <div class="contact-item">
        <strong>Adresse :</strong> ${DEFAULT_CONTACT_DATA.address}
      </div>
      <div class="contact-item">
        <strong>Horaires :</strong> ${DEFAULT_CONTACT_DATA.hours}
      </div>
    </div>
  </section>
</div>`;

export default function ContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const slug = "contact";
  const [currentLang, setCurrentLang] = useState<SeoContentLang>(
    (searchParams.get('lang') as SeoContentLang) || 'fr'
  );

  const [content, setContent] = useState<SeoContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [contactData, setContactData] = useState(DEFAULT_CONTACT_DATA);
  const [formData, setFormData] = useState({
    title: "Contact",
    content: DEFAULT_CONTENT,
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
          // Extraire les données de contact depuis le contenu si possible
          extractContactDataFromContent(contentData.content);
        } else {
          setIsNew(true);
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

    loadContent();
  }, [addToast, currentLang]);

  const handleLangChange = (newLang: string) => {
    setCurrentLang(newLang as SeoContentLang);
    router.replace(`/admin/seo/contenu/contact?lang=${newLang}`, { scroll: false });
  };

  const extractContactDataFromContent = (htmlContent: string) => {
    // Essayer d'extraire les données depuis le HTML
    const emailMatch = htmlContent.match(/Email[^<]*>([^<]+)</);
    const phoneMatch = htmlContent.match(/Téléphone[^<]*>([^<]+)</);
    const addressMatch = htmlContent.match(/Adresse[^<]*>([^<]+)</);
    const hoursMatch = htmlContent.match(/Horaires[^<]*>([^<]+)</);

    if (emailMatch) setContactData((prev) => ({ ...prev, email: emailMatch[1].trim() }));
    if (phoneMatch) setContactData((prev) => ({ ...prev, phone: phoneMatch[1].trim() }));
    if (addressMatch) setContactData((prev) => ({ ...prev, address: addressMatch[1].trim() }));
    if (hoursMatch) setContactData((prev) => ({ ...prev, hours: hoursMatch[1].trim() }));
  };

  const updateContentFromContactData = () => {
    const newContent = `<div class="contact-page">
  <section class="contact-info">
    <h2>Contactez-nous</h2>
    <div class="contact-details">
      <div class="contact-item">
        <strong>Email :</strong> ${contactData.email}
      </div>
      <div class="contact-item">
        <strong>Téléphone :</strong> ${contactData.phone}
      </div>
      <div class="contact-item">
        <strong>Adresse :</strong> ${contactData.address}
      </div>
      <div class="contact-item">
        <strong>Horaires :</strong> ${contactData.hours}
      </div>
    </div>
  </section>
</div>`;
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleContactDataChange = (field: keyof typeof contactData, value: string) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
    // Mettre à jour le contenu automatiquement
    setTimeout(() => {
      updateContentFromContactData();
    }, 100);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      updateContentFromContactData();

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
          description: "Page Contact créée avec succès",
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
          description: "Page Contact mise à jour avec succès",
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
        title={`Contact - ${LANG_LABELS[currentLang]}`}
        description="Gérez les informations de contact affichées sur le site"
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
        {/* Formulaire de contact */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>
                Modifiez les informations affichées sur la page Contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactData.email}
                  onChange={(e) => handleContactDataChange("email", e.target.value)}
                  placeholder="contact@effinor.fr"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => handleContactDataChange("phone", e.target.value)}
                  placeholder="09 78 45 50 63"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Adresse
                </Label>
                <Input
                  id="address"
                  value={contactData.address}
                  onChange={(e) => handleContactDataChange("address", e.target.value)}
                  placeholder="Tour Europa, Av. de l'Europe, 94320 Thiais"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horaires
                </Label>
                <Input
                  id="hours"
                  value={contactData.hours}
                  onChange={(e) => handleContactDataChange("hours", e.target.value)}
                  placeholder="Lun-Ven: 8h-18h"
                  className="h-11"
                />
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
              </div>
            </CardContent>
          </Card>

          {/* Aperçu du contenu HTML généré */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du contenu HTML</CardTitle>
              <CardDescription>
                Contenu HTML généré automatiquement à partir des informations de contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-effinor-gray-light p-4 rounded-md">
                <pre className="text-xs overflow-x-auto">
                  <code>{formData.content}</code>
                </pre>
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
            <CardContent>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Enregistrement..." : isNew ? "Créer" : "Enregistrer"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

