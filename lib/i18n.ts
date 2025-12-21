import { Lang, Dictionary } from '@/types';
import { fr } from '@/i18n/fr';
import { en } from '@/i18n/en';
import { ar } from '@/i18n/ar';

/**
 * Récupère le dictionnaire de traduction pour une langue donnée
 * @param lang - La langue souhaitée ('fr', 'en', 'ar')
 * @returns Le dictionnaire de traduction correspondant
 */
export function getDictionary(lang: Lang): Dictionary {
  const dictionaries: Record<Lang, Dictionary> = {
    fr,
    en,
    ar,
  };

  return dictionaries[lang] || dictionaries.fr; // Fallback sur français par défaut
}

/**
 * Vérifie si une chaîne est une langue valide
 */
export function isValidLang(lang: string): lang is Lang {
  return ['fr', 'en', 'ar'].includes(lang);
}
