import { createSupabaseClient } from '@/lib/supabaseClient';
import type { BlogPost } from '@/types/blog';

function mapBlogPost(item: any): BlogPost {
  // Gérer les catégories qui peuvent être un objet ou un tableau
  let categoryName: string | undefined;
  if (item.categories) {
    if (Array.isArray(item.categories) && item.categories.length > 0) {
      categoryName = item.categories[0].name;
    } else if (typeof item.categories === 'object' && item.categories.name) {
      categoryName = item.categories.name;
    }
  }

  return {
    id: item.id,
    title: item.title || '',
    slug: item.slug || '',
    excerpt: item.excerpt || undefined,
    content: item.content || '',
    coverImageUrl: item.cover_image_url || undefined,
    status: item.status || 'draft',
    lang: item.lang || 'fr',
    authorId: item.author_id || '',
    authorName: item.author?.name || item.author?.email || `Auteur ${item.author_id?.substring(0, 8) || 'inconnu'}`,
    seoTitle: item.seo_title || undefined,
    seoDescription: item.seo_description || undefined,
    seoOgImageUrl: item.seo_og_image_url || undefined,
    tags: item.tags && Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
    categoryId: item.category_id || undefined,
    category: categoryName,
    publishedAt: item.published_at ? new Date(item.published_at) : undefined,
    createdAt: new Date(item.created_at),
    updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(item.created_at),
  };
}

/**
 * Récupère tous les articles de blog publiés
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createSupabaseClient();
    
    // D'abord, récupérer les articles sans la jointure pour éviter les erreurs RLS
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return [];
    }

    if (!data) {
      console.warn('No data returned from Supabase');
      return [];
    }

    console.log('Fetched blog posts:', data.length);

    // Si des articles ont une category_id, récupérer les catégories séparément
    const categoryIds = data
      .map(post => post.category_id)
      .filter((id): id is string => id !== null && id !== undefined);
    
    let categoriesMap: Record<string, string> = {};
    if (categoryIds.length > 0) {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      
      if (categoriesData) {
        categoriesMap = categoriesData.reduce((acc, cat) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    // Mapper les articles avec les catégories
    return data.map(item => {
      const mapped = mapBlogPost(item);
      if (item.category_id && categoriesMap[item.category_id]) {
        mapped.category = categoriesMap[item.category_id];
      }
      return mapped;
    });
  } catch (error) {
    console.error('Exception in getPublishedPosts:', error);
    return [];
  }
}

/**
 * Récupère un article de blog par son slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }

    if (!data) {
      return null;
    }

    // Récupérer la catégorie si elle existe
    let categoryName: string | undefined;
    if (data.category_id) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('name')
        .eq('id', data.category_id)
        .single();
      
      if (categoryData) {
        categoryName = categoryData.name;
      }
    }

    const mapped = mapBlogPost(data);
    if (categoryName) {
      mapped.category = categoryName;
    }

    return mapped;
  } catch (error) {
    console.error('Exception in getPostBySlug:', error);
    return null;
  }
}

/**
 * Récupère un article de blog par son ID
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapBlogPost(data);
  } catch (error) {
    console.error('Exception in getPostById:', error);
    return null;
  }
}

