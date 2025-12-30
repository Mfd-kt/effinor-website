'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { submitOrder } from '@/app/actions/orders';
import { formatPrice } from '@/lib/cart-pricing';
import { Lang, Dictionary, DeliveryAddress, OrderInput } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CartLineItem from './CartLineItem';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CheckoutClientProps {
  lang: Lang;
  dict: Dictionary;
}

export default function CheckoutClient({ lang, dict }: CheckoutClientProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getCartTotals } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totals = getCartTotals();
  const hasQuoteOnly = totals.hasQuoteOnly;
  const isRTL = lang === 'ar';

  // Rediriger si panier vide
  if (items.length === 0) {
    router.push(`/${lang}/cart`);
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Coordonnées client
    const customer = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      company: String(formData.get('company') || '').trim() || undefined,
    };

    // Adresse de livraison
    const deliveryAddress: DeliveryAddress = {
      address: String(formData.get('delivery_address') || '').trim(),
      address2: String(formData.get('delivery_address_2') || '').trim() || undefined,
      postcode: String(formData.get('delivery_postcode') || '').trim(),
      city: String(formData.get('delivery_city') || '').trim(),
      country: String(formData.get('delivery_country') || 'FR').trim(),
    };

    const notes = String(formData.get('notes') || '').trim() || undefined;

    // Construire l'input pour submitOrder
    const orderInput: OrderInput = {
      lang,
      customer,
      deliveryAddress,
      cartItems: items.map((item) => ({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        slug: item.slug,
        priceHt: item.priceHt,
        priceCurrency: item.priceCurrency,
        isQuoteOnly: item.isQuoteOnly || item.priceHt === null,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      notes,
      // paymentResult sera ajouté plus tard si paiement en ligne
    };

    const result = await submitOrder(orderInput);

    if (result.ok) {
      setStatus('success');
      clearCart();
      
      // Rediriger vers thank-you après un court délai
      setTimeout(() => {
        router.push(`/${lang}/thank-you`);
      }, 1500);
    } else {
      setStatus('error');
      setErrorMessage(result.error);
    }

    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Retour au panier */}
        <Link
          href={`/${lang}/cart`}
          className={`inline-flex items-center text-sm text-[#4B5563] hover:text-[#10B981] mb-8 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {dict.checkout.backToCart}
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-2">
          {dict.checkout.title}
        </h1>
        <p className="text-[#4B5563] mb-8">{dict.checkout.subtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des items (read-only) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#111827] mb-4">
                {dict.cart.title}
              </h2>
              <div className="space-y-4">
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
            </Card>
          </div>

          {/* Formulaire de checkout */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              {/* Résumé total */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-[#111827] mb-2">
                  {dict.cart.total}
                </h2>

                {totals.hasMixedCurrencies && (
                  <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      {dict.cart.mixedCurrenciesWarning || dict.cart.mixedCurrencies}
                    </p>
                  </div>
                )}

                {totals.hasQuoteOnly && !totals.hasMixedCurrencies && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {dict.cart.hasQuoteOnlyMessage || 'Certaines lignes sont sur devis'}
                    </p>
                  </div>
                )}

                {totals.totalHt !== null && totals.currency && (
                  <p className="text-2xl font-bold text-[#10B981]">
                    {formatPrice(totals.totalHt, totals.currency, lang)}
                  </p>
                )}
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coordonnées client */}
                <div>
                  <h3 className="text-lg font-semibold text-[#111827] mb-4">
                    {dict.checkout.customerTitle}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
                        {dict.cart.formName} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
                        {dict.cart.formEmail} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#111827] mb-1">
                        {dict.cart.formPhone} *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-[#111827] mb-1">
                        {dict.cart.formCompany}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                      />
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div>
                  <h3 className="text-lg font-semibold text-[#111827] mb-4">
                    {dict.checkout.deliveryTitle}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="delivery_address" className="block text-sm font-medium text-[#111827] mb-1">
                        {dict.checkout.address} *
                      </label>
                      <input
                        type="text"
                        id="delivery_address"
                        name="delivery_address"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                      />
                    </div>

                    <div>
                      <label htmlFor="delivery_address_2" className="block text-sm font-medium text-[#111827] mb-1">
                        {dict.checkout.address2}
                      </label>
                      <input
                        type="text"
                        id="delivery_address_2"
                        name="delivery_address_2"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="delivery_postcode" className="block text-sm font-medium text-[#111827] mb-1">
                          {dict.checkout.postcode} *
                        </label>
                        <input
                          type="text"
                          id="delivery_postcode"
                          name="delivery_postcode"
                          required
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                        />
                      </div>

                      <div>
                        <label htmlFor="delivery_city" className="block text-sm font-medium text-[#111827] mb-1">
                          {dict.checkout.city} *
                        </label>
                        <input
                          type="text"
                          id="delivery_city"
                          name="delivery_city"
                          required
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="delivery_country" className="block text-sm font-medium text-[#111827] mb-1">
                        {dict.checkout.country} *
                      </label>
                      <select
                        id="delivery_country"
                        name="delivery_country"
                        required
                        defaultValue="FR"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                      >
                        <option value="FR">France</option>
                        <option value="BE">Belgique</option>
                        <option value="CH">Suisse</option>
                        <option value="LU">Luxembourg</option>
                        <option value="TN">Tunisie</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-[#111827] mb-1">
                    {dict.checkout.notes}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder={dict.checkout.notesPlaceholder}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
                  />
                </div>

                {/* Messages d'erreur/succès */}
                {status === 'error' && (
                  <div className="p-4 rounded-lg bg-red-50 text-red-800 text-sm">
                    {dict.checkout.error} {errorMessage && `: ${errorMessage}`}
                  </div>
                )}

                {/* Bouton submit */}
                <Button
                  type="submit"
                  variant="default"
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting
                    ? dict.checkout.submitting
                    : hasQuoteOnly
                    ? dict.checkout.submitQuote
                    : dict.checkout.submitPaid}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}






