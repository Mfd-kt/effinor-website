// La table notifications n'existe pas dans le schéma fourni
// Retourner un tableau vide pour éviter les erreurs

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

export async function getNotifications(userId?: string): Promise<Notification[]> {
  console.warn('Table notifications n\'existe pas dans la base de données');
  return [];
}

export async function markAsRead(id: string) {
  console.warn('Table notifications n\'existe pas dans la base de données');
}
