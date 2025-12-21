"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { getLead, getLeadRaw, updateLead, getLeadStatuses, calculateClimateZone, calculateRegion } from "@/lib/services/leads";
import { getCategories } from "@/lib/services/categories";
import { Lead, LeadStatus } from "@/lib/types/lead";
import { Category } from "@/lib/types/product";
import { ArrowLeft, Phone, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { StarRating } from "@/components/admin/StarRating";
import { LeadPhotoUploader } from "@/components/admin/LeadPhotoUploader";
import { LeadScoreCard } from "@/components/admin/LeadScoreCard";

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [leadRaw, setLeadRaw] = useState<any | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  const [formData, setFormData] = useState({
    // Informations de contact
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    statusId: "",
    categoryId: "",
    internalNotes: "",
    
    // Siège Social
    headquartersAddress: "",
    headquartersCity: "",
    headquartersPostcode: "",
    siretNumber: "",
    sirenNumber: "",
    
    // Adresse des travaux
    workCompanyName: "",
    workAddress: "",
    workCity: "",
    workPostcode: "",
    workSiret: "",
    workRegion: "",
    workClimateZone: "",
    
    // Bénéficiaire
    beneficiaryTitle: "",
    beneficiaryLastName: "",
    beneficiaryFirstName: "",
    beneficiaryFunction: "",
    beneficiaryPhone: "",
    beneficiaryEmail: "",
    beneficiaryLandline: "",
    
    // Cadastre
    cadastralParcel: "",
    qualificationScore: 0,
    surfaceM2: "",
    
    // Photos
    exteriorPhotoUrl: "",
    cadastralPhotoUrl: "",
  });

  // Fonction pour calculer le score de complétion côté client
  const calculateCompletionScore = (data: typeof formData): number => {
    let score = 0;
    const maxScore = 170; // Score maximum possible

    // Champs essentiels (10 points chacun)
    if (data.email && data.email.trim() !== '') score += 10;
    if (data.phone && data.phone.trim() !== '') score += 10;
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
    if (fullName !== '') score += 10;

    // Champs importants (8 points chacun)
    if (data.beneficiaryEmail && data.beneficiaryEmail.trim() !== '') score += 8;
    if (data.beneficiaryPhone && data.beneficiaryPhone.trim() !== '') score += 8;
    if (data.beneficiaryFirstName && data.beneficiaryFirstName.trim() !== '') score += 8;
    if (data.beneficiaryLastName && data.beneficiaryLastName.trim() !== '') score += 8;
    if (data.workAddress && data.workAddress.trim() !== '') score += 8;
    if (data.workCity && data.workCity.trim() !== '') score += 8;
    if (data.workPostcode && data.workPostcode.trim() !== '') score += 8;

    // Champs secondaires (5 points chacun)
    if (data.company && data.company.trim() !== '') score += 5;
    if (data.headquartersAddress && data.headquartersAddress.trim() !== '') score += 5;
    if (data.headquartersCity && data.headquartersCity.trim() !== '') score += 5;
    if (data.headquartersPostcode && data.headquartersPostcode.trim() !== '') score += 5;
    if (data.workCompanyName && data.workCompanyName.trim() !== '') score += 5;
    if (data.workRegion && data.workRegion.trim() !== '') score += 5;
    if (data.workClimateZone && data.workClimateZone.trim() !== '') score += 5;
    if (data.beneficiaryTitle && data.beneficiaryTitle.trim() !== '') score += 5;
    if (data.beneficiaryFunction && data.beneficiaryFunction.trim() !== '') score += 5;
    if (data.beneficiaryLandline && data.beneficiaryLandline.trim() !== '') score += 5;
    if (data.cadastralParcel && data.cadastralParcel.trim() !== '') score += 5;
    const surfaceM2Num = parseFloat(data.surfaceM2);
    if (data.surfaceM2 && !isNaN(surfaceM2Num) && surfaceM2Num > 0) score += 5;

    // Champs optionnels (3 points chacun)
    if (data.siretNumber && data.siretNumber.trim() !== '') score += 3;
    if (data.sirenNumber && data.sirenNumber.trim() !== '') score += 3;
    if (data.workSiret && data.workSiret.trim() !== '') score += 3;
    if (data.qualificationScore && data.qualificationScore > 0) score += 3;
    if (data.exteriorPhotoUrl && data.exteriorPhotoUrl.trim() !== '') score += 3;
    if (data.cadastralPhotoUrl && data.cadastralPhotoUrl.trim() !== '') score += 3;
    if (data.internalNotes && data.internalNotes.trim() !== '') score += 3;
    if (data.categoryId && data.categoryId.trim() !== '') score += 3;

    // Convertir en pourcentage (0-100)
    const percentage = Math.round((score / maxScore) * 100);
    return Math.min(100, Math.max(0, percentage));
  };

  // Calcul automatique de la zone climatique et de la région quand le code postal change
  useEffect(() => {
    if (formData.workPostcode && formData.workPostcode.trim() !== '') {
      const calculatedZone = calculateClimateZone(formData.workPostcode);
      const calculatedRegion = calculateRegion(formData.workPostcode);
      // Toujours mettre à jour la zone et la région quand le code postal change
      setFormData((prev) => ({ 
        ...prev, 
        workClimateZone: calculatedZone || '',
        workRegion: calculatedRegion || ''
      }));
    } else {
      // Si le code postal est supprimé, supprimer aussi la zone et la région
      setFormData((prev) => ({ 
        ...prev, 
        workClimateZone: '',
        workRegion: ''
      }));
    }
  }, [formData.workPostcode]);

  // Note: Le score est calculé directement dans le JSX via le lead virtuel
  // Pas besoin de useEffect pour mettre à jour lead, cela créerait une boucle infinie

  // Helper pour trimmer en toute sécurité
  const safeTrim = (value: string | undefined): string | undefined => {
    if (value === undefined || value === null) return undefined;
    const trimmed = String(value).trim();
    return trimmed === '' ? undefined : trimmed;
  };

  // Fonction de sauvegarde automatique
  const saveLead = async (showToast: boolean = false) => {
    // Ne pas sauvegarder pendant le chargement initial
    if (isInitialLoadRef.current) return;

    // Validation
    if (!formData.email || !formData.email.trim()) {
      if (showToast) {
        addToast({
          title: "Erreur",
          description: "L'email est requis",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      setSaving(true);

      const updatedLead = await updateLead(leadId, {
        // Informations de contact
        firstName: safeTrim(formData.firstName) || '',
        lastName: safeTrim(formData.lastName) || '',
        fullName: `${safeTrim(formData.firstName) || ''} ${safeTrim(formData.lastName) || ''}`.trim() || formData.email || '',
        email: safeTrim(formData.email) || '',
        phone: safeTrim(formData.phone),
        company: safeTrim(formData.company),
        statusId: formData.statusId || '',
        notes: safeTrim(formData.internalNotes),
        categoryId: formData.categoryId || undefined,
        
        // Siège Social
        headquartersAddress: safeTrim(formData.headquartersAddress),
        headquartersCity: safeTrim(formData.headquartersCity),
        headquartersPostcode: safeTrim(formData.headquartersPostcode),
        siretNumber: safeTrim(formData.siretNumber),
        sirenNumber: safeTrim(formData.sirenNumber),
        
        // Adresse des travaux
        workCompanyName: safeTrim(formData.workCompanyName),
        workAddress: safeTrim(formData.workAddress),
        workCity: safeTrim(formData.workCity),
        workPostcode: safeTrim(formData.workPostcode),
        workSiret: safeTrim(formData.workSiret),
        workRegion: safeTrim(formData.workRegion),
        workClimateZone: safeTrim(formData.workClimateZone),
        
        // Bénéficiaire
        beneficiaryTitle: safeTrim(formData.beneficiaryTitle),
        beneficiaryLastName: safeTrim(formData.beneficiaryLastName),
        beneficiaryFirstName: safeTrim(formData.beneficiaryFirstName),
        beneficiaryFunction: safeTrim(formData.beneficiaryFunction),
        beneficiaryPhone: safeTrim(formData.beneficiaryPhone),
        beneficiaryEmail: safeTrim(formData.beneficiaryEmail),
        beneficiaryLandline: safeTrim(formData.beneficiaryLandline),
        
        // Cadastre
        cadastralParcel: safeTrim(formData.cadastralParcel),
        qualificationScore: formData.qualificationScore > 0 ? formData.qualificationScore : undefined,
        surfaceM2: formData.surfaceM2 ? (isNaN(parseFloat(formData.surfaceM2)) ? undefined : parseFloat(formData.surfaceM2)) : undefined,
        
        // Photos
        exteriorPhotoUrl: safeTrim(formData.exteriorPhotoUrl),
        cadastralPhotoUrl: safeTrim(formData.cadastralPhotoUrl),
      });

      if (updatedLead) {
        // Recharger les données
        const [leadData, leadRawData] = await Promise.all([
          getLead(leadId),
          getLeadRaw(leadId),
        ]);
        setLead(leadData);
        setLeadRaw(leadRawData);
        setLastSaved(new Date());

        if (showToast) {
          addToast({
            title: "Succès",
            description: "Le lead a été mis à jour avec succès",
          });
        }
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      if (showToast) {
        addToast({
          title: "Erreur",
          description: "Impossible de mettre à jour le lead",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Handler pour onBlur (sauvegarde immédiate quand on quitte un champ)
  const handleFieldBlur = () => {
    // Annuler le debounce si en cours
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    // Sauvegarder immédiatement
    saveLead(false);
  };

  // Fonction pour sauvegarder avec des données spécifiques (pour les photos)
  const saveLeadWithData = async (updatedData: Partial<typeof formData>, showToast: boolean = false) => {
    // Ne pas sauvegarder pendant le chargement initial
    if (isInitialLoadRef.current) return;

    // Validation
    const email = updatedData.email !== undefined ? updatedData.email : formData.email;
    if (!email.trim()) {
      if (showToast) {
        addToast({
          title: "Erreur",
          description: "L'email est requis",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      setSaving(true);

      // Fusionner les données mises à jour avec les données du formulaire
      const mergedData = { ...formData, ...updatedData };

      // Helper pour trimmer en toute sécurité
      const safeTrim = (value: string | undefined): string | undefined => {
        if (value === undefined || value === null) return undefined;
        const trimmed = String(value).trim();
        return trimmed === '' ? undefined : trimmed;
      };

      const updatedLead = await updateLead(leadId, {
        // Informations de contact
        firstName: safeTrim(mergedData.firstName) || '',
        lastName: safeTrim(mergedData.lastName) || '',
        fullName: `${safeTrim(mergedData.firstName) || ''} ${safeTrim(mergedData.lastName) || ''}`.trim() || mergedData.email || '',
        email: safeTrim(mergedData.email) || '',
        phone: safeTrim(mergedData.phone),
        company: safeTrim(mergedData.company),
        statusId: mergedData.statusId || '',
        notes: safeTrim(mergedData.internalNotes),
        categoryId: mergedData.categoryId || undefined,
        
        // Siège Social
        headquartersAddress: safeTrim(mergedData.headquartersAddress),
        headquartersCity: safeTrim(mergedData.headquartersCity),
        headquartersPostcode: safeTrim(mergedData.headquartersPostcode),
        siretNumber: safeTrim(mergedData.siretNumber),
        sirenNumber: safeTrim(mergedData.sirenNumber),
        
        // Adresse des travaux
        workCompanyName: safeTrim(mergedData.workCompanyName),
        workAddress: safeTrim(mergedData.workAddress),
        workCity: safeTrim(mergedData.workCity),
        workPostcode: safeTrim(mergedData.workPostcode),
        workSiret: safeTrim(mergedData.workSiret),
        workRegion: safeTrim(mergedData.workRegion),
        workClimateZone: safeTrim(mergedData.workClimateZone),
        
        // Bénéficiaire
        beneficiaryTitle: safeTrim(mergedData.beneficiaryTitle),
        beneficiaryLastName: safeTrim(mergedData.beneficiaryLastName),
        beneficiaryFirstName: safeTrim(mergedData.beneficiaryFirstName),
        beneficiaryFunction: safeTrim(mergedData.beneficiaryFunction),
        beneficiaryPhone: safeTrim(mergedData.beneficiaryPhone),
        beneficiaryEmail: safeTrim(mergedData.beneficiaryEmail),
        beneficiaryLandline: safeTrim(mergedData.beneficiaryLandline),
        
        // Cadastre
        cadastralParcel: safeTrim(mergedData.cadastralParcel),
        qualificationScore: mergedData.qualificationScore > 0 ? mergedData.qualificationScore : undefined,
        surfaceM2: mergedData.surfaceM2 ? (isNaN(parseFloat(mergedData.surfaceM2)) ? undefined : parseFloat(mergedData.surfaceM2)) : undefined,
        
        // Photos
        exteriorPhotoUrl: safeTrim(mergedData.exteriorPhotoUrl),
        cadastralPhotoUrl: safeTrim(mergedData.cadastralPhotoUrl),
      });

      if (updatedLead) {
        // Recharger les données
        const [leadData, leadRawData] = await Promise.all([
          getLead(leadId),
          getLeadRaw(leadId),
        ]);
        setLead(leadData);
        setLeadRaw(leadRawData);
        setLastSaved(new Date());

        if (showToast) {
          addToast({
            title: "Succès",
            description: "Le lead a été mis à jour avec succès",
          });
        }
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      if (showToast) {
        addToast({
          title: "Erreur",
          description: "Impossible de mettre à jour le lead",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Helper pour créer les props onChange et onBlur pour les champs
  const createFieldProps = (fieldName: keyof typeof formData) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }));
    },
    onBlur: handleFieldBlur,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [leadData, leadRawData, categoriesData, statusesData] = await Promise.all([
          getLead(leadId),
          getLeadRaw(leadId),
          getCategories(),
          getLeadStatuses(),
        ]);

        if (!leadData || !leadRawData) {
          addToast({
            title: "Erreur",
            description: "Lead introuvable",
            variant: "destructive",
          });
          router.push("/admin/leads");
          return;
        }

        setLead(leadData);
        setLeadRaw(leadRawData);
        setCategories(categoriesData);
        setLeadStatuses(statusesData);

        // Initialize form data
        isInitialLoadRef.current = true;
        setFormData({
          // Informations de contact
          firstName: leadData.firstName || "",
          lastName: leadData.lastName || "",
          email: leadData.email || "",
          phone: leadData.phone || "",
          company: leadData.company || "",
          statusId: leadData.statusId || "",
          categoryId: leadRawData.category_id || "",
          internalNotes: leadRawData.internal_notes || "",
          
          // Siège Social
          headquartersAddress: leadData.headquartersAddress || leadRawData.headquarters_address || "",
          headquartersCity: leadData.headquartersCity || leadRawData.headquarters_city || "",
          headquartersPostcode: leadData.headquartersPostcode || leadRawData.headquarters_postcode || "",
          siretNumber: leadData.siretNumber || leadRawData.siret_number || "",
          sirenNumber: leadData.sirenNumber || leadRawData.siren_number || "",
          
          // Adresse des travaux
          workCompanyName: leadData.workCompanyName || leadRawData.work_company_name || "",
          workAddress: leadData.workAddress || leadRawData.work_address || "",
          workCity: leadData.workCity || leadRawData.work_city || "",
          workPostcode: leadData.workPostcode || leadRawData.work_postcode || "",
          workSiret: leadData.workSiret || leadRawData.work_siret || "",
          workRegion: leadData.workRegion || leadRawData.work_region || "",
          workClimateZone: leadData.workClimateZone || leadRawData.work_climate_zone || "",
          
          // Bénéficiaire
          beneficiaryTitle: leadData.beneficiaryTitle || leadRawData.beneficiary_title || "",
          beneficiaryLastName: leadData.beneficiaryLastName || leadRawData.beneficiary_last_name || "",
          beneficiaryFirstName: leadData.beneficiaryFirstName || leadRawData.beneficiary_first_name || "",
          beneficiaryFunction: leadData.beneficiaryFunction || leadRawData.beneficiary_function || "",
          beneficiaryPhone: leadData.beneficiaryPhone || leadRawData.beneficiary_phone || "",
          beneficiaryEmail: leadData.beneficiaryEmail || leadRawData.beneficiary_email || "",
          beneficiaryLandline: leadData.beneficiaryLandline || leadRawData.beneficiary_landline || "",
          
          // Cadastre
          cadastralParcel: leadData.cadastralParcel || leadRawData.cadastral_parcel || "",
          qualificationScore: leadData.qualificationScore !== undefined ? leadData.qualificationScore : (leadRawData.qualification_score || 0),
          surfaceM2: leadData.surfaceM2 !== undefined ? String(leadData.surfaceM2) : (leadRawData.surface_m2 ? String(leadRawData.surface_m2) : ""),
          
          // Photos
          exteriorPhotoUrl: leadData.exteriorPhotoUrl || leadRawData.exterior_photo_url || "",
          cadastralPhotoUrl: leadData.cadastralPhotoUrl || leadRawData.cadastral_photo_url || "",
        });
        
        // Marquer le chargement initial comme terminé après un court délai
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 1000);
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          title: "Erreur",
          description: "Impossible de charger les données du lead",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (leadId) {
      loadData();
    }
  }, [leadId, router, addToast]);


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

  if (!lead || !leadRaw) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lead introuvable"
          description="Le lead demandé n'existe pas"
        />
        <Button onClick={() => router.push("/admin/leads")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  const hasUtmParams =
    leadRaw.utm_source ||
    leadRaw.utm_medium ||
    leadRaw.utm_campaign ||
    leadRaw.utm_term ||
    leadRaw.utm_content ||
    leadRaw.gclid ||
    leadRaw.fbclid;

  return (
    <div className="space-y-6">
      <PageHeader
        title={lead.fullName || "Lead"}
        description="Consultez et modifiez les informations du lead"
        actions={
          <Button
            variant="outline"
            onClick={() => router.push("/admin/leads")}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        }
      />

      {/* Score de complétion - Utiliser un lead virtuel basé sur formData pour le calcul en temps réel */}
      {lead && (() => {
        // Créer un lead virtuel avec les données du formulaire pour le calcul en temps réel
        const virtualLead: Lead = {
          ...lead,
          // Informations de contact
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim() || lead.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          notes: formData.internalNotes,
          // Siège Social
          headquartersAddress: formData.headquartersAddress,
          headquartersCity: formData.headquartersCity,
          headquartersPostcode: formData.headquartersPostcode,
          siretNumber: formData.siretNumber,
          sirenNumber: formData.sirenNumber,
          // Adresse des travaux
          workCompanyName: formData.workCompanyName,
          workAddress: formData.workAddress,
          workCity: formData.workCity,
          workPostcode: formData.workPostcode,
          workSiret: formData.workSiret,
          workRegion: formData.workRegion,
          workClimateZone: formData.workClimateZone,
          // Bénéficiaire
          beneficiaryTitle: formData.beneficiaryTitle,
          beneficiaryLastName: formData.beneficiaryLastName,
          beneficiaryFirstName: formData.beneficiaryFirstName,
          beneficiaryFunction: formData.beneficiaryFunction,
          beneficiaryPhone: formData.beneficiaryPhone,
          beneficiaryEmail: formData.beneficiaryEmail,
          beneficiaryLandline: formData.beneficiaryLandline,
          // Cadastre
          cadastralParcel: formData.cadastralParcel,
          qualificationScore: formData.qualificationScore,
          surfaceM2: formData.surfaceM2 ? parseFloat(formData.surfaceM2) : undefined,
          // Photos
          exteriorPhotoUrl: formData.exteriorPhotoUrl,
          cadastralPhotoUrl: formData.cadastralPhotoUrl,
          // Score calculé en temps réel
          completionScore: calculateCompletionScore(formData),
        };
        return <LeadScoreCard lead={virtualLead} />;
      })()}

      {/* Indicateur de sauvegarde automatique */}
      {lastSaved && (
        <div className="flex items-center gap-2 text-sm text-effinor-gray-text bg-effinor-gray-light px-4 py-2 rounded-md border border-effinor-emerald/20">
          <CheckCircle2 className="h-4 w-4 text-effinor-emerald" />
          <span>Dernière sauvegarde automatique : {format(lastSaved, "dd MMM yyyy à HH:mm:ss")}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Section 1: Informations de contact - Priorité */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Informations de contact</CardTitle>
            <CardDescription>
              Informations principales du lead
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  {...createFieldProps('firstName')}
                  placeholder="Prénom"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold">
                  Nom
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  {...createFieldProps('lastName')}
                  placeholder="Nom"
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                {...createFieldProps('email')}
                required
                placeholder="email@example.com"
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  {...createFieldProps('phone')}
                  placeholder="+33 6 12 34 56 78"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-semibold">
                  Entreprise
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  {...createFieldProps('company')}
                  placeholder="Nom de l'entreprise"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Statut et catégorie */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Statut</CardTitle>
              <CardDescription>
                Statut actuel du lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Statut
                </Label>
                <Select
                  id="status"
                  value={formData.statusId}
                  {...createFieldProps('statusId')}
                  className="h-11"
                >
                  {leadStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Catégorie</CardTitle>
              <CardDescription>
                Catégorie du lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">
                  Catégorie
                </Label>
                <Select
                  id="category"
                  value={formData.categoryId}
                  {...createFieldProps('categoryId')}
                  className="h-11"
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Siège Social */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Siège Social</CardTitle>
            <CardDescription>
              Informations du siège social de l'entreprise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="headquartersAddress" className="text-sm font-semibold">
                Adresse du siège
              </Label>
              <Input
                id="headquartersAddress"
                value={formData.headquartersAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, headquartersAddress: e.target.value }))}
                placeholder="140 RUE DE LA CROIX D'AMES"
                className="h-11"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="headquartersCity" className="text-sm font-semibold">
                  Ville siège
                </Label>
                <Input
                  id="headquartersCity"
                  value={formData.headquartersCity}
                  {...createFieldProps('headquartersCity')}
                  placeholder="AMES"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headquartersPostcode" className="text-sm font-semibold">
                  Code Postal Siège
                </Label>
                <Input
                  id="headquartersPostcode"
                  value={formData.headquartersPostcode}
                  {...createFieldProps('headquartersPostcode')}
                  placeholder="62190"
                  className="h-11"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siretNumber" className="text-sm font-semibold">
                  N° de Siret
                </Label>
                <Input
                  id="siretNumber"
                  value={formData.siretNumber}
                  {...createFieldProps('siretNumber')}
                  placeholder="80915095600013"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sirenNumber" className="text-sm font-semibold">
                  Siren
                </Label>
                <Input
                  id="sirenNumber"
                  value={formData.sirenNumber}
                  {...createFieldProps('sirenNumber')}
                  placeholder="809150956"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Adresse des travaux */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Adresse des travaux</CardTitle>
            <CardDescription>
              Informations du site où les travaux seront effectués
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="workCompanyName" className="text-sm font-semibold">
                Raison sociale
              </Label>
              <Input
                id="workCompanyName"
                value={formData.workCompanyName}
                {...createFieldProps('workCompanyName')}
                placeholder="DE LA CROIX D'AMES"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workAddress" className="text-sm font-semibold">
                Adresse des travaux
              </Label>
              <Input
                id="workAddress"
                value={formData.workAddress}
                {...createFieldProps('workAddress')}
                placeholder="140 RUE DE LA CROIX D'AMES"
                className="h-11"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workCity" className="text-sm font-semibold">
                  Ville travaux
                </Label>
                <Input
                  id="workCity"
                  value={formData.workCity}
                  {...createFieldProps('workCity')}
                  placeholder="AMES"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workPostcode" className="text-sm font-semibold">
                  Code postale travaux
                </Label>
                <Input
                  id="workPostcode"
                  value={formData.workPostcode}
                  {...createFieldProps('workPostcode')}
                  placeholder="62190"
                  className="h-11"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workSiret" className="text-sm font-semibold">
                SIRET DU SITE DES TRAVAUX
              </Label>
              <Input
                id="workSiret"
                value={formData.workSiret}
                {...createFieldProps('workSiret')}
                placeholder="80915095600013"
                className="h-11"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workRegion" className="text-sm font-semibold">
                  Region
                </Label>
                <Input
                  id="workRegion"
                  value={formData.workRegion || (formData.workPostcode ? calculateRegion(formData.workPostcode) || "" : "")}
                  readOnly
                  placeholder="Hauts-de-France"
                  className="h-11 bg-effinor-gray-light cursor-not-allowed"
                  title="Région calculée automatiquement depuis le code postal"
                />
                {formData.workPostcode && (
                  <p className="text-xs text-effinor-gray-text">
                    Calculée automatiquement depuis le code postal
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="workClimateZone" className="text-sm font-semibold">
                  Zone climatique
                </Label>
                <Input
                  id="workClimateZone"
                  value={formData.workClimateZone || (formData.workPostcode ? calculateClimateZone(formData.workPostcode) || "" : "")}
                  readOnly
                  placeholder="H1"
                  className="h-11 bg-effinor-gray-light cursor-not-allowed"
                  title="Zone calculée automatiquement depuis le code postal"
                />
                {formData.workPostcode && (
                  <p className="text-xs text-effinor-gray-text">
                    Calculée automatiquement depuis le code postal
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Bénéficiaire de travaux */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bénéficiaire de travaux</CardTitle>
                <CardDescription>
                  Informations du responsable bénéficiaire
                </CardDescription>
              </div>
              {formData.beneficiaryPhone && (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  asChild
                >
                  <a href={`tel:${formData.beneficiaryPhone.replace(/\s/g, '')}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler le client
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beneficiaryTitle" className="text-sm font-semibold">
                  Civilité
                </Label>
                <Select
                  id="beneficiaryTitle"
                  value={formData.beneficiaryTitle}
                  {...createFieldProps('beneficiaryTitle')}
                  className="h-11"
                >
                  <option value="">-</option>
                  <option value="M.">M.</option>
                  <option value="Mme">Mme</option>
                  <option value="Mlle">Mlle</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiaryLastName" className="text-sm font-semibold">
                  Nom du responsable
                </Label>
                <Input
                  id="beneficiaryLastName"
                  value={formData.beneficiaryLastName}
                  {...createFieldProps('beneficiaryLastName')}
                  placeholder="BOUCHER"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiaryFirstName" className="text-sm font-semibold">
                  Prénom du responsable
                </Label>
                <Input
                  id="beneficiaryFirstName"
                  value={formData.beneficiaryFirstName}
                  {...createFieldProps('beneficiaryFirstName')}
                  placeholder="Marion"
                  className="h-11"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beneficiaryFunction" className="text-sm font-semibold">
                  Fonction du responsable
                </Label>
                <Input
                  id="beneficiaryFunction"
                  value={formData.beneficiaryFunction}
                  {...createFieldProps('beneficiaryFunction')}
                  placeholder="Responsable Logistique"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiaryPhone" className="text-sm font-semibold">
                  Num de tél du responsable
                </Label>
                <Input
                  id="beneficiaryPhone"
                  type="tel"
                  value={formData.beneficiaryPhone}
                  {...createFieldProps('beneficiaryPhone')}
                  placeholder="0321619293"
                  className="h-11"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beneficiaryEmail" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="beneficiaryEmail"
                  type="email"
                  value={formData.beneficiaryEmail}
                  {...createFieldProps('beneficiaryEmail')}
                  placeholder="logistique@bovinsterroirs.fr"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiaryLandline" className="text-sm font-semibold">
                  Num de téléphone fixe
                </Label>
                <Input
                  id="beneficiaryLandline"
                  type="tel"
                  value={formData.beneficiaryLandline}
                  {...createFieldProps('beneficiaryLandline')}
                  placeholder="0321619293"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Photos */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Photos du site et de la parcelle cadastrale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LeadPhotoUploader
              leadId={leadId}
              photoUrl={formData.exteriorPhotoUrl || null}
              onPhotoChange={async (url) => {
                const newUrl = url || "";
                // Mettre à jour le state immédiatement
                setFormData((prev) => ({ ...prev, exteriorPhotoUrl: newUrl }));
                // Sauvegarder automatiquement avec la nouvelle URL
                await saveLeadWithData({ exteriorPhotoUrl: newUrl }, false);
              }}
              label="photo exterieur"
              photoType="exterior"
            />
            
            <LeadPhotoUploader
              leadId={leadId}
              photoUrl={formData.cadastralPhotoUrl || null}
              onPhotoChange={async (url) => {
                const newUrl = url || "";
                // Mettre à jour le state immédiatement
                setFormData((prev) => ({ ...prev, cadastralPhotoUrl: newUrl }));
                // Sauvegarder automatiquement avec la nouvelle URL
                await saveLeadWithData({ cadastralPhotoUrl: newUrl }, false);
              }}
              label="Photo de la parcelle cadastral"
              photoType="cadastral"
            />
          </CardContent>
        </Card>

        {/* Section 7: Informations cadastrales */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Informations cadastrales</CardTitle>
            <CardDescription>
              Détails de la parcelle et qualification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="cadastralParcel" className="text-sm font-semibold">
                Parcelle cadastrale travaux
              </Label>
              <Input
                id="cadastralParcel"
                value={formData.cadastralParcel}
                {...createFieldProps('cadastralParcel')}
                placeholder="000 / 0B / 0281"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                qualification
              </Label>
              <StarRating
                value={formData.qualificationScore}
                onChange={async (value) => {
                  // Mettre à jour le state immédiatement
                  setFormData((prev) => ({ ...prev, qualificationScore: value }));
                  // Sauvegarder automatiquement avec la nouvelle valeur
                  await saveLeadWithData({ qualificationScore: value }, false);
                }}
                maxStars={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="surfaceM2" className="text-sm font-semibold">
                Surface m2
              </Label>
              <Input
                id="surfaceM2"
                type="number"
                step="0.1"
                value={formData.surfaceM2}
                {...createFieldProps('surfaceM2')}
                placeholder="4 850,0"
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 9: Informations du lead */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Informations du lead</CardTitle>
            <CardDescription>
              Informations collectées lors de la soumission du formulaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-effinor-gray-text">Source</Label>
                <p className="text-sm text-effinor-gray-dark mt-1">
                  {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-effinor-gray-text">Langue</Label>
                <p className="text-sm text-effinor-gray-dark mt-1">
                  {leadRaw.lang?.toUpperCase() || "N/A"}
                </p>
              </div>
            </div>

            {leadRaw.page && (
              <div>
                <Label className="text-sm font-semibold text-effinor-gray-text">Page</Label>
                <p className="text-sm text-effinor-gray-dark mt-1">{leadRaw.page}</p>
              </div>
            )}

            {leadRaw.origin && (
              <div>
                <Label className="text-sm font-semibold text-effinor-gray-text">Origine</Label>
                <p className="text-sm text-effinor-gray-dark mt-1">{leadRaw.origin}</p>
              </div>
            )}

            {leadRaw.solution && (
              <div>
                <Label className="text-sm font-semibold text-effinor-gray-text">Solution</Label>
                <p className="text-sm text-effinor-gray-dark mt-1">{leadRaw.solution}</p>
              </div>
            )}

            <div>
              <Label className="text-sm font-semibold text-effinor-gray-text">Date de création</Label>
              <p className="text-sm text-effinor-gray-dark mt-1">
                {format(lead.createdAt, "dd MMM yyyy à HH:mm")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Notes */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              Message du lead et notes internes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {leadRaw.message && (
              <div>
                <Label className="text-sm font-semibold text-effinor-gray-text">
                  Message du lead
                </Label>
                <div className="mt-2 p-3 bg-effinor-gray-light rounded-md text-sm text-effinor-gray-dark">
                  {leadRaw.message}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="internalNotes" className="text-sm font-semibold">
                Notes internes
              </Label>
              <textarea
                id="internalNotes"
                value={formData.internalNotes}
                {...createFieldProps('internalNotes')}
                className="w-full min-h-[120px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-effinor-gray-dark placeholder:text-effinor-gray-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-effinor-emerald focus-visible:ring-offset-2 focus-visible:border-effinor-emerald resize-y"
                placeholder="Ajoutez des notes internes sur ce lead..."
              />
            </div>
          </CardContent>
        </Card>

        {/* UTM Parameters */}
        {hasUtmParams && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Paramètres UTM</CardTitle>
              <CardDescription>
                Paramètres de tracking marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {leadRaw.utm_source && (
                <div>
                  <Label className="text-sm font-semibold text-effinor-gray-text">UTM Source</Label>
                  <p className="text-sm text-effinor-gray-dark mt-1">{leadRaw.utm_source}</p>
                </div>
              )}
              {leadRaw.utm_medium && (
                <div>
                  <Label className="text-sm font-semibold text-effinor-gray-text">UTM Medium</Label>
                  <p className="text-sm text-effinor-gray-dark mt-1">{leadRaw.utm_medium}</p>
                </div>
              )}
              {leadRaw.utm_campaign && (
                <div>
                  <Label className="text-sm font-semibold text-effinor-gray-text">UTM Campaign</Label>
                  <p className="text-sm text-effinor-gray-dark mt-1">{leadRaw.utm_campaign}</p>
                </div>
              )}
              {leadRaw.utm_term && (
                <div>
                  <Label className="text-sm font-semibold text-effinor-gray-text">UTM Term</Label>
                  <p className="text-sm text-effinor-gray-dark mt-1">{leadRaw.utm_term}</p>
                </div>
              )}
              {leadRaw.utm_content && (
                <div>
                  <Label className="text-sm font-semibold text-effinor-gray-text">UTM Content</Label>
                  <p className="text-sm text-effinor-gray-dark mt-1">{leadRaw.utm_content}</p>
                </div>
              )}
              {leadRaw.gclid && (
                <div>
                  <Label className="text-sm font-semibold text-effinor-gray-text">Google Click ID</Label>
                  <p className="text-sm text-effinor-gray-dark mt-1 font-mono text-xs">{leadRaw.gclid}</p>
                </div>
              )}
              {leadRaw.fbclid && (
                <div>
                  <Label className="text-sm font-semibold text-effinor-gray-text">Facebook Click ID</Label>
                  <p className="text-sm text-effinor-gray-dark mt-1 font-mono text-xs">{leadRaw.fbclid}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}