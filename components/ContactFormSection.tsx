'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { submitContactLead, updateContactLead } from '@/app/actions/contact';
import { createClient } from '@supabase/supabase-js';
import { Lang, Dictionary } from '@/types';
import { Zap, User, Phone, Mail, Building, Square, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types de bâtiment disponibles (valeurs fixes)
const BUILDING_TYPES: Record<Lang, Array<{ value: string; label: string }>> = {
  fr: [
    { value: 'entrepot-logistique', label: 'Entrepôt / Logistique' },
    { value: 'bureau', label: 'Bureau' },
    { value: 'usine-production', label: 'Usine / Production' },
    { value: 'commerce-retail', label: 'Commerce / Retail' },
    { value: 'autre-batiment', label: 'Autre' },
  ],
  en: [
    { value: 'entrepot-logistique', label: 'Warehouse / Logistics' },
    { value: 'bureau', label: 'Office' },
    { value: 'usine-production', label: 'Factory / Production' },
    { value: 'commerce-retail', label: 'Commerce / Retail' },
    { value: 'autre-batiment', label: 'Other' },
  ],
  ar: [
    { value: 'entrepot-logistique', label: 'مستودع / لوجستيات' },
    { value: 'bureau', label: 'مكتب' },
    { value: 'usine-production', label: 'مصنع / إنتاج' },
    { value: 'commerce-retail', label: 'تجارة / بيع بالتجزئة' },
    { value: 'autre-batiment', label: 'آخر' },
  ],
};

interface ContactFormSectionProps {
  lang: Lang;
  dict: Dictionary;
  compact?: boolean; // Mode compact sans titre pour le hero
  categories?: Array<{ id: string; slug: string; name: string }>; // Catégories optionnelles
}

export default function ContactFormSection({ lang, dict, compact = false, categories }: ContactFormSectionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [surfaceM2, setSurfaceM2] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [existingLeads, setExistingLeads] = useState<Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    status: string;
  }>>([]);

  // Détecter le leadId depuis l'URL ou localStorage
  const urlLeadId = searchParams.get('leadId');
  const localStorageKey = `current-lead-id-${lang}`;

  // On prépare les champs UTM/gclid/fbclid depuis l'URL
  const utm_source = searchParams.get('utm_source') ?? '';
  const utm_medium = searchParams.get('utm_medium') ?? '';
  const utm_campaign = searchParams.get('utm_campaign') ?? '';
  const utm_term = searchParams.get('utm_term') ?? '';
  const utm_content = searchParams.get('utm_content') ?? '';
  const gclid = searchParams.get('gclid') ?? '';
  const fbclid = searchParams.get('fbclid') ?? '';

  // Charger le leadId depuis localStorage ou URL
  useEffect(() => {
    const storedLeadId = localStorage.getItem(localStorageKey);
    const leadId = urlLeadId || storedLeadId;
    
    if (leadId) {
      setCurrentLeadId(leadId);
      // Charger les données du lead
      loadLeadData(leadId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlLeadId, localStorageKey]);

  // Fonction pour charger les données du lead
  const loadLeadData = async (leadId: string) => {
    try {
      setLoading(true);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase environment variables');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: lead, error } = await supabase
        .from('leads')
        .select('name, email, phone, building_type, surface_m2')
        .eq('id', leadId)
        .single();

      if (!error && lead) {
        setName(lead.name || '');
        setEmail(lead.email || '');
        setPhone(lead.phone || '');
        setSelectedBuildingType(lead.building_type || '');
        setSurfaceM2(lead.surface_m2 ? String(lead.surface_m2) : '');
      }
    } catch (error) {
      console.error('Error loading lead data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save avec debounce
  useEffect(() => {
    if (!currentLeadId) return; // Pas de leadId, pas d'auto-save

    // Nettoyer le timeout précédent
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Créer un nouveau timeout pour sauvegarder après 1 seconde d'inactivité
    saveTimeoutRef.current = setTimeout(async () => {
      // Ne sauvegarder que si au moins un champ essentiel est rempli
      if (name.trim() || email.trim() || phone.trim()) {
        setSaving(true);
        setSaved(false);
        
        try {
          const result = await updateContactLead(currentLeadId, {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            building_type: selectedBuildingType,
            surface_m2: surfaceM2 ? parseFloat(surfaceM2) : undefined,
          });

          if (result.success) {
            setSaved(true);
            // Masquer le message "sauvegardé" après 2 secondes
            setTimeout(() => setSaved(false), 2000);
          }
        } catch (error) {
          console.error('Error auto-saving:', error);
        } finally {
          setSaving(false);
        }
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentLeadId, name, email, phone, selectedBuildingType, surfaceM2]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    setErrorCode(null);
    setDuplicateWarning(false);
    setExistingLeads([]);

    // Sauvegarder la référence du formulaire avant l'opération asynchrone
    const form = e.currentTarget;

    const formData = new FormData(form);

    // On injecte ici les champs cachés
    formData.set('lang', lang);
    formData.set('page', pathname || '/');
    // Détecter l'origine automatiquement
    const origin = pathname?.includes('/contact') ? 'contact_page_form' : 'homepage_form';
    formData.set('origin', origin);

    // Ajouter le type de bâtiment sélectionné
    if (selectedBuildingType) {
      formData.set('building_type', selectedBuildingType);
    } else {
      formData.set('building_type', '');
    }

    // Ajouter les paramètres UTM si présents
    if (utm_source) formData.set('utm_source', utm_source);
    if (utm_medium) formData.set('utm_medium', utm_medium);
    if (utm_campaign) formData.set('utm_campaign', utm_campaign);
    if (utm_term) formData.set('utm_term', utm_term);
    if (utm_content) formData.set('utm_content', utm_content);
    if (gclid) formData.set('gclid', gclid);
    if (fbclid) formData.set('fbclid', fbclid);

    const result = await submitContactLead(formData);

    if (result.success) {
      // Vérifier si des doublons ont été détectés
      if ('duplicateWarning' in result && result.duplicateWarning && 'existingLeads' in result) {
        setDuplicateWarning(true);
        setExistingLeads(result.existingLeads || []);
        setStatus('success'); // On garde success pour permettre la redirection
      } else {
        setStatus('success');
      }
      
      // Stocker le leadId dans localStorage
      if ('leadId' in result && result.leadId) {
        const leadId = result.leadId;
        setCurrentLeadId(leadId);
        localStorage.setItem(localStorageKey, leadId);
        
        // Rediriger vers le formulaire détaillé avec le leadId
        // (même s'il y a des doublons, on continue le processus)
        router.push(`/${lang}/formulaire?leadId=${leadId}`);
      } else {
        // Utiliser la référence sauvegardée au lieu de e.currentTarget
        form.reset();
        setSelectedBuildingType(''); // Réinitialiser la sélection
        setName('');
        setEmail('');
        setPhone('');
        setSurfaceM2('');
      }
    } else {
      setStatus('error');
      setErrorCode(result.error ?? null);
    }

    setSubmitting(false);
  }

  // Titre et sous-titre personnalisés
  // En mode compact (homepage), utiliser les nouveaux titres d'estimation
  const formTitle = compact ? (dict.contact.form.estimateTitle || dict.contact.form.formTitle) : dict.contact.form.formTitle;
  const formSubtitle = compact ? (dict.contact.form.estimateSubtitle || dict.contact.subtitle) : (dict.contact.subtitle || 'Réponse en moins de 24h pour vos solutions LED, air, bureau d\'étude et bornes de recharge.');

  // Structure du formulaire
  // Sur la page d'accueil, le formulaire est dans une Card blanche, donc texte sombre
  // Sur les pages solutions, le formulaire peut être sur fond sombre
  // Par défaut, on utilise les couleurs pour fond clair (Card blanche)
  const labelTextColor = 'text-gray-800';
  const inputTextColor = 'text-gray-900 placeholder:text-gray-400';
  const selectTextColor = 'text-gray-900 bg-white border-gray-300';
  const iconColor = 'text-gray-400';
  
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Indicateur de sauvegarde */}
      {currentLeadId && (saving || saved) && (
        <div className="flex items-center gap-2 text-sm text-[#10B981] mb-2">
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
              <span>Sauvegarde en cours...</span>
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistré</span>
            </>
          ) : null}
        </div>
      )}

      {/* Nom complet */}
      <div>
        <label htmlFor="name" className={`block text-sm font-medium ${labelTextColor} mb-1`}>
          {dict.contact.form.name} *
        </label>
        <div className="flex items-center gap-2">
          <User className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Jean Dupont"
            className="flex-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
          />
        </div>
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="phone" className={`block text-sm font-medium ${labelTextColor} mb-1`}>
          {dict.contact.form.phone} *
        </label>
        <div className="flex items-center gap-2">
          <Phone className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+33 6 XX XX XX XX"
            className="flex-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
          />
        </div>
      </div>

      {/* Type de bâtiment */}
      <div>
        <label htmlFor="building_type" className={`block text-sm font-medium ${labelTextColor} mb-1`}>
          {dict.contact.form.buildingTypeLabel || dict.contact.form.needTypeLabel} *
        </label>
        <div className="flex items-center gap-2">
          <Building className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
          <div className="relative flex-1">
            <select
              id="building_type"
              name="building_type"
              value={selectedBuildingType}
              onChange={(e) => setSelectedBuildingType(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
            >
              <option value="" disabled>
                {lang === 'fr' ? 'Sélectionner...' : lang === 'en' ? 'Select...' : 'اختر...'}
              </option>
              {BUILDING_TYPES[lang].map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className={`w-4 h-4 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Surface (m²) */}
      <div>
        <label htmlFor="surface_m2" className={`block text-sm font-medium ${labelTextColor} mb-1`}>
          {dict.contact.form.surfaceLabel} *
        </label>
        <div className="flex items-center gap-2">
          <Square className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
          <input
            type="number"
            id="surface_m2"
            name="surface_m2"
            value={surfaceM2}
            onChange={(e) => setSurfaceM2(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="Ex: 1000"
            className="flex-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
          />
        </div>
      </div>

      {/* Email professionnel */}
      <div>
        <label htmlFor="email" className={`block text-sm font-medium ${labelTextColor} mb-1`}>
          {dict.contact.form.email} *
        </label>
        <div className="flex items-center gap-2">
          <Mail className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre.email@entreprise.fr"
            className="flex-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
          />
        </div>
      </div>

      {/* Champs cachés (pour s'assurer qu'ils sont bien présents) */}
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="page" value={pathname || '/'} />
      <input 
        type="hidden" 
        name="origin" 
        value={pathname?.includes('/contact') ? 'contact_page_form' : 'homepage_form'} 
      />
      <input type="hidden" name="utm_source" value={utm_source} />
      <input type="hidden" name="utm_medium" value={utm_medium} />
      <input type="hidden" name="utm_campaign" value={utm_campaign} />
      <input type="hidden" name="utm_term" value={utm_term} />
      <input type="hidden" name="utm_content" value={utm_content} />
      <input type="hidden" name="gclid" value={gclid} />
      <input type="hidden" name="fbclid" value={fbclid} />
      {/* Champs optionnels en hidden si nécessaire */}
      <input type="hidden" name="company" value="" />
      <input type="hidden" name="message" value="" />

      {/* Messages de statut */}
      {status === 'success' && !duplicateWarning && (
        <div className="p-4 rounded-lg bg-green-50 text-green-800 text-sm">
          {dict.contact.form.success}
        </div>
      )}

      {/* Alerte de doublon */}
      {duplicateWarning && existingLeads.length > 0 && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
          <div className="flex items-start gap-2 mb-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">
                {lang === 'fr' 
                  ? '⚠️ Lead existant détecté' 
                  : lang === 'en' 
                  ? '⚠️ Existing lead detected' 
                  : '⚠️ تم اكتشاف عميل محتمل موجود'}
              </h4>
              <p className="text-sm mb-3">
                {lang === 'fr'
                  ? `Un ou plusieurs leads existent déjà avec cet email. Votre demande a été enregistrée, mais vous pouvez consulter les leads existants :`
                  : lang === 'en'
                  ? `One or more leads already exist with this email. Your request has been recorded, but you can view existing leads:`
                  : `يوجد عميل محتمل واحد أو أكثر بهذا البريد الإلكتروني. تم تسجيل طلبك، ولكن يمكنك عرض العملاء المحتملين الموجودين:`}
              </p>
              <div className="space-y-2">
                {existingLeads.map((lead) => (
                  <div key={lead.id} className="p-3 bg-white rounded border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-gray-600">{lead.email}</p>
                        <p className="text-xs text-gray-500">
                          {lang === 'fr' ? 'Créé le' : lang === 'en' ? 'Created on' : 'تم الإنشاء في'}{' '}
                          {format(new Date(lead.created_at), 'dd MMM yyyy', { locale: lang === 'fr' ? fr : undefined })}
                        </p>
                      </div>
                      <a
                        href={`${typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':3001') : 'http://localhost:3001'}/admin/leads/${lead.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#10B981] hover:underline font-medium"
                      >
                        {lang === 'fr' ? 'Voir →' : lang === 'en' ? 'View →' : 'عرض →'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 text-red-800 text-sm">
          {dict.contact.form.error} {errorCode && `(${errorCode})`}
        </div>
      )}

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#10B981] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2"
      >
        {submitting ? (
          dict.contact.form.submitting
        ) : (
          <>
            ✨ {lang === 'fr' ? 'Obtenir mon estimation gratuite' : lang === 'en' ? 'Get my free estimate' : 'احصل على تقديري المجاني'}
          </>
        )}
      </button>
    </form>
  );

  // Si mode compact, on retourne juste le formulaire dans un wrapper avec titre/sous-titre
  // La Card a toujours un fond blanc, donc les textes sont toujours sombres
  if (compact) {
    return (
      <Card className="max-w-md bg-white" padding="md">
        {/* Icône éclair en haut à gauche */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-[#10B981]" />
          </div>
        </div>

        {/* Titre et sous-titre centrés */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#0F172A] mb-1">
            {formTitle}
          </h2>
          <p className="text-sm text-[#4B5563]">
            {formSubtitle}
          </p>
        </div>

        {/* Formulaire */}
        {formContent}
      </Card>
    );
  }

  // Sinon, on garde la structure complète avec section
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card padding="lg">
            {/* Icône éclair en haut à gauche */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-[#10B981]" />
              </div>
            </div>

            {/* Titre et sous-titre centrés */}
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-[#0F172A] mb-1">
                {formTitle}
              </h2>
              <p className="text-sm text-[#4B5563]">
                {formSubtitle}
              </p>
            </div>

            {/* Formulaire */}
            {formContent}
          </Card>
        </div>
      </div>
    </section>
  );
}