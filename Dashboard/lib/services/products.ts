import { supabase } from '@/lib/supabase/client';
import { Product, Category, ProductTranslation, Language } from '@/lib/types/product';

function mapProduct(item: any, translation?: any): Product {
  // Les traductions sont dans product_translations, utiliser la traduction FR par défaut
  const name = translation?.name || item.name || '';
  const slug = translation?.slug || item.slug || '';
  const description = translation?.short_description || translation?.long_description || item.description || '';

  return {
    id: item.id,
    name,
    slug,
    description,
    categoryId: item.category_id,
    category: item.categories ? {
      id: item.categories.id,
      name: item.categories.name_fr || item.categories.name_en || item.categories.name_ar || '',
      slug: item.categories.slug,
      description: item.categories.description_fr || item.categories.description_en || item.categories.description_ar || '',
      order: 0,
      visible: true,
    } : undefined,
    price: item.price_ht ? Number(item.price_ht) : undefined,
    priceOnQuote: item.is_quote_only || false,
    promoActive: false, // Pas de promo dans le schéma
    promoPrice: undefined,
    stock: 0, // Pas de stock dans le schéma
    status: item.is_active === false ? 'inactive' : 'active',
    images: item.product_images ? (Array.isArray(item.product_images) ? item.product_images.map((img: any) => img.image_url) : [item.product_images.image_url]) : (item.main_image_url ? [item.main_image_url] : []),
    technicalSheetUrl: item.technical_sheet_url || undefined,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.created_at), // Pas de updated_at dans le schéma
  };
}

