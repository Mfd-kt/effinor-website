import type { Product, Lang } from './products';

export type PriceCurrency = 'EUR' | 'USD';

/**
 * Formate un prix selon la langue et la devise
 * @param priceHt - Prix HT
 * @param currency - Devise ('EUR' ou 'USD')
 * @param lang - Langue pour le formatage
 * @returns Prix formaté (ex: "1 234,56 €")
 */
export function formatPrice(
  priceHt: number,
  currency: PriceCurrency,
  lang: Lang
): string {
  const localeMap: Record<Lang, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    ar: 'ar-TN',
  };

  const currencySymbols: Record<PriceCurrency, string> = {
    EUR: '€',
    USD: '$',
  };

  const locale = localeMap[lang];
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedNumber = formatter.format(priceHt);
  const symbol = currencySymbols[currency];

  // Pour l'arabe, on met le symbole à droite, sinon à gauche
  if (lang === 'ar') {
    return `${formattedNumber} ${symbol}`;
  }

  return `${formattedNumber} ${symbol}`;
}

/**
 * Retourne le label de prix pour un produit (prix formaté ou "Sur devis")
 * @param product - Le produit
 * @param lang - La langue
 * @returns Objet avec isQuoteOnly et label
 */
export function getPriceLabel(product: Product, lang: Lang): {
  isQuoteOnly: boolean;
  label: string;
} {
  // Si le produit est sur devis ou n'a pas de prix
  if (product.isQuoteOnly || product.priceHt === null) {
    const labels: Record<Lang, string> = {
      fr: 'Sur devis',
      en: 'Request a quote',
      ar: 'على الطلب',
    };
    return {
      isQuoteOnly: true,
      label: labels[lang],
    };
  }

  // Sinon, formater le prix
  return {
    isQuoteOnly: false,
    label: formatPrice(product.priceHt, product.priceCurrency, lang),
  };
}






