import { createSupabaseClient } from './supabaseClient';
import { Lead } from '@/types';

/**
 * Crée un nouveau lead dans la table leads de Supabase
 * 
 * @param lead - Les données du lead à insérer
 * @returns Un objet avec success (boolean) et message (string)
 */
export async function createLead(lead: Lead) {
  try {
    const supabase = createSupabaseClient();

    const { error } = await supabase.from('leads').insert({
      lang: lead.lang,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      page: lead.page,
      origin: lead.origin,
    });

    if (error) {
      console.error('Error creating lead:', error);
      return {
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du formulaire.',
      };
    }

    return {
      success: true,
      message: 'Votre demande a été envoyée avec succès.',
    };
  } catch (error) {
    console.error('Unexpected error creating lead:', error);
    return {
      success: false,
      message: 'Une erreur inattendue est survenue.',
    };
  }
}
