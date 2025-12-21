import { createSupabaseClient } from '@/lib/supabaseClient';

export interface SeoScript {
  id: string;
  name: string;
  label: string;
  description?: string;
  scriptCode: string;
  scriptPosition: 'head' | 'body';
  active: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

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
 * Récupérer tous les scripts SEO actifs (pour le site public)
 * Cette fonction est utilisée côté serveur pour injecter les scripts dans le layout
 */
export async function getActiveSeoScripts(): Promise<SeoScript[]> {
  try {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
      .from('seo_scripts')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching active seo scripts:', error);
      // Ne pas throw l'erreur pour ne pas bloquer le rendu du site
      return [];
    }

    return data ? data.map(mapSeoScript) : [];
  } catch (error) {
    console.error('Exception in getActiveSeoScripts:', error);
    // Ne pas throw l'erreur pour ne pas bloquer le rendu du site
    return [];
  }
}

