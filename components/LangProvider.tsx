'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isValidLang } from '@/lib/i18n';
import { Lang } from '@/types';

/**
 * Composant client qui met à jour les attributs lang et dir du document
 * en fonction de la langue détectée dans l'URL
 */
export default function LangProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const match = pathname.match(/^\/(fr|en|ar)(\/|$)/);
    const lang: Lang | null = match ? (match[1] as Lang) : 'fr';

    if (lang && isValidLang(lang)) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [pathname]);

  return null;
}
