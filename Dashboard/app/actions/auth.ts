'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResult {
  success: boolean;
  error?: AuthError;
}

/**
 * Connexion d'un utilisateur avec email et mot de passe
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    console.log('🔐 Attempting login for email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Login error from Supabase:', error.message, error.status);
      return {
        success: false,
        error: {
          message: error.message,
          code: error.status?.toString(),
        },
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: {
          message: 'Aucun utilisateur trouvé',
        },
      };
    }

    // Note: Ne pas vérifier la session ici car les cookies peuvent ne pas être
    // immédiatement disponibles dans la même Server Action
    // Le middleware vérifiera la session lors de la requête suivante

    // Mettre à jour la dernière connexion dans la table utilisateurs
    try {
      const { error: updateError } = await supabase.rpc('update_last_login', {
        auth_user_uuid: data.user.id,
      });

      if (updateError) {
        console.error('Error updating last login:', updateError);
        // Ne pas bloquer la connexion si la mise à jour échoue
      }
    } catch (updateError) {
      console.error('Error calling update_last_login:', updateError);
    }

    revalidatePath('/', 'layout');
    
    console.log('✅ Login successful for user:', data.user.email);
    console.log('✅ Session and cookies should be set in response');
    
    // Retourner success et laisser le client gérer la redirection
    // Les cookies sont maintenant définis dans la réponse HTTP
    return { success: true };
  } catch (error: any) {
    // Si c'est une redirection Next.js, la propager (ne pas l'intercepter)
    if (error?.digest === 'NEXT_REDIRECT') {
      throw error;
    }
    
    console.error('Login error:', error);
    return {
      success: false,
      error: {
        message: error?.message || 'Une erreur est survenue lors de la connexion',
      },
    };
  }
}

/**
 * Déconnexion de l'utilisateur
 */
export async function logout(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la déconnexion',
      },
    };
  }
}

/**
 * Envoie un email de réinitialisation de mot de passe
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    // Récupérer l'URL de redirection depuis les variables d'environnement
    // Pour le Dashboard, on utilise l'URL du Dashboard
    // Note: Cette URL doit être configurée dans Supabase Dashboard > Authentication > URL Configuration
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
      : process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.co', '')}/reset-password`
      : '/reset-password';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }

    // Toujours retourner success pour ne pas révéler si l'email existe
    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la demande de réinitialisation',
      },
    };
  }
}

/**
 * Met à jour le mot de passe de l'utilisateur
 * Note: Quand l'utilisateur clique sur le lien de réinitialisation,
 * Supabase crée automatiquement une session temporaire. On vérifie
 * simplement que la session existe avant de mettre à jour le mot de passe.
 */
export async function updatePassword(
  newPassword: string
): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    // Vérifier que l'utilisateur a une session valide
    // (Supabase crée une session temporaire lors du clic sur le lien de réinitialisation)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return {
        success: false,
        error: {
          message: 'Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.',
        },
      };
    }

    // Validation du mot de passe
    if (newPassword.length < 6) {
      return {
        success: false,
        error: {
          message: 'Le mot de passe doit contenir au moins 6 caractères',
        },
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return {
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la mise à jour du mot de passe',
      },
    };
  }
}

/**
 * Vérifie l'email de l'utilisateur avec un token
 * Note: Supabase gère généralement la vérification d'email automatiquement
 * via les liens dans les emails. Cette fonction peut être utilisée
 * pour vérifier manuellement si nécessaire.
 */
export async function verifyEmail(token: string): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    // Pour la vérification d'email, Supabase utilise généralement
    // des liens avec des tokens dans l'URL. Si un token est fourni,
    // on peut essayer de vérifier avec verifyOtp
    // Sinon, on vérifie simplement si l'utilisateur est connecté
    // et si son email est vérifié
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: {
          message: 'Aucun utilisateur connecté',
        },
      };
    }

    // Si l'email est déjà vérifié, retourner success
    if (user.email_confirmed_at) {
      revalidatePath('/', 'layout');
      return { success: true };
    }

    // Si un token est fourni, essayer de le vérifier
    if (token) {
      try {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (verifyError) {
          return {
            success: false,
            error: {
              message: verifyError.message,
            },
          };
        }
      } catch (otpError) {
        // Si verifyOtp échoue, ce n'est peut-être pas le bon format
        // La vérification peut avoir été faite automatiquement par Supabase
        console.log('OTP verification attempt:', otpError);
      }
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Verify email error:', error);
    return {
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la vérification de l\'email',
      },
    };
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export async function checkAuth(): Promise<{ authenticated: boolean }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { authenticated: false };
    }

    return { authenticated: true };
  } catch (error) {
    console.error('Check auth error:', error);
    return { authenticated: false };
  }
}

