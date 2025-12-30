-- ============================================
-- Tables pour la gestion des utilisateurs et rôles
-- ============================================
-- 
-- Ce fichier crée les tables nécessaires pour l'authentification
-- et la gestion des utilisateurs du Dashboard Effinor
-- ============================================

-- Table : roles
-- Stocke les rôles disponibles (super_admin, admin, editor, viewer)
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL CHECK (slug IN ('super_admin', 'admin', 'editor', 'viewer')),
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ajouter les colonnes manquantes si la table existe déjà avec une structure différente
DO $$ 
BEGIN
  -- Ajouter name_fr si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'roles' AND column_name = 'name_fr'
  ) THEN
    ALTER TABLE public.roles ADD COLUMN name_fr TEXT;
    -- Mettre à jour les valeurs existantes basées sur le slug
    UPDATE public.roles SET name_fr = 
      CASE slug
        WHEN 'super_admin' THEN 'Super Administrateur'
        WHEN 'admin' THEN 'Administrateur'
        WHEN 'editor' THEN 'Éditeur'
        WHEN 'viewer' THEN 'Visualiseur'
        ELSE 'Rôle'
      END
    WHERE name_fr IS NULL;
    -- Maintenant on peut ajouter la contrainte NOT NULL
    ALTER TABLE public.roles ALTER COLUMN name_fr SET NOT NULL;
  END IF;

  -- Ajouter name_en si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'roles' AND column_name = 'name_en'
  ) THEN
    ALTER TABLE public.roles ADD COLUMN name_en TEXT;
    -- Mettre à jour les valeurs existantes basées sur le slug
    UPDATE public.roles SET name_en = 
      CASE slug
        WHEN 'super_admin' THEN 'Super Administrator'
        WHEN 'admin' THEN 'Administrator'
        WHEN 'editor' THEN 'Editor'
        WHEN 'viewer' THEN 'Viewer'
        ELSE 'Role'
      END
    WHERE name_en IS NULL;
    -- Maintenant on peut ajouter la contrainte NOT NULL
    ALTER TABLE public.roles ALTER COLUMN name_en SET NOT NULL;
  END IF;

  -- Ajouter description_fr si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'roles' AND column_name = 'description_fr'
  ) THEN
    ALTER TABLE public.roles ADD COLUMN description_fr TEXT;
  END IF;

  -- Ajouter description_en si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'roles' AND column_name = 'description_en'
  ) THEN
    ALTER TABLE public.roles ADD COLUMN description_en TEXT;
  END IF;

  -- Ajouter created_at si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'roles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.roles ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
    UPDATE public.roles SET created_at = now() WHERE created_at IS NULL;
    ALTER TABLE public.roles ALTER COLUMN created_at SET NOT NULL;
  END IF;

  -- Supprimer la contrainte CHECK existante si elle existe (pour la recréer proprement)
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_schema = 'public' AND table_name = 'roles' 
    AND constraint_name = 'roles_slug_check'
  ) THEN
    ALTER TABLE public.roles DROP CONSTRAINT roles_slug_check;
  END IF;

  -- Nettoyer les données : supprimer les rôles qui ne correspondent pas aux valeurs autorisées
  DELETE FROM public.roles 
  WHERE slug NOT IN ('super_admin', 'admin', 'editor', 'viewer');

  -- Ajouter la contrainte CHECK sur slug
  ALTER TABLE public.roles ADD CONSTRAINT roles_slug_check 
  CHECK (slug IN ('super_admin', 'admin', 'editor', 'viewer'));
END $$;

-- Index pour le slug
CREATE INDEX IF NOT EXISTS idx_roles_slug ON public.roles(slug);

-- Commentaires
COMMENT ON TABLE public.roles IS 'Rôles disponibles pour les utilisateurs du Dashboard';
COMMENT ON COLUMN public.roles.slug IS 'Identifiant unique du rôle (super_admin, admin, editor, viewer)';

