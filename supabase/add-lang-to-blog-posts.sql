-- Script pour ajouter la colonne lang à la table blog_posts

-- Ajouter la colonne lang si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'lang'
  ) THEN
    ALTER TABLE public.blog_posts ADD COLUMN lang TEXT DEFAULT 'fr';
    -- Ajouter la contrainte CHECK
    ALTER TABLE public.blog_posts ADD CONSTRAINT blog_posts_lang_check CHECK (lang IN ('fr', 'en', 'ar'));
    -- Mettre à jour les enregistrements existants avec 'fr' par défaut
    UPDATE public.blog_posts SET lang = 'fr' WHERE lang IS NULL;
    -- Rendre NOT NULL après mise à jour
    ALTER TABLE public.blog_posts ALTER COLUMN lang SET NOT NULL;
    -- Rendre DEFAULT 'fr'
    ALTER TABLE public.blog_posts ALTER COLUMN lang SET DEFAULT 'fr';
  END IF;
END $$;

-- Créer un index sur la colonne lang pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_blog_posts_lang ON public.blog_posts(lang);

-- Commentaire pour documentation
COMMENT ON COLUMN public.blog_posts.lang IS 'Langue de l''article de blog (fr, en, ar)';