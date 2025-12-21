import { User } from '@/lib/types/user';

// La table utilisateurs n'existe pas dans le schéma fourni
// Retourner un tableau vide pour éviter les erreurs
export async function getUtilisateurs(): Promise<User[]> {
  console.warn('Table utilisateurs n\'existe pas dans la base de données');
  return [];
}

export async function getUtilisateur(id: string): Promise<User | null> {
  console.warn('Table utilisateurs n\'existe pas dans la base de données');
  return null;
}
