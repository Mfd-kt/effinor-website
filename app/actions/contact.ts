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
  category_id?: string; // Conservé pour rétrocompatibilité
  building_type?: string; // Type de bâtiment (entrepot-logistique, bureau, usine-production, commerce-retail, autre-batiment)
  surface_m2?: number;
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
  const surfaceM2Value = formData.get('surface_m2');
  const surfaceM2 = surfaceM2Value ? Number(surfaceM2Value) : undefined;
  
  const payload: ContactFormInput = {
    lang: (formData.get('lang') as 'fr' | 'en' | 'ar') ?? 'fr',
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    company: String(formData.get('company') || '').trim() || undefined,
    message: String(formData.get('message') || '').trim() || undefined,
    solution: String(formData.get('solution') || '').trim() || undefined,
    category_id: String(formData.get('category_id') || '').trim() || undefined,
    building_type: String(formData.get('building_type') || '').trim() || undefined,
    surface_m2: surfaceM2 && !isNaN(surfaceM2) && surfaceM2 > 0 ? surfaceM2 : undefined,
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
  if (!payload.name || !payload.email || !payload.phone || !payload.building_type) {
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

  // 3. Vérifier les doublons AVANT l'insertion
  try {
    const supabase = createSupabaseClient();

    // Normaliser l'email (minuscules, trim)
    const normalizedEmail = payload.email.toLowerCase().trim();

    // Chercher les leads existants avec le même email
    const { data: existingLeads, error: searchError } = await supabase
      .from('leads')
      .select('id, name, email, phone, created_at, status')
      .ilike('email', normalizedEmail) // Recherche insensible à la casse
      .order('created_at', { ascending: false })
      .limit(5);

    if (searchError) {
      console.error('Error searching for duplicates:', searchError);
      // Continuer quand même l'insertion si la recherche échoue
    }

    // 4. Insertion dans Supabase
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
        category_id: payload.category_id || null,
        building_type: payload.building_type || null,
        surface_m2: payload.surface_m2 || null,
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

    // Retourner le résultat avec information sur les doublons
    return {
      success: true,
      leadId: insertedData.id,
      duplicateWarning: existingLeads && existingLeads.length > 0,
      existingLeads: existingLeads || [],
    };
  } catch (error) {
    console.error('Unexpected error creating lead:', error);
    return {
      success: false,
      error: 'UNEXPECTED_ERROR',
    };
  }
}

/**
 * Met à jour un lead existant avec les champs fournis
 * Utilisé pour l'auto-save du formulaire initial
 */
export async function updateContactLead(
  leadId: string,
  fields: Partial<ContactFormInput>
): Promise<{ success: true } | { success: false; error: string }> {
  if (!leadId) {
    return {
      success: false,
      error: 'MISSING_LEAD_ID',
    };
  }

  try {
    const supabase = createSupabaseClient();

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (fields.name !== undefined) {
      updateData.name = fields.name.trim() || null;
    }
    if (fields.email !== undefined) {
      updateData.email = fields.email.trim() || null;
    }
    if (fields.phone !== undefined) {
      updateData.phone = fields.phone.trim() || null;
    }
    if (fields.company !== undefined) {
      updateData.company = fields.company.trim() || null;
    }
    if (fields.building_type !== undefined) {
      updateData.building_type = fields.building_type.trim() || null;
    }
    if (fields.surface_m2 !== undefined) {
      updateData.surface_m2 = fields.surface_m2 && fields.surface_m2 > 0 ? fields.surface_m2 : null;
    }
    // Note: message n'est pas auto-sauvegardé, seulement à la soumission

    const { error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', leadId);

    if (error) {
      console.error('Supabase update lead error:', error);
      return {
        success: false,
        error: 'SUPABASE_ERROR',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Unexpected error updating lead:', error);
    return {
      success: false,
      error: 'UNEXPECTED_ERROR',
    };
  }
}

// Alias pour rétrocompatibilité (si d'autres parties du code utilisent encore l'ancien nom)
export const submitContactForm = submitContactLead;
