import { Visitor, VisitorSession } from '@/lib/types/visitor';

// La table visiteurs n'existe pas dans le schéma fourni
// Retourner un tableau vide pour éviter les erreurs
export async function getVisiteurs(): Promise<Visitor[]> {
  console.warn('Table visiteurs n\'existe pas dans la base de données');
  return [];
}

export async function getVisiteurSession(sessionId: string): Promise<VisitorSession | null> {
  console.warn('Table visiteurs n\'existe pas dans la base de données');
  return null;
}
