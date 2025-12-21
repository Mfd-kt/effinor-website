'use client';

import { Card } from '@/components/ui/Card';
import { Trash2, Plus, Minus } from 'lucide-react';
import { linePriceLabel } from '@/lib/cart-pricing';
import type { CartItem } from '@/lib/cart-store';
import type { Lang } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface CartLineItemProps {
  item: CartItem;
  lang: Lang;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartLineItem({
  item,
  lang,
  onUpdateQuantity,
  onRemove,
}: CartLineItemProps) {
  const priceLabel = linePriceLabel(item, lang);

  return (
    <Card className="p-4 md:p-6">
      <div className="flex gap-4">
        {/* Image produit */}
        {item.imageUrl && (
          <div className="flex-shrink-0">
            {item.slug ? (
              <Link href={`/${lang}/products/${item.slug}`}>
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F3F4F6] rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F3F4F6] rounded-lg overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Infos produit */}
        <div className="flex-1 min-w-0">
          {item.slug ? (
            <Link
              href={`/${lang}/products/${item.slug}`}
              className="hover:text-[#10B981] transition-colors"
            >
              <h3 className="text-lg font-bold text-[#111827] mb-1 truncate">
                {item.name}
              </h3>
            </Link>
          ) : (
            <h3 className="text-lg font-bold text-[#111827] mb-1 truncate">
              {item.name}
            </h3>
          )}

          {item.sku && (
            <p className="text-sm text-[#4B5563] mb-2">SKU: {item.sku}</p>
          )}

          {/* Prix ligne */}
          <p
            className={`text-lg font-semibold mb-4 ${
              item.isQuoteOnly || item.priceHt === null
                ? 'text-[#4B5563]'
                : 'text-[#10B981]'
            }`}
          >
            {priceLabel}
          </p>

          {/* Contrôles quantité et supprimer */}
          <div className="flex items-center justify-between">
            {/* Contrôles quantité */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium text-[#111827]">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Bouton supprimer */}
            <button
              type="button"
              onClick={() => onRemove(item.productId)}
              className="text-red-600 hover:text-red-700 transition-colors p-2"
              aria-label="Supprimer du panier"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}






