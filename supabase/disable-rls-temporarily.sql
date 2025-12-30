-- ============================================
-- DÉSACTIVATION TEMPORAIRE DE RLS
-- ============================================
-- 
-- ATTENTION: Ce script désactive RLS sur la table utilisateurs
-- Utilisez-le uniquement en développement ou si vous avez besoin
-- d'un accès libre temporairement
-- ============================================

-- Désactiver RLS sur la table utilisateurs
ALTER TABLE public.utilisateurs DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can read their own profile" ON public.utilisateurs;
DROP POLICY IF EXISTS "Admins can read all users" ON public.utilisateurs;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.utilisateurs;
DROP POLICY IF EXISTS "Super admins can manage all users" ON public.utilisateurs;
DROP POLICY IF EXISTS "Super admins can insert users" ON public.utilisateurs;
DROP POLICY IF EXISTS "Super admins can delete users" ON public.utilisateurs;

-- Supprimer les fonctions helper si elles existent
DROP FUNCTION IF EXISTS public.is_admin_user(UUID);
DROP FUNCTION IF EXISTS public.is_super_admin_user(UUID);

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'RLS désactivé sur la table utilisateurs. Accès libre activé.';
END $$;

