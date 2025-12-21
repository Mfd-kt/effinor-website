import { createSupabaseClient } from '@/lib/supabaseClient';
import { Lang } from '@/types';

export interface SeoContent {
  id: string;
  slug: string;
  lang: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mapper les données de Supabase vers l'interface SeoContent
 */
function mapSeoContent(item: any): SeoContent {
  return {
    id: item.id,
    slug: item.slug,
    lang: item.lang,
    title: item.title,
    content: item.content || '',
    metaTitle: item.meta_title || undefined,
    metaDescription: item.meta_description || undefined,
    metaKeywords: item.meta_keywords || undefined,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  };
}

/**
 * Récupérer un contenu SEO par slug et langue
 * Cette fonction est utilisée côté serveur pour les Server Components
 */
export async function getSeoContentBySlug(
  slug: string,
  lang: Lang
): Promise<SeoContent | null> {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('seo_content')
      .select('*')
      .eq('slug', slug)
      .eq('lang', lang)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun résultat trouvé
        return null;
      }
      console.error(`Error fetching seo content for slug ${slug} and lang ${lang}:`, error);
      return null;
    }

    return data ? mapSeoContent(data) : null;
  } catch (error) {
    console.error('Exception in getSeoContentBySlug:', error);
    return null;
  }
}

/**
 * Récupérer toutes les versions linguistiques d'un contenu par slug
 */
export async function getSeoContentsBySlug(slug: string): Promise<SeoContent[]> {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('seo_content')
      .select('*')
      .eq('slug', slug)
      .order('lang', { ascending: true });

    if (error) {
      console.error(`Error fetching all seo contents for slug ${slug}:`, error);
      return [];
    }

    return data ? data.map(mapSeoContent) : [];
  } catch (error) {
    console.error('Exception in getSeoContentsBySlug:', error);
    return [];
  }
}

