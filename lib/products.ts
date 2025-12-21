import { createSupabaseClient } from './supabaseClient';

export type Lang = 'fr' | 'en' | 'ar';

export type Product = {
  id: string;
  categoryId: string;
  sku: string | null;
  type: string | null;
  powerW: number | null;
  luminousFluxLm: number | null;
  efficiencyLmPerW: number | null;
  cctMin: number | null;
  cctMax: number | null;
  cri: number | null;
  ipRating: string | null;
  ikRating: string | null;
  isDimmable: boolean;
  isActive: boolean;
  mainImageUrl: string | null;
  priceHt: number | null;
  priceCurrency: 'EUR' | 'USD';
  isQuoteOnly: boolean;
  createdAt: string;
  // traductions
  name: string;
  slug: string;
  shortDescription: string | null;
  longDescription: string | null;
  application: string | null;
  // Nouveaux champs enrichis (optionnels pour compatibilité)
  datasheetUrl?: string | null;
  warrantyYears?: number | null;
  brand?: string | null;
  model?: string | null;
  voltage?: string | null;
  lifetimeHours?: number | null;
  beamAngleDeg?: number | null;
  operatingTemp?: string | null;
  dimensionsMm?: string | null;
  weightKg?: number | null;
  certifications?: string[];
  features?: string[];
  specs?: Record<string, string>;
};

export type ProductImage = {
  id: string;
  imageUrl: string;
  alt: string | null; // alt selon la langue
  position: number;
  isMain: boolean;
};

export type ProductDetail = Product & {
  images: ProductImage[];
  categorySlug: string;
  categoryName: string;
  // Nouveaux champs enrichis (obligatoires dans ProductDetail)
  datasheetUrl: string | null;
  warrantyYears: number | null;
  brand: string | null;
  model: string | null;
  voltage: string | null;
  lifetimeHours: number | null;
  beamAngleDeg: number | null;
  operatingTemp: string | null;
  dimensionsMm: string | null;
  weightKg: number | null;
  certifications: string[]; // depuis JSONB
  features: string[]; // depuis JSONB
  specs: Record<string, string>; // depuis JSONB
};

/**
 * Récupère une catégorie par son slug
 * @param slug - Le slug de la catégorie
 * @returns L'ID et le slug de la catégorie, ou null si non trouvée
 */
export async function getCategoryBySlug(slug: string): Promise<{ id: string; slug: string } | null> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Error fetching category by slug:', error);
      return null;
    }

    return { id: data.id, slug: data.slug };
  } catch (error) {
    console.error('Unexpected error fetching category:', error);
    return null;
  }
}

/**
 * Récupère tous les produits actifs d'une catégorie avec leurs traductions
 * @param lang - La langue souhaitée ('fr', 'en', 'ar')
 * @param categorySlug - Le slug de la catégorie (ex: 'luminaire', 'ventilation', 'irve', 'etude')
 * @returns Un tableau de produits avec les traductions
 */
