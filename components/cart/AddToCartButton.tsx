'use client';

import { useCart } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import type { Lang } from '@/types';

export type CartItemInput = {
  productId: string;
  sku: string | null;
  name: string;
  slug?: string;
  priceHt: number | null;
  priceCurrency: 'EUR' | 'USD';
  isQuoteOnly: boolean;
  imageUrl?: string | null;
};

interface AddToCartButtonProps {
  item: CartItemInput;
  qty?: number;
  lang: Lang;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const buttonLabels = {
  addToCart: {
    fr: 'Ajouter au panier',
    en: 'Add to cart',
    ar: 'إضافة إلى السلة',
  },
  requestQuote: {
    fr: 'Demander un devis',
    en: 'Request a quote',
    ar: 'طلب عرض سعر',
  },
  added: {
    fr: 'Ajouté !',
    en: 'Added!',
    ar: 'تم الإضافة!',
  },
};

export default function AddToCartButton({
  item,
  qty = 1,
  lang,
  className,
  variant,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleClick = () => {
    addItem(item, qty);
    // Message de succès simple (on pourrait utiliser un toast système si disponible)
    console.log(`Product added to cart: ${item.name}`);
  };

  const isQuoteOnly = item.isQuoteOnly || item.priceHt === null;
  const buttonVariant = variant || (isQuoteOnly ? 'secondary' : 'primary');
  const label = isQuoteOnly
    ? buttonLabels.requestQuote[lang]
    : buttonLabels.addToCart[lang];

  return (
    <Button
      variant={buttonVariant}
      onClick={handleClick}
      className={className}
    >
      {label}
      <ShoppingCart className="ml-2 h-5 w-5" />
    </Button>
  );
}