-- Table : utilisateurs
-- Stocke les métadonnées des utilisateurs liées à auth.users
CREATE TABLE IF NOT EXISTS public.utilisateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  prenom TEXT,
  nom TEXT,
  full_name TEXT,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  statut TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  photo_profil_url TEXT,
  avatar_url TEXT,
  derniere_connexion TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_utilisateurs_auth_user_id ON public.utilisateurs(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_email ON public.utilisateurs(email);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_role_id ON public.utilisateurs(role_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_statut ON public.utilisateurs(statut);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_active ON public.utilisateurs(active);

-- Commentaires
COMMENT ON TABLE public.utilisateurs IS 'Métadonnées des utilisateurs du Dashboard Effinor';
COMMENT ON COLUMN public.utilisateurs.auth_user_id IS 'Référence vers auth.users (Supabase Auth)';
COMMENT ON COLUMN public.utilisateurs.role_id IS 'Rôle de l''utilisateur';
COMMENT ON COLUMN public.utilisateurs.statut IS 'Statut de l''utilisateur (actif, inactif, suspendu)';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_utilisateurs_updated_at ON public.utilisateurs;
CREATE TRIGGER update_utilisateurs_updated_at
  BEFORE UPDATE ON public.utilisateurs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour derniere_connexion lors de la connexion
-- Ce trigger sera appelé via une fonction qui peut être invoquée depuis l'application
CREATE OR REPLACE FUNCTION update_last_login(auth_user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.utilisateurs
  SET derniere_connexion = now()
  WHERE auth_user_id = auth_user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activer Row Level Security (RLS)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utilisateurs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour la table roles
-- Tous les utilisateurs authentifiés peuvent lire les rôles
DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.roles;
CREATE POLICY "Authenticated users can read roles"
  ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Seuls les super_admin peuvent modifier les rôles
DROP POLICY IF EXISTS "Super admins can manage roles" ON public.roles;
CREATE POLICY "Super admins can manage roles"
  ON public.roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.utilisateurs u
      JOIN public.roles r ON u.role_id = r.id
      WHERE u.auth_user_id = auth.uid()
      AND r.slug = 'super_admin'
    )
  );

-- Politiques RLS pour la table utilisateurs
-- Les utilisateurs peuvent lire leur propre profil
DROP POLICY IF EXISTS "Users can read their own profile" ON public.utilisateurs;
CREATE POLICY "Users can read their own profile"
  ON public.utilisateurs
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Les admins et super_admins peuvent lire tous les utilisateurs
DROP POLICY IF EXISTS "Admins can read all users" ON public.utilisateurs;
CREATE POLICY "Admins can read all users"
  ON public.utilisateurs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.utilisateurs u
      JOIN public.roles r ON u.role_id = r.id
      WHERE u.auth_user_id = auth.uid()
      AND r.slug IN ('super_admin', 'admin')
    )
  );

-- Les utilisateurs peuvent mettre à jour leur propre profil (sauf rôle et statut)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.utilisateurs;
CREATE POLICY "Users can update their own profile"
  ON public.utilisateurs
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (
    auth_user_id = auth.uid()
    AND role_id = (SELECT role_id FROM public.utilisateurs WHERE auth_user_id = auth.uid())
    AND statut = (SELECT statut FROM public.utilisateurs WHERE auth_user_id = auth.uid())
  );

-- Les super_admins peuvent gérer tous les utilisateurs
DROP POLICY IF EXISTS "Super admins can manage all users" ON public.utilisateurs;
CREATE POLICY "Super admins can manage all users"
  ON public.utilisateurs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.utilisateurs u
      JOIN public.roles r ON u.role_id = r.id
      WHERE u.auth_user_id = auth.uid()
      AND r.slug = 'super_admin'
    )
  );

-- Insérer les rôles par défaut
INSERT INTO public.roles (slug, name_fr, name_en, description_fr, description_en)
VALUES
  ('super_admin', 'Super Administrateur', 'Super Administrator', 'Accès complet à toutes les fonctionnalités', 'Full access to all features'),
  ('admin', 'Administrateur', 'Administrator', 'Gestion complète du système', 'Full system management'),
  ('editor', 'Éditeur', 'Editor', 'Peut créer et modifier du contenu', 'Can create and edit content'),
  ('viewer', 'Visualiseur', 'Viewer', 'Accès en lecture seule', 'Read-only access')
ON CONFLICT (slug) DO NOTHING;