export async function getProductsByCategorySlug(lang: Lang, categorySlug: string): Promise<Product[]> {
  try {
    const supabase = createSupabaseClient();

    // 1. Récupérer l'ID de la catégorie
    const category = await getCategoryBySlug(categorySlug);
    if (!category) {
      console.error(`Category with slug '${categorySlug}' not found`);
      return [];
    }

    // 2. Récupérer les produits actifs de la catégorie luminaire
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category.id)
      .eq('is_active', true);

    if (productsError || !productsData || productsData.length === 0) {
      console.error('Error fetching products:', productsError);
      return [];
    }

    // 3. Récupérer les traductions pour chaque produit
    const productIds = productsData.map((p) => p.id);
    const { data: translationsData, error: translationsError } = await supabase
      .from('product_translations')
      .select('*')
      .in('product_id', productIds)
      .eq('lang', lang);

    if (translationsError) {
      console.error('Error fetching translations:', translationsError);
      return [];
    }

    // 4. Créer un map des traductions par product_id
    const translationsMap = new Map(
      (translationsData || []).map((t) => [t.product_id, t])
    );

    if (productsError) {
      console.error('Error fetching lighting products:', productsError);
      return [];
    }

    // 5. Mapper les données pour créer des objets Product
    const mappedProducts = productsData
      .map((p) => {
        const translation = translationsMap.get(p.id);
        if (!translation) {
          // Si pas de traduction, on skip ce produit
          return null;
        }

        // Parser les JSONB
        const certifications = p.certifications
          ? (Array.isArray(p.certifications) ? p.certifications : JSON.parse(JSON.stringify(p.certifications)))
          : undefined;

        const features = p.features
          ? (Array.isArray(p.features) ? p.features : JSON.parse(JSON.stringify(p.features)))
          : undefined;

        const specs = p.specs
          ? (typeof p.specs === 'object' ? p.specs : JSON.parse(JSON.stringify(p.specs)))
          : undefined;

        return {
          id: p.id,
          categoryId: p.category_id,
          sku: p.sku,
          type: p.type,
          powerW: p.power_w,
          luminousFluxLm: p.luminous_flux_lm,
          efficiencyLmPerW: p.efficiency_lm_per_w ? Number(p.efficiency_lm_per_w) : null,
          cctMin: p.cct_min,
          cctMax: p.cct_max,
          cri: p.cri,
          ipRating: p.ip_rating,
          ikRating: p.ik_rating,
          isDimmable: p.is_dimmable || false,
          isActive: p.is_active || false,
          mainImageUrl: p.main_image_url,
          priceHt: p.price_ht ? Number(p.price_ht) : null,
          priceCurrency: (p.price_currency || 'EUR') as 'EUR' | 'USD',
          isQuoteOnly: p.is_quote_only || false,
          createdAt: p.created_at || new Date().toISOString(),
          name: translation.name,
          slug: translation.slug,
          shortDescription: translation.short_description || null,
          longDescription: translation.long_description || null,
          application: translation.application || null,
          // Nouveaux champs enrichis (optionnels)
          datasheetUrl: p.datasheet_url || undefined,
          warrantyYears: p.warranty_years || undefined,
          brand: p.brand || undefined,
          model: p.model || undefined,
          voltage: p.voltage || undefined,
          lifetimeHours: p.lifetime_hours || undefined,
          beamAngleDeg: p.beam_angle_deg || undefined,
          operatingTemp: p.operating_temp || undefined,
          dimensionsMm: p.dimensions_mm || undefined,
          weightKg: p.weight_kg ? Number(p.weight_kg) : undefined,
          certifications: certifications as string[] | undefined,
          features: features as string[] | undefined,
          specs: specs as Record<string, string> | undefined,
        };
      })
      .filter((p) => p !== null) as Product[];
    
    return mappedProducts;
  } catch (error) {
    console.error('Unexpected error fetching products by category:', error);
    return [];
  }
}

/**
 * Récupère un produit par son slug (dans la langue spécifiée)
 * @param lang - La langue souhaitée ('fr', 'en', 'ar')
 * @param slug - Le slug du produit dans la langue spécifiée
 * @returns Le produit ou null si non trouvé
 */
