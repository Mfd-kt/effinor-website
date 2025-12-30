-- ============================================
-- Correction de la récursion infinie dans les politiques RLS
-- ============================================
-- 
-- Le problème : Les politiques RLS vérifient le rôle en interrogeant
-- la table utilisateurs, ce qui déclenche la même politique, créant une boucle infinie.
-- 
-- Solution : Utiliser une fonction SQL qui évite la récursion
-- ============================================

-- Fonction helper pour vérifier si l'utilisateur est admin (évite la récursion)
-- Utilise SECURITY DEFINER et BYPASSRLS pour éviter la récursion
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  user_role_slug TEXT;
BEGIN
  -- Utiliser une requête directe sans passer par RLS
  SELECT r.slug INTO user_role_slug
  FROM public.utilisateurs u
  JOIN public.roles r ON u.role_id = r.id
  WHERE u.auth_user_id = user_uuid
  LIMIT 1;
  
  RETURN COALESCE(user_role_slug IN ('super_admin', 'admin'), false);
END;
$$;

-- Fonction helper pour vérifier si l'utilisateur est super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin_user(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  user_role_slug TEXT;
BEGIN
  -- Utiliser une requête directe sans passer par RLS
  SELECT r.slug INTO user_role_slug
  FROM public.utilisateurs u
  JOIN public.roles r ON u.role_id = r.id
  WHERE u.auth_user_id = user_uuid
  LIMIT 1;
  
  RETURN COALESCE(user_role_slug = 'super_admin', false);
END;
$$;

-- Accorder les permissions nécessaires aux fonctions
GRANT EXECUTE ON FUNCTION public.is_admin_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin_user(UUID) TO authenticated;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can read their own profile" ON public.utilisateurs;
DROP POLICY IF EXISTS "Admins can read all users" ON public.utilisateurs;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.utilisateurs;
DROP POLICY IF EXISTS "Super admins can manage all users" ON public.utilisateurs;

-- Nouvelle politique : Les utilisateurs peuvent lire leur propre profil
CREATE POLICY "Users can read their own profile"
  ON public.utilisateurs
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Nouvelle politique : Les admins peuvent lire tous les utilisateurs (sans récursion)
CREATE POLICY "Admins can read all users"
  ON public.utilisateurs
  FOR SELECT
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

-- Nouvelle politique : Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile"
  ON public.utilisateurs
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Nouvelle politique : Les super_admins peuvent tout faire
CREATE POLICY "Super admins can manage all users"
  ON public.utilisateurs
  FOR ALL
  TO authenticated
  USING (public.is_super_admin_user(auth.uid()))
  WITH CHECK (public.is_super_admin_user(auth.uid()));

-- Politique pour permettre l'insertion (pour les super_admins)
CREATE POLICY "Super admins can insert users"
  ON public.utilisateurs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin_user(auth.uid()));

-- Politique pour permettre la suppression (pour les super_admins)
CREATE POLICY "Super admins can delete users"
  ON public.utilisateurs
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin_user(auth.uid()));

