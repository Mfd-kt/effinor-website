import { supabase } from '@/lib/supabase/client';
import { Category, CategoryTranslation, Language } from '@/lib/types/product';

function mapCategory(item: any): Category {
  // Utiliser name_fr par défaut, avec fallback sur name_en ou name_ar
  const name = item.name_fr || item.name_en || item.name_ar || item.name || '';
  const description = item.description_fr || item.description_en || item.description_ar || item.description || '';

  // Construire les traductions
  const translations: CategoryTranslation[] = [];
  if (item.name_fr || item.description_fr) {
    translations.push({
      lang: 'fr',
      name: item.name_fr || '',
      description: item.description_fr || '',
    });
  }
  if (item.name_en || item.description_en) {
    translations.push({
      lang: 'en',
      name: item.name_en || '',
      description: item.description_en || '',
    });
  }
  if (item.name_ar || item.description_ar) {
    translations.push({
      lang: 'ar',
      name: item.name_ar || '',
      description: item.description_ar || '',
    });
  }

  return {
    id: item.id,
    name,
    slug: item.slug,
    description,
    translations: translations.length > 0 ? translations : undefined,
    order: 0, // Pas de colonne order dans le schéma
    visible: true, // Par défaut visible
    productCount: item.productCount || item.product_count || 0,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  // Récupérer le nombre de produits par catégorie
  const categoriesWithCount = await Promise.all(
    (data || []).map(async (cat: any) => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id);

      return {
        ...mapCategory(cat),
        productCount: count || 0,
      };
    })
  );

  return categoriesWithCount;
}

export async function getCategory(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  if (!data) return null;

  return mapCategory(data);
}

export async function createCategory(category: Omit<Category, 'id' | 'productCount'>) {
  // Préparer les données d'insertion avec les traductions
  const insertData: any = {
    slug: category.slug,
  };

  // Si des traductions sont fournies, les utiliser
  if (category.translations && category.translations.length > 0) {
    category.translations.forEach((trans: CategoryTranslation) => {
      if (trans.lang === 'fr') {
        insertData.name_fr = trans.name;
        insertData.description_fr = trans.description;
      } else if (trans.lang === 'en') {
        insertData.name_en = trans.name;
        insertData.description_en = trans.description;
      } else if (trans.lang === 'ar') {
        insertData.name_ar = trans.name;
        insertData.description_ar = trans.description;
      }
    });
  } else {
    // Sinon, utiliser les valeurs par défaut (FR) pour toutes les langues
    insertData.name_fr = category.name;
    insertData.name_en = category.name;
    insertData.name_ar = category.name;
    insertData.description_fr = category.description;
    insertData.description_en = category.description;
    insertData.description_ar = category.description;
  }

  const { data, error } = await supabase
    .from('categories')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  return mapCategory(data);
}

export async function updateCategory(id: string, category: Partial<Category>) {
  const updateData: any = {};
  
  // Si des traductions sont fournies, les utiliser
  if (category.translations && category.translations.length > 0) {
    category.translations.forEach((trans: CategoryTranslation) => {
      if (trans.lang === 'fr') {
        updateData.name_fr = trans.name;
        updateData.description_fr = trans.description;
      } else if (trans.lang === 'en') {
        updateData.name_en = trans.name;
        updateData.description_en = trans.description;
      } else if (trans.lang === 'ar') {
        updateData.name_ar = trans.name;
        updateData.description_ar = trans.description;
      }
    });
  } else {
    // Sinon, utiliser les valeurs par défaut (pour compatibilité)
    if (category.name !== undefined) {
      updateData.name_fr = category.name;
      updateData.name_en = category.name;
      updateData.name_ar = category.name;
    }
    if (category.description !== undefined) {
      updateData.description_fr = category.description;
      updateData.description_en = category.description;
      updateData.description_ar = category.description;
    }
  }
  
  if (category.slug !== undefined) updateData.slug = category.slug;

  const { data, error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapCategory(data);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }

  return true;
}