export async function getProductBySlug(lang: Lang, slug: string): Promise<Product | null> {
  try {
    const supabase = createSupabaseClient();

    // 1. Récupérer la traduction avec le slug
    const { data: translation, error: translationError } = await supabase
      .from('product_translations')
      .select('product_id, name, slug, short_description, long_description, application')
      .eq('slug', slug)
      .eq('lang', lang)
      .single();

    if (translationError || !translation) {
      console.error('Error fetching product translation by slug:', translationError);
      return null;
    }

    // 2. Récupérer le produit
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', translation.product_id)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      console.error('Error fetching product:', productError);
      return null;
    }

    // 3. Parser les JSONB
    const certifications = product.certifications
      ? (Array.isArray(product.certifications) ? product.certifications : JSON.parse(JSON.stringify(product.certifications)))
      : undefined;

    const features = product.features
      ? (Array.isArray(product.features) ? product.features : JSON.parse(JSON.stringify(product.features)))
      : undefined;

    const specs = product.specs
      ? (typeof product.specs === 'object' ? product.specs : JSON.parse(JSON.stringify(product.specs)))
      : undefined;

    // 4. Mapper les données
    return {
      id: product.id,
      categoryId: product.category_id,
      sku: product.sku,
      type: product.type,
      powerW: product.power_w,
      luminousFluxLm: product.luminous_flux_lm,
      efficiencyLmPerW: product.efficiency_lm_per_w ? Number(product.efficiency_lm_per_w) : null,
      cctMin: product.cct_min,
      cctMax: product.cct_max,
      cri: product.cri,
      ipRating: product.ip_rating,
      ikRating: product.ik_rating,
      isDimmable: product.is_dimmable || false,
      isActive: product.is_active || false,
      mainImageUrl: product.main_image_url,
      priceHt: product.price_ht ? Number(product.price_ht) : null,
      priceCurrency: (product.price_currency || 'EUR') as 'EUR' | 'USD',
      isQuoteOnly: product.is_quote_only || false,
      createdAt: product.created_at || new Date().toISOString(),
      name: translation.name,
      slug: translation.slug,
      shortDescription: translation.short_description || null,
      longDescription: translation.long_description || null,
      application: translation.application || null,
      // Nouveaux champs enrichis (optionnels)
      datasheetUrl: product.datasheet_url || undefined,
      warrantyYears: product.warranty_years || undefined,
      brand: product.brand || undefined,
      model: product.model || undefined,
      voltage: product.voltage || undefined,
      lifetimeHours: product.lifetime_hours || undefined,
      beamAngleDeg: product.beam_angle_deg || undefined,
      operatingTemp: product.operating_temp || undefined,
      dimensionsMm: product.dimensions_mm || undefined,
      weightKg: product.weight_kg ? Number(product.weight_kg) : undefined,
      certifications: certifications as string[] | undefined,
      features: features as string[] | undefined,
      specs: specs as Record<string, string> | undefined,
    };
  } catch (error) {
    console.error('Unexpected error fetching product by slug:', error);
    return null;
  }
}

/**
 * Récupère un produit complet avec détails, images, catégorie et produits similaires
 * @param lang - La langue souhaitée ('fr', 'en', 'ar')
 * @param slug - Le slug du produit dans la langue spécifiée
 * @returns Le produit détaillé ou null si non trouvé
 */