export async function getProducts(): Promise<Product[]> {
  // Récupérer les produits avec leurs traductions FR et catégories
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:categories (*),
      product_translations (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return (data || []).map((item: any) => {
    // Trouver la traduction FR, sinon prendre la première disponible
    let translation;
    if (Array.isArray(item.product_translations)) {
      translation = item.product_translations.find((t: any) => t.lang === 'fr') || item.product_translations[0];
    } else if (item.product_translations) {
      translation = item.product_translations;
    }
    return mapProduct(item, translation);
  });
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:categories (*),
      product_translations (*),
      product_images (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  if (!data) return null;

  // Récupérer toutes les traductions
  const translations: ProductTranslation[] = [];
  if (Array.isArray(data.product_translations)) {
    data.product_translations.forEach((t: any) => {
      translations.push({
        lang: t.lang as Language,
        name: t.name || '',
        slug: t.slug || '',
        description: t.short_description || t.long_description || '',
        short_description: t.short_description,
        long_description: t.long_description,
        application: t.application,
      });
    });
  } else if (data.product_translations) {
    const t = data.product_translations;
    translations.push({
      lang: t.lang as Language,
      name: t.name || '',
      slug: t.slug || '',
      description: t.short_description || t.long_description || '',
      short_description: t.short_description,
      long_description: t.long_description,
      application: t.application,
    });
  }

  // Trouver la traduction FR pour la compatibilité
  const frTranslation = translations.find(t => t.lang === 'fr') || translations[0];
  
  const product = mapProduct(data, frTranslation);
  product.translations = translations;
  
  return product;
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  // Créer le produit
  const { data: productData, error: productError } = await supabase
    .from('products')
    .insert({
      category_id: product.categoryId,
      price_ht: product.priceOnQuote ? null : (product.price || null),
      is_quote_only: product.priceOnQuote,
      is_active: product.status === 'active',
      main_image_url: product.images?.[0] || null,
    })
    .select()
    .single();

  if (productError) throw productError;

  // Créer la traduction FR
  if (productData) {
    const { error: translationError } = await supabase
      .from('product_translations')
      .insert({
        product_id: productData.id,
        lang: 'fr',
        name: product.name,
        slug: product.slug,
        short_description: product.description,
      });

    if (translationError) throw translationError;
  }

  return getProduct(productData.id);
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const updateData: any = {};
  
  if (product.categoryId !== undefined) updateData.category_id = product.categoryId;
  if (product.price !== undefined) updateData.price_ht = product.price;
  if (product.priceOnQuote !== undefined) updateData.is_quote_only = product.priceOnQuote;
  if (product.status !== undefined) updateData.is_active = product.status === 'active';
  if (product.images !== undefined && product.images.length > 0) {
    updateData.main_image_url = product.images[0];
  }
  
  // Essayer d'inclure technical_sheet_url, mais gérer l'erreur si la colonne n'existe pas
  if (product.technicalSheetUrl !== undefined) {
    updateData.technical_sheet_url = product.technicalSheetUrl;
  }

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id);

  if (error) {
    // Si l'erreur est due à technical_sheet_url manquante, réessayer sans cette colonne
    if (error.message?.includes('technical_sheet_url')) {
      delete updateData.technical_sheet_url;
      const { error: retryError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);
      if (retryError) throw retryError;
      // Avertir que technical_sheet_url n'a pas été sauvegardé
      console.warn('La colonne technical_sheet_url n\'existe pas dans la table products. Le PDF n\'a pas été sauvegardé dans la base de données.');
    } else {
      throw error;
    }
  }

  // Mettre à jour les traductions si nécessaire
  if (product.translations && product.translations.length > 0) {
    // Mettre à jour ou créer chaque traduction
    for (const translation of product.translations) {
      const translationData: any = {
        name: translation.name,
        slug: translation.slug,
      };
      
      if (translation.short_description !== undefined) {
        translationData.short_description = translation.short_description;
      }
      if (translation.long_description !== undefined) {
        translationData.long_description = translation.long_description;
      }
      if (translation.application !== undefined) {
        translationData.application = translation.application;
      }

      // Vérifier si la traduction existe déjà
      const { data: existing } = await supabase
        .from('product_translations')
        .select('id')
        .eq('product_id', id)
        .eq('lang', translation.lang)
        .single();

      if (existing) {
        // Mettre à jour la traduction existante
        const { error: translationError } = await supabase
          .from('product_translations')
          .update(translationData)
          .eq('product_id', id)
          .eq('lang', translation.lang);

        if (translationError) throw translationError;
      } else {
        // Créer une nouvelle traduction
        const { error: translationError } = await supabase
          .from('product_translations')
          .insert({
            product_id: id,
            lang: translation.lang,
            ...translationData,
          });

        if (translationError) throw translationError;
      }
    }
  } else if (product.name || product.slug || product.description) {
    // Compatibilité : mettre à jour la traduction FR si les anciens champs sont utilisés
    const translationUpdate: any = {};
    if (product.name !== undefined) translationUpdate.name = product.name;
    if (product.slug !== undefined) translationUpdate.slug = product.slug;
    if (product.description !== undefined) translationUpdate.short_description = product.description;

    const { error: translationError } = await supabase
      .from('product_translations')
      .update(translationUpdate)
      .eq('product_id', id)
      .eq('lang', 'fr');

    if (translationError) throw translationError;
  }

  return getProduct(id);
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Storage functions for images
export async function uploadImageToStorage(productId: string, file: File): Promise<string> {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${productId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteImageFromStorage(imageUrl: string): Promise<void> {
  // Extract file path from URL
  // URL format: https://project.supabase.co/storage/v1/object/public/product-images/productId/filename
  try {
    const urlParts = imageUrl.split('/');
    const productImagesIndex = urlParts.findIndex(part => part === 'product-images');
    
    if (productImagesIndex === -1) {
      // Try alternative: if URL contains the bucket name differently
      const match = imageUrl.match(/product-images\/(.+)$/);
      if (match) {
        const filePath = match[1];
        const { error } = await supabase.storage
          .from('product-images')
          .remove([filePath]);
        if (error) throw error;
        return;
      }
      throw new Error('Could not extract file path from URL');
    }
    
    const filePath = urlParts.slice(productImagesIndex + 1).join('/');
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    throw error;
  }
}

// Storage functions for PDF
export async function uploadPdfToStorage(productId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `technical-sheet.${fileExt}`;
  const filePath = `${productId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Replace if exists
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-documents')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deletePdfFromStorage(pdfUrl: string): Promise<void> {
  // Extract file path from URL
  // URL format: https://project.supabase.co/storage/v1/object/public/product-documents/productId/filename
  try {
    const urlParts = pdfUrl.split('/');
    const productDocumentsIndex = urlParts.findIndex(part => part === 'product-documents');
    
    if (productDocumentsIndex === -1) {
      // Try alternative: if URL contains the bucket name differently
      const match = pdfUrl.match(/product-documents\/(.+)$/);
      if (match) {
        const filePath = match[1];
        const { error } = await supabase.storage
          .from('product-documents')
          .remove([filePath]);
        if (error) throw error;
        return;
      }
      throw new Error('Could not extract file path from URL');
    }
    
    const filePath = urlParts.slice(productDocumentsIndex + 1).join('/');
    const { error } = await supabase.storage
      .from('product-documents')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting PDF from storage:', error);
    throw error;
  }
}

// Product image management
export async function addProductImage(productId: string, imageUrl: string, order?: number): Promise<void> {
  // La colonne 'order' peut ne pas exister dans le schéma product_images
  // On insère seulement les colonnes qui existent
  const { error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: imageUrl,
      // Ne pas inclure 'order' car la colonne n'existe peut-être pas dans le schéma
    });

  if (error) throw error;
}

export async function removeProductImage(imageId: string): Promise<void> {
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);

  if (error) throw error;
}

export async function getProductImageId(imageUrl: string, productId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('product_images')
    .select('id')
    .eq('product_id', productId)
    .eq('image_url', imageUrl)
    .single();

  if (error || !data) return null;
  return data.id;
}
