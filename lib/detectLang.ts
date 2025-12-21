import { Lang } from '@/types';

/**
 * Détecte la langue préférée de l'utilisateur
 * 
 * Cette fonction peut être étendue plus tard pour utiliser :
 * - La géolocalisation IP (Cloudflare / Vercel Geo)
 * - Des services tiers de détection
 * 
 * @param acceptLanguage - Header Accept-Language de la requête
 * @param cookieLang - Valeur du cookie 'lang' si présent
 * @returns La langue détectée ('fr', 'en', 'ar')
 */
export function detectPreferredLang(
  acceptLanguage?: string | null,
  cookieLang?: string | null
): Lang {
  // 1. Priorité au cookie si présent et valide
  if (cookieLang && ['fr', 'en', 'ar'].includes(cookieLang)) {
    return cookieLang as Lang;
  }

  // 2. Sinon, analyser le header Accept-Language
  if (acceptLanguage) {
    const languages = acceptLanguage
      .toLowerCase()
      .split(',')
      .map((lang) => lang.split(';')[0].trim());

    for (const lang of languages) {
      // Français
      if (lang.startsWith('fr')) {
        return 'fr';
      }
      // Arabe
      if (lang.startsWith('ar')) {
        return 'ar';
      }
      // Anglais (par défaut pour les autres)
      if (lang.startsWith('en')) {
        return 'en';
      }
    }
  }

  // 3. Par défaut : français
  return 'fr';
}
