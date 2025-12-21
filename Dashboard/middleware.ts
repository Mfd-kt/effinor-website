import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware pour le Dashboard Effinor
 * 
 * Pour l'instant, ce middleware laisse passer toutes les requêtes.
 * Vous pouvez ajouter ici la logique d'authentification si nécessaire.
 */
export function middleware(request: NextRequest) {
  // Pour l'instant, on laisse passer toutes les requêtes
  // Vous pouvez ajouter ici :
  // - Vérification de l'authentification
  // - Redirection vers /login si non authentifié
  // - Gestion des permissions
  
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

