'use client';

import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { submitContactLead } from '@/app/actions/contact';
import { Lang, Dictionary } from '@/types';
import { Category } from '@/lib/categories';
import { Zap, User, Phone, Mail } from 'lucide-react';
import CategorySelect from './CategorySelect';
import { Card } from '@/components/ui/Card';

interface ContactFormSectionProps {
  lang: Lang;
  dict: Dictionary;
  categories: Category[];
  compact?: boolean; // Mode compact sans titre pour le hero
}

export default function ContactFormSection({ lang, dict, categories, compact = false }: ContactFormSectionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // On prépare les champs UTM/gclid/fbclid depuis l'URL
  const utm_source = searchParams.get('utm_source') ?? '';
  const utm_medium = searchParams.get('utm_medium') ?? '';
  const utm_campaign = searchParams.get('utm_campaign') ?? '';
  const utm_term = searchParams.get('utm_term') ?? '';
  const utm_content = searchParams.get('utm_content') ?? '';
  const gclid = searchParams.get('gclid') ?? '';
  const fbclid = searchParams.get('fbclid') ?? '';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    setErrorCode(null);

    // Sauvegarder la référence du formulaire avant l'opération asynchrone
    const form = e.currentTarget;

    const formData = new FormData(form);

    // On injecte ici les champs cachés
    formData.set('lang', lang);
    formData.set('page', pathname || '/');
    // Détecter l'origine automatiquement
    const origin = pathname?.includes('/contact') ? 'contact_page_form' : 'homepage_form';
    formData.set('origin', origin);

    // Rétrocompatibilité : si category_id est sélectionné, on ajoute aussi le slug dans solution
    if (selectedCategoryId) {
      const selectedCategory = categories.find(c => c.id === selectedCategoryId);
      if (selectedCategory) {
        formData.set('solution', selectedCategory.slug);
      }
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
      setStatus('success');
      // Utiliser la référence sauvegardée au lieu de e.currentTarget
      form.reset();
      setSelectedCategoryId(''); // Réinitialiser la sélection
    } else {
      setStatus('error');
      setErrorCode(result.error ?? null);
    }

    setSubmitting(false);
  }

  // Titre et sous-titre personnalisés
  const formTitle = dict.contact.form.formTitle;
  const formSubtitle = dict.contact.subtitle || 'Réponse en moins de 24h pour vos solutions LED, air, bureau d\'étude et bornes de recharge.';

  // Structure du formulaire
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nom complet */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
          {dict.contact.form.name} *
        </label>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Jean Dupont"
            className="flex-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
          />
        </div>
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
          {dict.contact.form.phone} *
        </label>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder="+33 6 XX XX XX XX"
            className="flex-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
          />
        </div>
      </div>

      {/* Type de besoin */}
      <CategorySelect
        lang={lang}
        options={categories.map(c => ({ id: c.id, name: c.name }))}
        name="category_id"
        value={selectedCategoryId}
        onChange={setSelectedCategoryId}
        label={dict.contact.form.needTypeLabel}
        placeholder={dict.contact.form.needTypePlaceholder}
        required={true}
      />

      {/* Email professionnel */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
          {dict.contact.form.email} *
        </label>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="votre.email@entreprise.fr"
            className="flex-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
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
      {status === 'success' && (
        <div className="p-4 rounded-lg bg-green-50 text-green-800 text-sm">
          {dict.contact.form.success}
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
  if (compact) {
    return (
      <Card className="max-w-md" padding="md">
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