export async function getProductDetailBySlug(lang: Lang, slug: string): Promise<ProductDetail | null> {
  try {
    const supabase = createSupabaseClient();

    // 1. Récupérer la traduction avec le slug
    const { data: translation, error: translationError } = await supabase
      .from('product_translations')
      .select('product_id, name, slug, short_description, long_description, application')
      .eq('slug', slug)
      .eq('lang', lang)
      .maybeSingle(); // Utiliser maybeSingle() au lieu de single() pour éviter l'erreur si aucun résultat

    if (translationError) {
      console.error(`Error fetching product translation by slug "${slug}" (lang: ${lang}):`, translationError);
      return null;
    }

    if (!translation) {
      console.warn(`No product translation found for slug "${slug}" in language "${lang}"`);
      return null;
    }

    // 2. Récupérer le produit avec la catégorie
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner (
          id,
          slug,
          name_fr,
          name_en,
          name_ar
        )
      `)
      .eq('id', translation.product_id)
      .eq('is_active', true)
      .maybeSingle();

    if (productError) {
      console.error(`Error fetching product with id ${translation.product_id}:`, productError);
      return null;
    }

    if (!productData) {
      console.warn(`Product with id ${translation.product_id} not found or not active`);
      return null;
    }

    const category = productData.categories as any;
    const categoryNameKey = `name_${lang}` as 'name_fr' | 'name_en' | 'name_ar';

    // 3. Récupérer les images
    const { data: imagesData, error: imagesError } = await supabase
      .from('product_images')
      .select('id, image_url, alt_fr, alt_en, alt_ar, position, is_main')
      .eq('product_id', translation.product_id)
      .order('position', { ascending: true });

    if (imagesError) {
      console.error('Error fetching product images:', imagesError);
    }

    // 4. Récupérer les produits similaires (4 produits de la même catégorie, exclure le produit actuel)
    const { data: relatedProductsData, error: relatedError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', productData.category_id)
      .eq('is_active', true)
      .neq('id', translation.product_id)
      .limit(4);

    // On ne récupère pas les détails complets des produits similaires ici
    // Ce sera fait dans la page si nécessaire, ou on peut les récupérer avec getProductsByCategorySlug

    // 5. Parser les JSONB
    const certifications = productData.certifications
      ? (Array.isArray(productData.certifications) ? productData.certifications : JSON.parse(JSON.stringify(productData.certifications)))
      : [];

    const features = productData.features
      ? (Array.isArray(productData.features) ? productData.features : JSON.parse(JSON.stringify(productData.features)))
      : [];

    const specs = productData.specs
      ? (typeof productData.specs === 'object' ? productData.specs : JSON.parse(JSON.stringify(productData.specs)))
      : {};

    // 6. Mapper les images avec alt selon la langue
    const images: ProductImage[] = (imagesData || []).map((img: any) => ({
      id: img.id,
      imageUrl: img.image_url,
      alt: img[`alt_${lang}`] || null,
      position: img.position,
      isMain: img.is_main || false,
    }));

    // 7. Construire le ProductDetail
    return {
      id: productData.id,
      categoryId: productData.category_id,
      sku: productData.sku,
      type: productData.type,
      powerW: productData.power_w,
      luminousFluxLm: productData.luminous_flux_lm,
      efficiencyLmPerW: productData.efficiency_lm_per_w ? Number(productData.efficiency_lm_per_w) : null,
      cctMin: productData.cct_min,
      cctMax: productData.cct_max,
      cri: productData.cri,
      ipRating: productData.ip_rating,
      ikRating: productData.ik_rating,
      isDimmable: productData.is_dimmable || false,
      isActive: productData.is_active || false,
      mainImageUrl: productData.main_image_url,
      priceHt: productData.price_ht ? Number(productData.price_ht) : null,
      priceCurrency: (productData.price_currency || 'EUR') as 'EUR' | 'USD',
      isQuoteOnly: productData.is_quote_only || false,
      createdAt: productData.created_at || new Date().toISOString(),
      name: translation.name,
      slug: translation.slug,
      shortDescription: translation.short_description || null,
      longDescription: translation.long_description || null,
      application: translation.application || null,
      // Nouveaux champs enrichis
      images,
      categorySlug: category.slug,
      categoryName: category[categoryNameKey] || category.slug,
      datasheetUrl: productData.datasheet_url || null,
      warrantyYears: productData.warranty_years || null,
      brand: productData.brand || null,
      model: productData.model || null,
      voltage: productData.voltage || null,
      lifetimeHours: productData.lifetime_hours || null,
      beamAngleDeg: productData.beam_angle_deg || null,
      operatingTemp: productData.operating_temp || null,
      dimensionsMm: productData.dimensions_mm || null,
      weightKg: productData.weight_kg ? Number(productData.weight_kg) : null,
      certifications: certifications as string[],
      features: features as string[],
      specs: specs as Record<string, string>,
    };
  } catch (error) {
    console.error('Unexpected error fetching product detail by slug:', error);
    return null;
  }
}

