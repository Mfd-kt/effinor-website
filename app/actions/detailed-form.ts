'use server';

import { createSupabaseClient } from '@/lib/supabaseClient';
import { DetailedFormData, Step5BuildingDetails } from '@/types/detailed-form';

export type DetailedFormResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Met à jour le lead avec les données d'une étape spécifique
 * Les étapes 1-4 sont enregistrées dans des colonnes, seule l'étape 5 va dans le JSON
 */
export async function saveFormStep(
  leadId: string,
  step: 1 | 2 | 3 | 4 | 5,
  stepData: any
): Promise<DetailedFormResult> {
  if (!leadId) {
    return {
      success: false,
      error: 'MISSING_LEAD_ID',
    };
  }

  try {
    const supabase = createSupabaseClient();
    const updateData: any = {};

    if (step === 1) {
      // Étape 1 : Informations entreprise (utilise les colonnes existantes)
      updateData.company = stepData.companyName || null;
      updateData.siret_number = stepData.siret || null;
      updateData.headquarters_address = stepData.address || null;
      updateData.headquarters_postcode = stepData.postalCode || null;
      updateData.headquarters_city = stepData.city || null;
    } else if (step === 2) {
      // Étape 2 : Contact principal (utilise les colonnes existantes)
      updateData.beneficiary_title = stepData.title || null;
      updateData.beneficiary_last_name = stepData.lastName || null;
      updateData.beneficiary_first_name = stepData.firstName || null;
      updateData.beneficiary_function = stepData.function || null;
      updateData.beneficiary_phone = stepData.phone || null;
      updateData.beneficiary_email = stepData.email || null;
      // Mettre à jour aussi phone et email (colonnes principales)
      updateData.phone = stepData.phone || null;
      updateData.email = stepData.email || null;
      // name = firstName + lastName
      const fullName = [stepData.firstName, stepData.lastName].filter(Boolean).join(' ') || null;
      updateData.name = fullName;
    } else if (step === 3) {
      // Étape 3 : Dépenses énergétiques
      updateData.annual_expense_range = stepData.annualExpenseRange || null;
    } else if (step === 4) {
      // Étape 4 : Configuration des bâtiments
      updateData.building_count = stepData.buildingCount || null;
    } else if (step === 5) {
      // Étape 5 : Détails des bâtiments (dans JSON)
      updateData.detailed_form_data = {
        buildings: stepData.buildings,
      };
    }

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
    console.error('Unexpected error updating form step:', error);
    return {
      success: false,
      error: 'UNEXPECTED_ERROR',
    };
  }
}

/**
 * Met à jour le lead avec toutes les données du formulaire détaillé
 * (Utilisé pour la soumission finale)
 */
export async function submitDetailedForm(
  leadId: string,
  formData: DetailedFormData
): Promise<DetailedFormResult> {
  // Validation de base
  if (!leadId || !formData) {
    return {
      success: false,
      error: 'MISSING_DATA',
    };
  }

  try {
    const supabase = createSupabaseClient();

    // Préparer les données pour les colonnes (étapes 1-4)
    const updateData: any = {
      // Étape 1 : Informations entreprise (utilise les colonnes existantes)
      company: formData.step1.companyName || null,
      siret_number: formData.step1.siret || null,
      headquarters_address: formData.step1.address || null,
      headquarters_postcode: formData.step1.postalCode || null,
      headquarters_city: formData.step1.city || null,
      
      // Étape 2 : Contact principal (utilise les colonnes existantes)
      beneficiary_title: formData.step2.title || null,
      beneficiary_last_name: formData.step2.lastName || null,
      beneficiary_first_name: formData.step2.firstName || null,
      beneficiary_function: formData.step2.function || null,
      beneficiary_phone: formData.step2.phone || null,
      beneficiary_email: formData.step2.email || null,
      phone: formData.step2.phone || null,
      email: formData.step2.email || null,
      name: [formData.step2.firstName, formData.step2.lastName].filter(Boolean).join(' ') || null,
      
      // Étape 3
      annual_expense_range: formData.step3.annualExpenseRange || null,
      
      // Étape 4
      building_count: formData.step4.buildingCount || null,
      
      // Étape 5 (dans JSON)
      detailed_form_data: {
        buildings: formData.step5.buildings,
      },
    };

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
    console.error('Unexpected error updating detailed form:', error);
    return {
      success: false,
      error: 'UNEXPECTED_ERROR',
    };
  }
}
