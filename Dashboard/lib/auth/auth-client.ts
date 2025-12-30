'use client';

import { User } from '@/lib/types/user';

/**
 * Récupère l'utilisateur actuellement authentifié (version client)
 * 
 * TEMPORAIREMENT SIMPLIFIÉ - Retourne un utilisateur mock
 * L'authentification sera réimplémentée proprement
 * 
 * @returns Un utilisateur mock avec rôle super_admin
 */
export async function getCurrentUserClient(): Promise<User | null> {
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

