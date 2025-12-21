import { Lang } from '@/types';

/**
 * Utilitaires pour la gestion du routing multilingue
 */

/**
 * Convertit une route dans une autre langue
 * 
 * @param currentPath - Le chemin actuel (ex: '/fr/contact')
 * @param targetLang - La langue cible
 * @returns Le nouveau chemin (ex: '/en/contact')
 */
export function switchLanguage(currentPath: string, targetLang: Lang): string {
  // Extraire la langue actuelle et le reste du chemin
  const pathParts = currentPath.split('/').filter(Boolean);
  
  // Si le premier segment est une langue valide, le remplacer
  if (pathParts.length > 0 && ['fr', 'en', 'ar'].includes(pathParts[0])) {
    pathParts[0] = targetLang;
    return '/' + pathParts.join('/');
  }
  
  // Sinon, ajouter la langue au début
  return `/${targetLang}${currentPath === '/' ? '' : currentPath}`;
}

/**
 * Obtient la langue actuelle depuis un chemin
 */
export function getLangFromPath(path: string): Lang | null {
  const match = path.match(/^\/(fr|en|ar)(\/|$)/);
  return match ? (match[1] as Lang) : null;
}
