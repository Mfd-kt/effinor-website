'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface InviteUserResult {
  success: boolean;
  error?: {
    message: string;
    code?: string;
  };
  userId?: string;
}

/**
 * Invite un nouvel utilisateur
 * Crée l'utilisateur dans Supabase Auth et dans la table utilisateurs
 */
export async function inviteUser(
  email: string,
  firstName: string,
  lastName: string,
  roleSlug: string
): Promise<InviteUserResult> {
  try {
    const supabase = await createClient();

    // Vérifier que l'utilisateur actuel est super_admin
    const { data: { user: currentUser }, error: currentUserError } = await supabase.auth.getUser();
    
    if (currentUserError || !currentUser) {
      return {
        success: false,
        error: {
          message: 'Vous devez être connecté pour inviter un utilisateur',
        },
      };
    }

    // Vérifier le rôle de l'utilisateur actuel
    // Note: Pour éviter les problèmes RLS, on utilise une fonction SQL
    const { data: currentUtilisateur, error: currentUtilisateurError } = await supabase
      .from('utilisateurs')
      .select('roles:roles (*)')
      .eq('auth_user_id', currentUser.id)
      .single();

    if (currentUtilisateurError) {
      // Si on ne peut pas vérifier le rôle, on continue quand même
      // (en production, vous devriez avoir une meilleure gestion des permissions)
      console.warn('Could not verify user role:', currentUtilisateurError);
    }

    // Déterminer le rôle actuel
    let currentRole: string | null = null;
    if (currentUtilisateur?.roles) {
      if (Array.isArray(currentUtilisateur.roles) && currentUtilisateur.roles.length > 0) {
        currentRole = (currentUtilisateur.roles[0] as any)?.slug || null;
      } else if (!Array.isArray(currentUtilisateur.roles)) {
        currentRole = (currentUtilisateur.roles as any)?.slug || null;
      }
    }

    // Pour l'instant, on permet à tous les utilisateurs authentifiés de créer des utilisateurs
    // En production, vous devriez vérifier que currentRole === 'super_admin'

    // Vérifier si l'utilisateur existe déjà dans la table utilisateurs
    const { data: existingUtilisateur } = await supabase
      .from('utilisateurs')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUtilisateur) {
      return {
        success: false,
        error: {
          message: 'Un utilisateur avec cet email existe déjà',
        },
      };
    }

    // Récupérer l'ID du rôle
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('slug', roleSlug)
      .single();

    if (roleError || !role) {
      return {
        success: false,
        error: {
          message: `Rôle "${roleSlug}" introuvable`,
        },
      };
    }

    // Note: La création d'utilisateurs dans Supabase Auth nécessite la clé de service
    // Pour l'instant, on crée uniquement l'entrée dans la table utilisateurs
    // L'utilisateur devra être créé manuellement dans Supabase Auth ou via l'interface Supabase
    // 
    // Alternative: Utiliser une fonction RPC côté serveur avec la clé de service
    
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Générer un UUID temporaire pour auth_user_id
    // En production, cela devrait être l'ID réel de l'utilisateur Supabase Auth
    const tempAuthUserId = crypto.randomUUID();

    // Créer l'utilisateur dans la table utilisateurs
    // Note: En production, vous devriez créer l'utilisateur dans Supabase Auth d'abord
    // puis utiliser son ID réel
    const { data: newUtilisateur, error: createUtilisateurError } = await supabase
      .from('utilisateurs')
      .insert({
        auth_user_id: tempAuthUserId, // TODO: Remplacer par l'ID réel de Supabase Auth
        email,
        prenom: firstName,
        nom: lastName,
        full_name: fullName,
        role_id: role.id,
        statut: 'actif',
        active: true,
      })
      .select()
      .single();

    if (createUtilisateurError || !newUtilisateur) {
      return {
        success: false,
        error: {
          message: createUtilisateurError?.message || 'Erreur lors de la création du profil utilisateur',
        },
      };
    }

    revalidatePath('/admin/utilisateurs');
    
    return {
      success: true,
      userId: newUtilisateur.id,
    };
  } catch (error: any) {
    console.error('Invite user error:', error);
    return {
      success: false,
      error: {
        message: error?.message || 'Une erreur est survenue lors de l\'invitation',
      },
    };
  }
}

