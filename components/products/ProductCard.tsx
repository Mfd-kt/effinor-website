'use client';

import { Product, Lang } from '@/lib/products';
import { getPriceLabel } from '@/lib/pricing';
import { Card } from '@/components/ui/card';
import AddToCartButton, { type CartItemInput } from '@/components/cart/AddToCartButton';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  lang: Lang;
}

export default function ProductCard({ product, lang }: ProductCardProps) {
  const priceLabel = getPriceLabel(product, lang);

  // Construire l'item CartItem pour AddToCartButton
  const cartItem: CartItemInput = {
    productId: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    priceHt: product.priceHt,
    priceCurrency: product.priceCurrency,
    isQuoteOnly: product.isQuoteOnly || product.priceHt === null,
    imageUrl: product.mainImageUrl,
  };

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col" padding="lg">
      {product.mainImageUrl && (
        <Link href={`/${lang}/products/${product.slug}`} className="hover:opacity-90 transition-opacity">
          <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <img
              src={product.mainImageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      )}

      <div className="flex-1 flex flex-col">
        <Link href={`/${lang}/products/${product.slug}`} className="hover:opacity-80 transition-opacity">
          <h3 className="text-xl font-bold text-[#111827] mb-2">{product.name}</h3>
        </Link>

        {/* Infos techniques */}
        {(product.type || product.powerW || product.luminousFluxLm) && (
          <div className="text-sm text-[#4B5563] mb-3 space-y-1">
            {product.type && <p>Type: {product.type}</p>}
            {product.powerW && <p>Puissance: {product.powerW} W</p>}
            {product.luminousFluxLm && (
              <p>Flux lumineux: {product.luminousFluxLm.toLocaleString(lang === 'fr' ? 'fr-FR' : lang === 'en' ? 'en-US' : 'ar-TN')} lm</p>
            )}
          </div>
        )}

        {/* Description courte */}
        {product.shortDescription && (
          <p className="text-sm text-[#4B5563] mb-4 flex-1">
            {product.shortDescription}
          </p>
        )}

        {/* Prix */}
        <div className="mb-4">
          <p
            className={`text-lg font-semibold ${
              priceLabel.isQuoteOnly
                ? 'text-[#4B5563]'
                : 'text-[#10B981]'
            }`}
          >
            {priceLabel.label}
          </p>
        </div>

        {/* Bouton */}
        <AddToCartButton
          item={cartItem}
          qty={1}
          lang={lang}
          className="w-full"
        />
      </div>
    </Card>
  );
}

