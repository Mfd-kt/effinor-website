-- Script pour vérifier l'ordre exact des colonnes dans la table leads
-- Exécutez ce script pour voir l'ordre réel des colonnes dans votre base de données

SELECT 
  column_name,
  data_type,
  ordinal_position,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'leads' 
ORDER BY ordinal_position;

-- Cette requête vous montrera l'ordre exact des colonnes
-- Utilisez cet ordre pour votre INSERT

