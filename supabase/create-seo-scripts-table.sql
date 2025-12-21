-- Script pour créer la table seo_scripts et configurer les permissions RLS

-- 1. Créer la table seo_scripts
CREATE TABLE IF NOT EXISTS public.seo_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  script_code TEXT NOT NULL DEFAULT '',
  script_position TEXT NOT NULL DEFAULT 'head' CHECK (script_position IN ('head', 'body')),
  active BOOLEAN NOT NULL DEFAULT false,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_seo_scripts_name ON public.seo_scripts(name);
CREATE INDEX IF NOT EXISTS idx_seo_scripts_active ON public.seo_scripts(active);
CREATE INDEX IF NOT EXISTS idx_seo_scripts_position ON public.seo_scripts(script_position);
CREATE INDEX IF NOT EXISTS idx_seo_scripts_priority ON public.seo_scripts(priority);

-- 3. Créer un trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_seo_scripts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_seo_scripts_updated_at_trigger ON public.seo_scripts;

CREATE TRIGGER update_seo_scripts_updated_at_trigger
  BEFORE UPDATE ON public.seo_scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_scripts_updated_at();

-- 4. Activer RLS (Row Level Security)
ALTER TABLE public.seo_scripts ENABLE ROW LEVEL SECURITY;

-- 5. Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Public read access for seo_scripts" ON public.seo_scripts;
DROP POLICY IF EXISTS "Public read access for active seo_scripts" ON public.seo_scripts;
DROP POLICY IF EXISTS "Authenticated users can read all seo_scripts" ON public.seo_scripts;
DROP POLICY IF EXISTS "Authenticated users can insert seo_scripts" ON public.seo_scripts;
DROP POLICY IF EXISTS "Authenticated users can update seo_scripts" ON public.seo_scripts;
DROP POLICY IF EXISTS "Authenticated users can delete seo_scripts" ON public.seo_scripts;

-- 6. Politique RLS : Permettre la lecture publique (pour le site public - uniquement les scripts actifs)
CREATE POLICY "Public read access for active seo_scripts"
ON public.seo_scripts FOR SELECT
TO public
USING (active = true);

-- 7. Politique RLS : Permettre la lecture complète pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can read all seo_scripts"
ON public.seo_scripts FOR SELECT
TO authenticated
USING (true);

-- 8. Politique RLS : Permettre l'insertion pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert seo_scripts"
ON public.seo_scripts FOR INSERT
TO authenticated
WITH CHECK (true);

-- 9. Politique RLS : Permettre la mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update seo_scripts"
ON public.seo_scripts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 10. Politique RLS : Permettre la suppression pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete seo_scripts"
ON public.seo_scripts FOR DELETE
TO authenticated
USING (true);

-- 11. Commentaires pour documentation
COMMENT ON TABLE public.seo_scripts IS 'Table pour stocker les scripts de tracking et publicité (Meta Ads, Google Ads, etc.)';
COMMENT ON COLUMN public.seo_scripts.name IS 'Nom unique du script (ex: meta-ads, google-ads)';
COMMENT ON COLUMN public.seo_scripts.label IS 'Libellé affiché (ex: Meta Ads, Google Ads)';
COMMENT ON COLUMN public.seo_scripts.script_code IS 'Code JavaScript du script';
COMMENT ON COLUMN public.seo_scripts.script_position IS 'Position du script : head ou body';
COMMENT ON COLUMN public.seo_scripts.active IS 'Script actif ou non';
COMMENT ON COLUMN public.seo_scripts.priority IS 'Ordre d''exécution (plus petit = exécuté en premier)';

