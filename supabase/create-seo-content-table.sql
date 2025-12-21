-- Script pour créer la table seo_content et configurer les permissions RLS

-- 1. Créer la table seo_content
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

-- 2. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_seo_content_slug ON public.seo_content(slug);
CREATE INDEX IF NOT EXISTS idx_seo_content_lang ON public.seo_content(lang);
CREATE INDEX IF NOT EXISTS idx_seo_content_slug_lang ON public.seo_content(slug, lang);

-- 3. Créer un trigger pour mettre à jour automatiquement updated_at
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

-- 4. Activer RLS (Row Level Security)
ALTER TABLE public.seo_content ENABLE ROW LEVEL SECURITY;

-- 5. Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Public read access for seo_content" ON public.seo_content;
DROP POLICY IF EXISTS "Authenticated users can insert seo_content" ON public.seo_content;
DROP POLICY IF EXISTS "Authenticated users can update seo_content" ON public.seo_content;
DROP POLICY IF EXISTS "Authenticated users can delete seo_content" ON public.seo_content;

-- 6. Politique RLS : Permettre la lecture publique (pour le site public)
CREATE POLICY "Public read access for seo_content"
ON public.seo_content FOR SELECT
TO public
USING (true);

-- 7. Politique RLS : Permettre l'insertion pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert seo_content"
ON public.seo_content FOR INSERT
TO authenticated
WITH CHECK (true);

-- 8. Politique RLS : Permettre la mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update seo_content"
ON public.seo_content FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 9. Politique RLS : Permettre la suppression pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete seo_content"
ON public.seo_content FOR DELETE
TO authenticated
USING (true);

-- 10. Commentaires pour documentation
COMMENT ON TABLE public.seo_content IS 'Table pour stocker le contenu SEO des pages statiques (Mentions légales, CGV, etc.)';
COMMENT ON COLUMN public.seo_content.slug IS 'Identifiant unique de la page (ex: mentions-legales, cgv)';
COMMENT ON COLUMN public.seo_content.lang IS 'Code langue : fr (français), en (anglais), ar (arabe)';
COMMENT ON COLUMN public.seo_content.content IS 'Contenu HTML/markdown de la page';
COMMENT ON COLUMN public.seo_content.meta_title IS 'Titre SEO pour les balises meta';
COMMENT ON COLUMN public.seo_content.meta_description IS 'Description SEO pour les balises meta';
COMMENT ON COLUMN public.seo_content.meta_keywords IS 'Mots-clés SEO pour les balises meta';