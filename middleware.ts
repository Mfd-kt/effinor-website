import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { detectPreferredLang } from '@/lib/detectLang';
import { isValidLang } from '@/lib/i18n';

/**
 * Middleware pour la gestion du routing multilingue
 * 
 * Redirige les utilisateurs arrivant sur "/" vers leur langue préférée
 * basée sur le cookie 'lang' ou le header Accept-Language
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si on est déjà sur une route avec langue (/fr, /en, /ar), on laisse passer
  const langMatch = pathname.match(/^\/(fr|en|ar)(\/|$)/);
  if (langMatch) {
    return NextResponse.next();
  }

  // Si on est sur la racine "/", détecter la langue et rediriger
  if (pathname === '/') {
    const cookieLang = request.cookies.get('lang')?.value;
    const acceptLanguage = request.headers.get('accept-language');

    const detectedLang = detectPreferredLang(acceptLanguage, cookieLang);

    // Redirection 302 vers /{lang}
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLang}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
