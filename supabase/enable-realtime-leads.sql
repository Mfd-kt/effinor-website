-- ============================================
-- Activer Realtime pour la table leads
-- ============================================
-- Ce script ajoute la table 'leads' à la publication Supabase Realtime
-- pour permettre les mises à jour en temps réel dans le Dashboard
--
-- Instructions :
-- 1. Ouvrez le SQL Editor dans votre projet Supabase
-- 2. Collez ce script
-- 3. Exécutez-le
-- ============================================

-- Méthode 1 : Ajout simple (peut échouer si déjà présent)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- Méthode 2 : Ajout avec vérification (recommandé)
DO $$
BEGIN
  -- Vérifier si la table est déjà dans la publication
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public'
    AND tablename = 'leads'
  ) THEN
    -- Ajouter la table à la publication
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
    RAISE NOTICE '✅ La table leads a été ajoutée à la publication supabase_realtime';
  ELSE
    RAISE NOTICE 'ℹ️  La table leads est déjà dans la publication supabase_realtime';
  END IF;
END $$;

-- Vérifier que la réplication est bien activée
SELECT 
  schemaname,
  tablename,
  pubname,
  '✅ Realtime activé' as status
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND schemaname = 'public'
  AND tablename = 'leads';

-- Si aucun résultat, Realtime n'est pas activé
-- Si un résultat est retourné, Realtime est activé ✅