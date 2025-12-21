'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { ShoppingCart } from 'lucide-react';
import type { Lang } from '@/types';

interface CartIconButtonProps {
  lang: Lang;
  className?: string;
}

export default function CartIconButton({ lang, className }: CartIconButtonProps) {
  const { items } = useCart();
  const itemCount = items.length;

  return (
    <Link
      href={`/${lang}/cart`}
      className={`relative inline-flex items-center justify-center p-2 text-[#111827] hover:text-[#10B981] transition-colors ${className || ''}`}
      aria-label={`Panier (${itemCount} article${itemCount > 1 ? 's' : ''})`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#10B981] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}






