import { User } from '@/lib/types/user';
import { createClient } from '@/lib/supabase/server';

/**
 * Récupère tous les utilisateurs
 */
export async function getUtilisateurs(): Promise<User[]> {
  try {
    const supabase = await createClient();
    
    const { data: utilisateurs, error } = await supabase
      .from('utilisateurs')
      .select(`
        *,
        roles:roles (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching utilisateurs:', error);
      return [];
    }

    if (!utilisateurs) {
      return [];
    }

    // Mapper les utilisateurs vers le type User
    return utilisateurs.map((utilisateur) => {
      const prenom = utilisateur.prenom || '';
      const nom = utilisateur.nom || '';
      const fullName = utilisateur.full_name || `${prenom} ${nom}`.trim() || utilisateur.email || 'Utilisateur';

      // Déterminer le rôle
      let role: User['role'] = 'viewer';
      if (utilisateur.roles) {
        if (Array.isArray(utilisateur.roles) && utilisateur.roles.length > 0) {
          role = (utilisateur.roles[0].slug as User['role']) || 'viewer';
        } else if (!Array.isArray(utilisateur.roles)) {
          role = (utilisateur.roles.slug as User['role']) || 'viewer';
        }
      }

      return {
        id: utilisateur.id,
        email: utilisateur.email,
        fullName,
        firstName: prenom,
        lastName: nom,
        role,
        avatar: utilisateur.photo_profil_url || utilisateur.avatar_url,
        active: utilisateur.statut === 'actif' || utilisateur.active === true,
        lastLogin: utilisateur.derniere_connexion ? new Date(utilisateur.derniere_connexion) : undefined,
        createdAt: new Date(utilisateur.created_at),
      };
    });
  } catch (error) {
    console.error('Error in getUtilisateurs:', error);
    return [];
  }
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUtilisateur(id: string): Promise<User | null> {
  try {
    const supabase = await createClient();
    
    const { data: utilisateur, error } = await supabase
      .from('utilisateurs')
      .select(`
        *,
        roles:roles (*)
      `)
      .eq('id', id)
      .single();

    if (error || !utilisateur) {
      console.error('Error fetching utilisateur:', error);
      return null;
    }

    // Mapper l'utilisateur vers le type User
    const prenom = utilisateur.prenom || '';
    const nom = utilisateur.nom || '';
    const fullName = utilisateur.full_name || `${prenom} ${nom}`.trim() || utilisateur.email || 'Utilisateur';

    // Déterminer le rôle
    let role: User['role'] = 'viewer';
    if (utilisateur.roles) {
      if (Array.isArray(utilisateur.roles) && utilisateur.roles.length > 0) {
        role = (utilisateur.roles[0].slug as User['role']) || 'viewer';
      } else if (!Array.isArray(utilisateur.roles)) {
        role = (utilisateur.roles.slug as User['role']) || 'viewer';
      }
    }

    return {
      id: utilisateur.id,
      email: utilisateur.email,
      fullName,
      firstName: prenom,
      lastName: nom,
      role,
      avatar: utilisateur.photo_profil_url || utilisateur.avatar_url,
      active: utilisateur.statut === 'actif' || utilisateur.active === true,
      lastLogin: utilisateur.derniere_connexion ? new Date(utilisateur.derniere_connexion) : undefined,
      createdAt: new Date(utilisateur.created_at),
    };
  } catch (error) {
    console.error('Error in getUtilisateur:', error);
    return null;
  }
}
