'use server';

import { createSupabaseClient } from '@/lib/supabaseClient';
import { Lang } from '@/types';

type ContactFormInput = {
  lang: 'fr' | 'en' | 'ar';
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  solution?: string; // Conservé pour rétrocompatibilité
  category_id?: string;
  page?: string;
  origin?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
};

export async function submitContactLead(formData: FormData) {
  // 1. Récupération des champs du formulaire
  const payload: ContactFormInput = {
    lang: (formData.get('lang') as 'fr' | 'en' | 'ar') ?? 'fr',
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    company: String(formData.get('company') || '').trim() || undefined,
    message: String(formData.get('message') || '').trim() || undefined,
    solution: String(formData.get('solution') || '').trim() || undefined,
    category_id: String(formData.get('category_id') || '').trim() || undefined,
    page: String(formData.get('page') || '').trim() || undefined,
    origin: String(formData.get('origin') || '').trim() || 'homepage_form',
    utm_source: String(formData.get('utm_source') || '').trim() || undefined,
    utm_medium: String(formData.get('utm_medium') || '').trim() || undefined,
    utm_campaign: String(formData.get('utm_campaign') || '').trim() || undefined,
    utm_term: String(formData.get('utm_term') || '').trim() || undefined,
    utm_content: String(formData.get('utm_content') || '').trim() || undefined,
    gclid: String(formData.get('gclid') || '').trim() || undefined,
    fbclid: String(formData.get('fbclid') || '').trim() || undefined,
  };

  // 2. Validation simple
  if (!payload.name || !payload.email || !payload.phone) {
    return {
      success: false,
      error: 'MISSING_FIELDS',
    };
  }

  // Validation email très basique
  if (!payload.email.includes('@')) {
    return {
      success: false,
      error: 'INVALID_EMAIL',
    };
  }

  // 3. Insertion dans Supabase
  try {
    const supabase = createSupabaseClient();

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lang: payload.lang,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        company: payload.company,
        message: payload.message,
        solution: payload.solution,
        category_id: payload.category_id,
        page: payload.page,
        origin: payload.origin,
        utm_source: payload.utm_source,
        utm_medium: payload.utm_medium,
        utm_campaign: payload.utm_campaign,
        utm_term: payload.utm_term,
        utm_content: payload.utm_content,
        gclid: payload.gclid,
        fbclid: payload.fbclid,
        // status = 'new' par défaut côté SQL, pas besoin de le passer
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('Supabase insert lead error:', error);
      return {
        success: false,
        error: 'SUPABASE_ERROR',
      };
    }

    // Envoyer la notification webhook (ne bloque pas si échec)
    if (insertedData) {
      try {
        const { notifyNewLead } = await import('@/Dashboard/lib/services/webhook');
        
        // Récupérer le nom de la catégorie si category_id existe
        let categoryName: string | undefined;
        if (payload.category_id) {
          const { data: category } = await supabase
            .from('categories')
            .select('name_fr, name_en, name_ar')
            .eq('id', payload.category_id)
            .single();
          
          if (category) {
            categoryName = category.name_fr || category.name_en || category.name_ar;
          }
        }

        // Extraire prénom et nom
        const nameParts = payload.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        await notifyNewLead({
          leadId: insertedData.id,
          fullName: payload.name,
          firstName: firstName,
          lastName: lastName,
          email: payload.email,
          phone: payload.phone,
          company: payload.company,
          source: payload.origin || 'website',
          status: 'new',
          message: payload.message,
          solution: payload.solution,
          categoryId: payload.category_id,
          categoryName: categoryName,
          page: payload.page,
          origin: payload.origin,
          utmSource: payload.utm_source,
          utmMedium: payload.utm_medium,
          utmCampaign: payload.utm_campaign,
          utmTerm: payload.utm_term,
          utmContent: payload.utm_content,
          gclid: payload.gclid,
          fbclid: payload.fbclid,
          lang: payload.lang,
          createdAt: new Date(insertedData.created_at).toISOString(),
          dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/admin/leads/${insertedData.id}`,
        });
      } catch (webhookError) {
        // Erreur déjà loggée dans sendWebhookNotification, on continue
        console.warn('Webhook notification failed, but lead was created successfully');
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Unexpected error creating lead:', error);
    return {
      success: false,
      error: 'UNEXPECTED_ERROR',
    };
  }
}

// Alias pour rétrocompatibilité (si d'autres parties du code utilisent encore l'ancien nom)
export const submitContactForm = submitContactLead;
