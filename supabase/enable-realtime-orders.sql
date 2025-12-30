-- Activer Realtime pour la table orders
-- Ce script ajoute la table 'orders' à la publication Supabase Realtime

-- Vérifier si la publication existe
DO $$
BEGIN
  -- Ajouter la table orders à la publication supabase_realtime si elle n'y est pas déjà
  IF EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'orders'
  ) THEN
    RAISE NOTICE 'La table orders est déjà dans la publication supabase_realtime';
  ELSE
    -- Ajouter la table à la publication
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    RAISE NOTICE 'La table orders a été ajoutée à la publication supabase_realtime';
  END IF;
END $$;

-- Vérifier que la réplication est bien activée
SELECT 
  schemaname,
  tablename,
  pubname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename = 'orders';

