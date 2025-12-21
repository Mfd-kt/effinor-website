import { createSupabaseClient } from './supabaseClient';
import { Lang } from '@/types';

export type Category = {
  id: string;
  slug: string;
  name: string; // nom déjà adapté à la langue
};

/**
 * Récupère toutes les catégories depuis Supabase avec le nom adapté à la langue
 * @param lang - La langue souhaitée ('fr', 'en', 'ar')
 * @returns Un tableau de catégories avec le nom traduit
 */
export async function getCategories(lang: Lang): Promise<Category[]> {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('categories')
      .select('id, slug, name_fr, name_en, name_ar')
      .order('slug', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Mapper les données pour adapter le nom à la langue
    return data.map((category) => {
      let name = '';
      
      switch (lang) {
        case 'fr':
          name = category.name_fr;
          break;
        case 'en':
          name = category.name_en;
          break;
        case 'ar':
          name = category.name_ar;
          break;
        default:
          name = category.name_fr;
      }

      return {
        id: category.id,
        slug: category.slug,
        name: name,
      };
    });
  } catch (error) {
    console.error('Unexpected error fetching categories:', error);
    return [];
  }
}






