import { supabase } from '@/lib/supabase/client';
import { SeoScript } from '@/lib/types/seo';

/**
 * Mapper les données de Supabase vers l'interface SeoScript
 */
function mapSeoScript(item: any): SeoScript {
  return {
    id: item.id,
    name: item.name,
    label: item.label,
    description: item.description || undefined,
    scriptCode: item.script_code || '',
    scriptPosition: item.script_position || 'head',
    active: item.active || false,
    priority: item.priority || 0,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  };
}

/**
 * Récupérer tous les scripts SEO
 */
export async function getSeoScripts(): Promise<SeoScript[]> {
  try {
    const { data, error } = await supabase
      .from('seo_scripts')
      .select('*')
      .order('priority', { ascending: true })
      .order('label', { ascending: true });

    if (error) {
      console.error('Error fetching seo scripts:', error);
      throw error;
    }

    return data ? data.map(mapSeoScript) : [];
  } catch (error) {
    console.error('Exception in getSeoScripts:', error);
    throw error;
  }
}

/**
 * Récupérer un script SEO par nom
 */
export async function getSeoScript(name: string): Promise<SeoScript | null> {
  try {
    const { data, error } = await supabase
      .from('seo_scripts')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun résultat trouvé
        return null;
      }
      console.error('Error fetching seo script:', error);
      throw error;
    }

    return data ? mapSeoScript(data) : null;
  } catch (error) {
    console.error('Exception in getSeoScript:', error);
    throw error;
  }
}

/**
 * Créer un nouveau script SEO
 */
export async function createSeoScript(
  script: Omit<SeoScript, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SeoScript> {
  try {
    const { data, error } = await supabase
      .from('seo_scripts')
      .insert({
        name: script.name,
        label: script.label,
        description: script.description || null,
        script_code: script.scriptCode,
        script_position: script.scriptPosition,
        active: script.active,
        priority: script.priority,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating seo script:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from create operation');
    }

    return mapSeoScript(data);
  } catch (error) {
    console.error('Exception in createSeoScript:', error);
    throw error;
  }
}

/**
 * Mettre à jour un script SEO
 */
export async function updateSeoScript(
  name: string,
  script: Partial<Omit<SeoScript, 'id' | 'name' | 'createdAt' | 'updatedAt'>>
): Promise<SeoScript> {
  try {
    const updateData: any = {};

    if (script.label !== undefined) updateData.label = script.label;
    if (script.description !== undefined) updateData.description = script.description || null;
    if (script.scriptCode !== undefined) updateData.script_code = script.scriptCode;
    if (script.scriptPosition !== undefined) updateData.script_position = script.scriptPosition;
    if (script.active !== undefined) updateData.active = script.active;
    if (script.priority !== undefined) updateData.priority = script.priority;

    const { data, error } = await supabase
      .from('seo_scripts')
      .update(updateData)
      .eq('name', name)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating seo script:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from update operation');
    }

    return mapSeoScript(data);
  } catch (error) {
    console.error('Exception in updateSeoScript:', error);
    throw error;
  }
}

/**
 * Activer/désactiver un script SEO
 */
export async function toggleSeoScript(name: string, active: boolean): Promise<SeoScript> {
  try {
    const { data, error } = await supabase
      .from('seo_scripts')
      .update({ active })
      .eq('name', name)
      .select('*')
      .single();

    if (error) {
      console.error('Error toggling seo script:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from toggle operation');
    }

    return mapSeoScript(data);
  } catch (error) {
    console.error('Exception in toggleSeoScript:', error);
    throw error;
  }
}

/**
 * Supprimer un script SEO
 */
export async function deleteSeoScript(name: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('seo_scripts')
      .delete()
      .eq('name', name);

    if (error) {
      console.error('Error deleting seo script:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in deleteSeoScript:', error);
    throw error;
  }
}

