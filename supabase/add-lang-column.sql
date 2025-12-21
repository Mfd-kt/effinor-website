-- Script simple pour ajouter la colonne lang à la table seo_content existante
-- Exécutez ce script si la table existe déjà sans la colonne lang

-- 1. Ajouter la colonne lang si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'seo_content' 
    AND column_name = 'lang'
  ) THEN
    -- Ajouter la colonne lang avec valeur par défaut
    ALTER TABLE public.seo_content 
    ADD COLUMN lang TEXT DEFAULT 'fr';
    
    -- Mettre à jour tous les enregistrements existants
    UPDATE public.seo_content SET lang = 'fr' WHERE lang IS NULL;
    
    -- Rendre la colonne NOT NULL après avoir mis à jour les valeurs
    ALTER TABLE public.seo_content 
    ALTER COLUMN lang SET NOT NULL;
    
    -- Ajouter la contrainte CHECK
    ALTER TABLE public.seo_content 
    ADD CONSTRAINT seo_content_lang_check CHECK (lang IN ('fr', 'en', 'ar'));
  END IF;
END $$;

-- 2. Supprimer l'ancienne contrainte UNIQUE sur slug si elle existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'seo_content_slug_key'
  ) THEN
    ALTER TABLE public.seo_content DROP CONSTRAINT seo_content_slug_key;
  END IF;
END $$;

-- 3. Créer la nouvelle contrainte UNIQUE sur (slug, lang)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'seo_content_slug_lang_key'
  ) THEN
    ALTER TABLE public.seo_content 
    ADD CONSTRAINT seo_content_slug_lang_key UNIQUE (slug, lang);
  END IF;
END $$;

-- 4. Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_seo_content_lang ON public.seo_content(lang);
CREATE INDEX IF NOT EXISTS idx_seo_content_slug_lang ON public.seo_content(slug, lang);

-- 5. Ajouter le commentaire pour la colonne lang
COMMENT ON COLUMN public.seo_content.lang IS 'Code langue : fr (français), en (anglais), ar (arabe)';

