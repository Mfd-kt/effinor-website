import { supabase } from '@/lib/supabase/client';
import { SeoContent, SeoContentLang } from '@/lib/types/seo';

/**
 * Mapper les données de Supabase vers l'interface SeoContent
 */
function mapSeoContent(item: any): SeoContent {
  return {
    id: item.id,
    slug: item.slug,
    lang: item.lang || 'fr',
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
 * Récupérer tous les contenus SEO
 */
export async function getSeoContents(): Promise<SeoContent[]> {
  try {
    const { data, error } = await supabase
      .from('seo_content')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching seo contents:', error);
      throw error;
    }

    return data ? data.map(mapSeoContent) : [];
  } catch (error) {
    console.error('Exception in getSeoContents:', error);
    throw error;
  }
}

/**
 * Récupérer un contenu SEO par slug et langue
 */
export async function getSeoContent(slug: string, lang: SeoContentLang = 'fr'): Promise<SeoContent | null> {
  try {
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
      console.error('Error fetching seo content:', error);
      throw error;
    }

    return data ? mapSeoContent(data) : null;
  } catch (error) {
    console.error('Exception in getSeoContent:', error);
    throw error;
  }
}

/**
 * Récupérer tous les contenus SEO pour un slug donné (toutes les langues)
 */
export async function getSeoContentsBySlug(slug: string): Promise<SeoContent[]> {
  try {
    const { data, error } = await supabase
      .from('seo_content')
      .select('*')
      .eq('slug', slug)
      .order('lang', { ascending: true });

    if (error) {
      console.error('Error fetching seo contents by slug:', error);
      throw error;
    }

    return data ? data.map(mapSeoContent) : [];
  } catch (error) {
    console.error('Exception in getSeoContentsBySlug:', error);
    throw error;
  }
}

/**
 * Créer un nouveau contenu SEO
 */
export async function createSeoContent(
  content: Omit<SeoContent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SeoContent> {
  try {
    const { data, error } = await supabase
      .from('seo_content')
      .insert({
        slug: content.slug,
        lang: content.lang || 'fr',
        title: content.title,
        content: content.content,
        meta_title: content.metaTitle || null,
        meta_description: content.metaDescription || null,
        meta_keywords: content.metaKeywords || null,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating seo content:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from create operation');
    }

    return mapSeoContent(data);
  } catch (error) {
    console.error('Exception in createSeoContent:', error);
    throw error;
  }
}

/**
 * Mettre à jour un contenu SEO
 */
export async function updateSeoContent(
  slug: string,
  lang: SeoContentLang,
  content: Partial<Omit<SeoContent, 'id' | 'slug' | 'lang' | 'createdAt' | 'updatedAt'>>
): Promise<SeoContent> {
  try {
    const updateData: any = {};

    if (content.title !== undefined) updateData.title = content.title;
    if (content.content !== undefined) updateData.content = content.content;
    if (content.metaTitle !== undefined) updateData.meta_title = content.metaTitle || null;
    if (content.metaDescription !== undefined) updateData.meta_description = content.metaDescription || null;
    if (content.metaKeywords !== undefined) updateData.meta_keywords = content.metaKeywords || null;

    const { data, error } = await supabase
      .from('seo_content')
      .update(updateData)
      .eq('slug', slug)
      .eq('lang', lang)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating seo content:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from update operation');
    }

    return mapSeoContent(data);
  } catch (error) {
    console.error('Exception in updateSeoContent:', error);
    throw error;
  }
}

/**
 * Supprimer un contenu SEO
 */
export async function deleteSeoContent(slug: string, lang: SeoContentLang = 'fr'): Promise<void> {
  try {
    const { error } = await supabase
      .from('seo_content')
      .delete()
      .eq('slug', slug)
      .eq('lang', lang);

    if (error) {
      console.error('Error deleting seo content:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in deleteSeoContent:', error);
    throw error;
  }
}

/**
 * Exporter un contenu SEO en format markdown
 */
export function exportSeoContentToFile(content: SeoContent): string {
  const frontmatter = `---
title: "${content.title}"
slug: "${content.slug}"
meta_title: "${content.metaTitle || ''}"
meta_description: "${content.metaDescription || ''}"
meta_keywords: "${content.metaKeywords || ''}"
created_at: "${content.createdAt.toISOString()}"
updated_at: "${content.updatedAt.toISOString()}"
---

`;

  return frontmatter + content.content;
}

/**
 * Télécharger un contenu SEO en tant que fichier markdown
 */
export function downloadSeoContentAsFile(content: SeoContent): void {
  const markdown = exportSeoContentToFile(content);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${content.slug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

