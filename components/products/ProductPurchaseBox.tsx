'use client';

import { Product, Lang } from '@/lib/products';
import { Dictionary } from '@/types';
import AddToCartButton, { type CartItemInput } from '@/components/cart/AddToCartButton';

interface ProductPurchaseBoxProps {
  product: Product;
  lang: Lang;
  dict: Dictionary;
}

export default function ProductPurchaseBox({ product, lang, dict }: ProductPurchaseBoxProps) {
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
    <AddToCartButton
      item={cartItem}
      qty={1}
      lang={lang}
      className="w-full py-3 text-base"
    />
  );
}

