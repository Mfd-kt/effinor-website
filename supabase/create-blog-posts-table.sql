-- Création de la table blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  author_id UUID NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  category_id UUID,
  -- Note: author_id n'a pas de contrainte de clé étrangère pour permettre l'insertion
  -- même si l'utilisateur n'existe pas encore dans auth.users
  -- Vous pouvez ajouter une contrainte plus tard si nécessaire
  CONSTRAINT blog_posts_category_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL
);

-- Création d'un index sur le slug pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Création d'un index sur le statut pour filtrer les articles publiés
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);

-- Création d'un index sur la date de publication pour trier les articles
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Création d'un index sur la date de création
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

-- Création d'un index sur l'auteur
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);

-- Création d'un index sur la catégorie
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON public.blog_posts(category_id);

-- Activer Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent (pour éviter les erreurs)
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can read all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;

-- Politique RLS : Tout le monde peut lire les articles publiés
CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Politique RLS : Les utilisateurs authentifiés peuvent lire tous les articles (pour le dashboard)
CREATE POLICY "Authenticated users can read all blog posts"
  ON public.blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique RLS : Les utilisateurs authentifiés peuvent créer des articles
CREATE POLICY "Authenticated users can create blog posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique RLS : Les utilisateurs authentifiés peuvent modifier leurs propres articles ou tous les articles (selon vos besoins)
CREATE POLICY "Authenticated users can update blog posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politique RLS : Les utilisateurs authentifiés peuvent supprimer leurs propres articles ou tous les articles (selon vos besoins)
CREATE POLICY "Authenticated users can delete blog posts"
  ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

