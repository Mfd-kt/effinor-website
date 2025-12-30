-- Script de migration pour ajouter le support multilingue à la table seo_content
-- À exécuter si la table existe déjà sans le champ lang

-- 1. Ajouter la colonne lang si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'seo_content' AND column_name = 'lang'
  ) THEN
    ALTER TABLE public.seo_content ADD COLUMN lang TEXT NOT NULL DEFAULT 'fr' CHECK (lang IN ('fr', 'en', 'ar'));
  END IF;
END $$;

-- 2. Supprimer la contrainte UNIQUE sur slug si elle existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'seo_content_slug_key'
  ) THEN
    ALTER TABLE public.seo_content DROP CONSTRAINT seo_content_slug_key;
  END IF;
END $$;

-- 3. Créer la contrainte UNIQUE sur (slug, lang)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'seo_content_slug_lang_key'
  ) THEN
    ALTER TABLE public.seo_content ADD CONSTRAINT seo_content_slug_lang_key UNIQUE (slug, lang);
  END IF;
END $$;

-- 4. Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_seo_content_lang ON public.seo_content(lang);
CREATE INDEX IF NOT EXISTS idx_seo_content_slug_lang ON public.seo_content(slug, lang);

-- 5. Mettre à jour les enregistrements existants pour qu'ils aient lang = 'fr'
UPDATE public.seo_content SET lang = 'fr' WHERE lang IS NULL OR lang = '';

-- 6. Commentaire pour documentation
COMMENT ON COLUMN public.seo_content.lang IS 'Code langue : fr (français), en (anglais), ar (arabe)';



