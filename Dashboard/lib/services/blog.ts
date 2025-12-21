import { supabase } from '@/lib/supabase/client';
import { BlogPost, BlogPostStatus } from '@/lib/types/blog';

function mapBlogPost(item: any): BlogPost {
  // Pour l'instant, on utilise l'author_id comme nom d'auteur par défaut
  // Vous pouvez améliorer cela en créant une relation avec une table utilisateurs si nécessaire
  const authorName = item.author?.name || item.author?.email || item.author?.full_name || `Auteur ${item.author_id?.substring(0, 8) || 'inconnu'}`;
  
  return {
    id: item.id,
    title: item.title || '',
    slug: item.slug || '',
    excerpt: item.excerpt || undefined,
    content: item.content || '',
    coverImageUrl: item.cover_image_url || undefined,
    status: (item.status as BlogPostStatus) || 'draft',
    authorId: item.author_id || '',
    authorName: authorName,
    seoTitle: item.seo_title || undefined,
    seoDescription: item.seo_description || undefined,
    seoOgImageUrl: item.seo_og_image_url || undefined,
    tags: item.tags && Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
    categoryId: item.category_id || undefined,
    category: item.categories ? item.categories.name : undefined,
    publishedAt: item.published_at ? new Date(item.published_at) : undefined,
    createdAt: new Date(item.created_at),
    updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(item.created_at),
  };
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    // Vérifier si Supabase est configuré
    const { isSupabaseConfigured } = await import('@/lib/supabase/client');
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase n\'est pas configuré ! Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY');
      return [];
    }

    console.log('🔍 Fetching blog posts from Supabase...');
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching blog posts:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    if (!data) {
      console.warn('⚠️ No blog posts data returned from Supabase (data is null)');
      return [];
    }

    if (data.length === 0) {
      console.warn('⚠️ No blog posts found in Supabase (empty array)');
      return [];
    }

    console.log('✅ Fetched blog posts from Supabase:', data.length, 'posts');
    console.log('Sample post data:', JSON.stringify(data[0], null, 2));
    
    const mappedPosts = data.map(mapBlogPost);
    console.log('✅ Mapped blog posts:', mappedPosts.length, 'posts');
    if (mappedPosts.length > 0) {
      console.log('Sample mapped post:', JSON.stringify(mappedPosts[0], null, 2));
    }
    
    return mappedPosts;
  } catch (error) {
    console.error('❌ Exception in getPosts:', error);
    throw error;
  }
}

export async function getPost(id: string): Promise<BlogPost | null> {
  try {
    const { isSupabaseConfigured } = await import('@/lib/supabase/client');
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase n\'est pas configuré !');
      return null;
    }

    console.log('🔍 Fetching blog post from Supabase:', id);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching blog post:', error);
      return null;
    }

    if (!data) {
      console.warn('⚠️ Blog post not found');
      return null;
    }

    console.log('✅ Fetched blog post:', data.title);
    return mapBlogPost(data);
  } catch (error) {
    console.error('❌ Exception in getPost:', error);
    return null;
  }
}

export async function createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorName'>): Promise<BlogPost> {
  try {
    const { isSupabaseConfigured } = await import('@/lib/supabase/client');
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase n\'est pas configuré');
    }

    console.log('🔍 Creating blog post:', post.title);
    
    const insertData: any = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || null,
      content: post.content,
      cover_image_url: post.coverImageUrl || null,
      status: post.status,
      author_id: post.authorId,
      seo_title: post.seoTitle || null,
      seo_description: post.seoDescription || null,
      seo_og_image_url: post.seoOgImageUrl || null,
      tags: post.tags && post.tags.length > 0 ? post.tags : null,
      category_id: post.categoryId || null,
    };

    // Si le statut est "published" et qu'il n'y a pas de published_at, définir la date actuelle
    if (post.status === 'published' && !post.publishedAt) {
      insertData.published_at = new Date().toISOString();
    } else if (post.publishedAt) {
      insertData.published_at = post.publishedAt.toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Error creating blog post:', error);
      throw error;
    }

    console.log('✅ Blog post created:', data.id);
    return mapBlogPost(data);
  } catch (error) {
    console.error('❌ Exception in createPost:', error);
    throw error;
  }
}

export async function updatePost(id: string, post: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorName'>>): Promise<BlogPost | null> {
  try {
    const { isSupabaseConfigured } = await import('@/lib/supabase/client');
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase n\'est pas configuré');
    }

    console.log('🔍 Updating blog post:', id);
    
    const updateData: any = {};

    if (post.title !== undefined) updateData.title = post.title;
    if (post.slug !== undefined) updateData.slug = post.slug;
    if (post.excerpt !== undefined) updateData.excerpt = post.excerpt || null;
    if (post.content !== undefined) updateData.content = post.content;
    if (post.coverImageUrl !== undefined) updateData.cover_image_url = post.coverImageUrl || null;
    if (post.status !== undefined) {
      updateData.status = post.status;
      // Si le statut passe à "published" et qu'il n'y a pas de published_at, définir la date actuelle
      if (post.status === 'published' && !post.publishedAt) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (post.authorId !== undefined) updateData.author_id = post.authorId;
    if (post.seoTitle !== undefined) updateData.seo_title = post.seoTitle || null;
    if (post.seoDescription !== undefined) updateData.seo_description = post.seoDescription || null;
    if (post.seoOgImageUrl !== undefined) updateData.seo_og_image_url = post.seoOgImageUrl || null;
    if (post.tags !== undefined) updateData.tags = post.tags && post.tags.length > 0 ? post.tags : null;
    if (post.categoryId !== undefined) updateData.category_id = post.categoryId || null;
    if (post.publishedAt !== undefined) updateData.published_at = post.publishedAt ? post.publishedAt.toISOString() : null;

    // Toujours mettre à jour updated_at
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Error updating blog post:', error);
      throw error;
    }

    console.log('✅ Blog post updated:', data.id);
    return mapBlogPost(data);
  } catch (error) {
    console.error('❌ Exception in updatePost:', error);
    throw error;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const { isSupabaseConfigured } = await import('@/lib/supabase/client');
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase n\'est pas configuré');
    }

    console.log('🔍 Deleting blog post:', id);
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting blog post:', error);
      throw error;
    }

    console.log('✅ Blog post deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Exception in deletePost:', error);
    throw error;
  }
}

// Storage functions for blog images
export async function uploadBlogImageToStorage(postId: string, file: File): Promise<string> {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${postId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-blog')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-blog')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteBlogImageFromStorage(imageUrl: string): Promise<void> {
  // Extract file path from URL
  // URL format: https://project.supabase.co/storage/v1/object/public/product-blog/postId/filename
  try {
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'product-blog');
    
    if (bucketIndex === -1) {
      // Try alternative: if URL contains the bucket name differently
      const match = imageUrl.match(/product-blog\/(.+)$/);
      if (match) {
        const filePath = match[1];
        const { error } = await supabase.storage
          .from('product-blog')
          .remove([filePath]);
        if (error) throw error;
        return;
      }
      throw new Error('Could not extract file path from URL');
    }
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    const { error } = await supabase.storage
      .from('product-blog')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting blog image from storage:', error);
    throw error;
  }
}
