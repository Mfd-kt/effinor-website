'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/cart-pricing';
import { Lang, Dictionary } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CartLineItem from './CartLineItem';
import Link from 'next/link';

interface CartClientProps {
  lang: Lang;
  dict: Dictionary;
}

export default function CartClient({ lang, dict }: CartClientProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getCartTotals } = useCart();

  const totals = getCartTotals();
  const hasQuoteOnly = totals.hasQuoteOnly;

  const handleContinue = () => {
    router.push(`/${lang}/cart/checkout`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-8 text-center">
            {dict.cart.title}
          </h1>
          <Card className="text-center py-12">
            <p className="text-lg text-[#4B5563] mb-6">{dict.cart.empty}</p>
            <Link href={`/${lang}/products`}>
              <Button variant="default">
                {dict.cart.browseProducts || 'Voir les produits'}
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-16 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-8 text-center">
          {dict.cart.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartLineItem
                key={item.productId}
                item={item}
                lang={lang}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Résumé et bouton continuer */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#111827] mb-4">
                {dict.cart.total}
              </h2>

              {/* Warning devises mixtes */}
              {totals.hasMixedCurrencies && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    {dict.cart.mixedCurrenciesWarning || dict.cart.mixedCurrencies}
                  </p>
                </div>
              )}

              {/* Info lignes sur devis */}
              {totals.hasQuoteOnly && !totals.hasMixedCurrencies && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {dict.cart.hasQuoteOnlyMessage || dict.cart.mixedCurrenciesMessage || 'Certaines lignes sont sur devis'}
                  </p>
                </div>
              )}

              {/* Total HT formaté */}
              {totals.totalHt !== null && totals.currency && (
                <p className="text-2xl font-bold text-[#10B981] mb-6">
                  {formatPrice(totals.totalHt, totals.currency, lang)}
                </p>
              )}

              {/* Bouton Continuer */}
              <Button
                variant="default"
                onClick={handleContinue}
                className="w-full"
              >
                {dict.cart.continueButton || 'Continuer'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

