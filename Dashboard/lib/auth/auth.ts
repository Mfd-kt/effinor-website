import { User } from '@/lib/types/user';

/**
 * Récupère l'utilisateur actuellement authentifié
 * 
 * TEMPORAIREMENT SIMPLIFIÉ - Retourne un utilisateur mock
 * L'authentification sera réimplémentée proprement
 * 
 * @returns Un utilisateur mock avec rôle super_admin
 */
export async function getCurrentUser(): Promise<User | null> {
  // TEMPORAIRE : Retourner un utilisateur mock
  // L'authentification sera réimplémentée proprement
  return {
    id: 'temp-user-1',
    email: 'admin@effinor.com',
    fullName: 'Admin Effinor',
    firstName: 'Admin',
    lastName: 'Effinor',
    role: 'super_admin',
    active: true,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01'),
  };
}

/**
 * Vérifie si l'utilisateur est authentifié
 * 
 * TEMPORAIREMENT SIMPLIFIÉ - Retourne toujours true
 * L'authentification sera réimplémentée proprement
 * 
 * @returns true (toujours pour l'instant)
 */
export async function isAuthenticated(): Promise<boolean> {
  // TEMPORAIRE : Retourner toujours true
  return true;
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * 
 * @param allowedRoles Liste des rôles autorisés
 * @returns true si l'utilisateur a un des rôles autorisés
 */
export async function hasRole(allowedRoles: User['role'][]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  return allowedRoles.includes(user.role);
}

/**
 * Requiert que l'utilisateur soit authentifié
 * Lance une erreur si non authentifié (pour Server Components)
 * 
 * @returns L'utilisateur authentifié
 * @throws Error si non authentifié
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

