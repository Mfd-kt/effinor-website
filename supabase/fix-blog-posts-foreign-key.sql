-- Script de correction pour supprimer la contrainte de clé étrangère author_id
-- À exécuter si la table blog_posts existe déjà avec la contrainte

-- Supprimer la contrainte de clé étrangère author_id si elle existe
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'blog_posts_author_fkey' 
    AND table_name = 'blog_posts'
  ) THEN
    ALTER TABLE public.blog_posts DROP CONSTRAINT blog_posts_author_fkey;
    RAISE NOTICE 'Contrainte blog_posts_author_fkey supprimée';
  ELSE
    RAISE NOTICE 'La contrainte blog_posts_author_fkey n''existe pas';
  END IF;
END $$;

