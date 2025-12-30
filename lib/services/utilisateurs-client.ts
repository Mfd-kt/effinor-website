'use client';

import { User } from '@/lib/types/user';
import { supabase } from '@/lib/supabase/client';

/**
 * Récupère tous les utilisateurs (version client)
 * À utiliser uniquement dans les Client Components
 */
export async function getUtilisateursClient(): Promise<User[]> {
  try {
    const { data: utilisateurs, error } = await supabase
      .from('utilisateurs')
      .select(`
        *,
        roles:roles (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      // Si c'est une erreur de récursion RLS, afficher un message plus clair
      if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
        console.error('❌ Erreur RLS: Récursion infinie détectée. Exécutez le script fix-utilisateurs-rls-recursion.sql dans Supabase.');
        console.error('Détails:', error);
      } else {
        console.error('Error fetching utilisateurs:', error);
      }
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
    console.error('Error in getUtilisateursClient:', error);
    return [];
  }
}

/**
 * Récupère un utilisateur par son ID (version client)
 * À utiliser uniquement dans les Client Components
 */
export async function getUtilisateurClient(id: string): Promise<User | null> {
  try {
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
    console.error('Error in getUtilisateurClient:', error);
    return null;
  }
}

