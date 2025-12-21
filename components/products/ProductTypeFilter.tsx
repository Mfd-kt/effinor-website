'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/lib/products';
import ProductCard from './ProductCard';
import { Lang } from '@/types';

interface ProductTypeFilterProps {
  products: Product[];
  lang: Lang;
}

export default function ProductTypeFilter({ products, lang }: ProductTypeFilterProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Extraire les types uniques depuis les produits
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach((product) => {
      if (product.type) {
        types.add(product.type);
      }
    });
    return Array.from(types).sort();
  }, [products]);

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    if (!selectedType) {
      return products;
    }
    return products.filter((product) => product.type === selectedType);
  }, [products, selectedType]);

  const labels = {
    all: {
      fr: 'Tous',
      en: 'All',
      ar: 'الكل',
    },
  };

  return (
    <div>
      {/* Tabs de filtres */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === null
              ? 'bg-[#10B981] text-white'
              : 'bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB]'
          }`}
        >
          {labels.all[lang]}
        </button>
        {availableTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === type
                ? 'bg-[#10B981] text-white'
                : 'bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grille de produits filtrés */}
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-8 text-[#4B5563]">
          {lang === 'fr' && 'Aucun produit trouvé pour ce filtre.'}
          {lang === 'en' && 'No products found for this filter.'}
          {lang === 'ar' && 'لم يتم العثور على منتجات لهذا الفلتر.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

