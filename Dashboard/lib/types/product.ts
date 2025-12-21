export interface CategoryTranslation {
  lang: Language;
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string; // FR par défaut pour compatibilité
  slug: string;
  description?: string; // FR par défaut pour compatibilité
  translations?: CategoryTranslation[]; // Toutes les traductions
  order: number;
  visible: boolean;
  productCount?: number;
}

export type ProductStatus = "active" | "inactive" | "draft";
export type Language = "fr" | "en" | "ar";

export interface ProductTranslation {
  lang: Language;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  long_description?: string;
  application?: string;
}

export interface Product {
  id: string;
  name: string; // FR par défaut pour compatibilité
  slug: string; // FR par défaut pour compatibilité
  description?: string; // FR par défaut pour compatibilité
  translations?: ProductTranslation[]; // Toutes les traductions
  categoryId: string;
  category?: Category;
  price?: number;
  priceOnQuote: boolean;
  promoActive: boolean;
  promoPrice?: number;
  stock: number;
  status: ProductStatus;
  images?: string[];
  technicalSheetUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

