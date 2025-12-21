-- Script pour vérifier la contrainte CHECK sur leads.status

-- Option A: Vérifier la définition de la contrainte CHECK
SELECT 
  c.conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_class t ON t.oid = c.conrelid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE t.relname = 'leads' 
  AND c.conname = 'leads_status_check'
  AND n.nspname = 'public';

-- Option B: Vérifier si c'est un ENUM
SELECT 
  t.typname AS enum_type, 
  string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS allowed_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace 
WHERE t.typname LIKE '%status%' OR t.typname LIKE '%lead%'
GROUP BY t.typname;

