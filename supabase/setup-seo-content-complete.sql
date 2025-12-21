-- Script complet pour créer/mettre à jour la table seo_content avec support multilingue
-- Exécutez ce script AVANT init-seo-content.sql

-- 1. Créer la table si elle n'existe pas (avec support multilingue)
CREATE TABLE IF NOT EXISTS public.seo_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'fr' CHECK (lang IN ('fr', 'en', 'ar')),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(slug, lang)
);

-- 2. Créer les index
CREATE INDEX IF NOT EXISTS idx_seo_content_slug ON public.seo_content(slug);
CREATE INDEX IF NOT EXISTS idx_seo_content_lang ON public.seo_content(lang);
CREATE INDEX IF NOT EXISTS idx_seo_content_slug_lang ON public.seo_content(slug, lang);

-- 3. Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_seo_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_seo_content_updated_at_trigger ON public.seo_content;

CREATE TRIGGER update_seo_content_updated_at_trigger
  BEFORE UPDATE ON public.seo_content
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_content_updated_at();

-- 4. Activer RLS
ALTER TABLE public.seo_content ENABLE ROW LEVEL SECURITY;

-- 5. Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Public read access for seo_content" ON public.seo_content;
DROP POLICY IF EXISTS "Authenticated users can insert seo_content" ON public.seo_content;
DROP POLICY IF EXISTS "Authenticated users can update seo_content" ON public.seo_content;
DROP POLICY IF EXISTS "Authenticated users can delete seo_content" ON public.seo_content;

-- 6. Créer les politiques RLS
CREATE POLICY "Public read access for seo_content"
ON public.seo_content FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert seo_content"
ON public.seo_content FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update seo_content"
ON public.seo_content FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete seo_content"
ON public.seo_content FOR DELETE
TO authenticated
USING (true);

-- 7. Migration : Si la table existe déjà sans la colonne lang, l'ajouter
DO $$ 
BEGIN
  -- Vérifier si la colonne lang existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'seo_content' 
    AND column_name = 'lang'
  ) THEN
    -- Ajouter la colonne lang avec valeur par défaut (sans NOT NULL d'abord)
    ALTER TABLE public.seo_content ADD COLUMN lang TEXT DEFAULT 'fr';
    
    -- Mettre à jour tous les enregistrements existants
    UPDATE public.seo_content SET lang = 'fr' WHERE lang IS NULL;
    
    -- Rendre la colonne NOT NULL après avoir mis à jour les valeurs
    ALTER TABLE public.seo_content ALTER COLUMN lang SET NOT NULL;
    
    -- Ajouter la contrainte CHECK
    ALTER TABLE public.seo_content 
    ADD CONSTRAINT seo_content_lang_check CHECK (lang IN ('fr', 'en', 'ar'));

    -- Supprimer l'ancienne contrainte UNIQUE sur slug si elle existe
    IF EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'seo_content_slug_key'
    ) THEN
      ALTER TABLE public.seo_content DROP CONSTRAINT seo_content_slug_key;
    END IF;

    -- Créer la nouvelle contrainte UNIQUE sur (slug, lang)
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'seo_content_slug_lang_key'
    ) THEN
      ALTER TABLE public.seo_content ADD CONSTRAINT seo_content_slug_lang_key UNIQUE (slug, lang);
    END IF;
  END IF;
END $$;

-- 8. Ajouter les commentaires
COMMENT ON TABLE public.seo_content IS 'Table pour stocker le contenu SEO des pages statiques (Mentions légales, CGV, etc.)';
COMMENT ON COLUMN public.seo_content.slug IS 'Identifiant unique de la page (ex: mentions-legales, cgv)';
COMMENT ON COLUMN public.seo_content.lang IS 'Code langue : fr (français), en (anglais), ar (arabe)';
COMMENT ON COLUMN public.seo_content.content IS 'Contenu HTML/markdown de la page';
COMMENT ON COLUMN public.seo_content.meta_title IS 'Titre SEO pour les balises meta';
COMMENT ON COLUMN public.seo_content.meta_description IS 'Description SEO pour les balises meta';
COMMENT ON COLUMN public.seo_content.meta_keywords IS 'Mots-clés SEO pour les balises meta';