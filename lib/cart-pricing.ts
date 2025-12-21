import type { Lang } from '@/types';
import type { PriceCurrency } from './pricing';
import type { CartItem } from './cart-store';

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

  const locale = localeMap[lang];
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedNumber = formatter.format(priceHt);
  const symbol = currency === 'EUR' ? '€' : '$';

  // Pour l'arabe, on met le symbole à droite
  if (lang === 'ar') {
    return `${formattedNumber} ${symbol}`;
  }

  return `${formattedNumber} ${symbol}`;
}

/**
 * Retourne le label "Sur devis" selon la langue
 * @param lang - La langue
 * @returns Label "Sur devis"
 */
export function quoteLabel(lang: Lang): string {
  const labels: Record<Lang, string> = {
    fr: 'Sur devis',
    en: 'Request a quote',
    ar: 'على الطلب',
  };
  return labels[lang];
}

/**
 * Retourne le label de prix pour une ligne de panier (prix formaté ou "Sur devis")
 * @param item - L'item du panier
 * @param lang - La langue
 * @returns Label de prix (formaté ou "Sur devis")
 */
export function linePriceLabel(item: CartItem, lang: Lang): string {
  // Si sur devis ou prix null
  if (item.isQuoteOnly || item.priceHt === null) {
    return quoteLabel(lang);
  }

  // Sinon, formater le prix
  return formatPrice(item.priceHt, item.priceCurrency, lang);
}






