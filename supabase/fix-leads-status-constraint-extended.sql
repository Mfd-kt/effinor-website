-- Script pour corriger la contrainte CHECK sur leads.status
-- Ce script ajoute tous les statuts utilisés dans le code
-- Valeurs autorisées: 'new', 'contacted', 'qualified', 'converted', 'archived', 'in_progress', 'won', 'lost'

-- Étape 1: Supprimer l'ancienne contrainte
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;

-- Étape 2: Créer la nouvelle contrainte avec toutes les valeurs valides
ALTER TABLE public.leads 
ADD CONSTRAINT leads_status_check 
CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived', 'in_progress', 'won', 'lost'));

-- Vérification: Afficher la nouvelle contrainte
SELECT 
  c.conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_class t ON t.oid = c.conrelid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE t.relname = 'leads' 
  AND c.conname = 'leads_status_check'
  AND n.nspname = 'public';

-- Vérifier que la contrainte est bien appliquée
SELECT 
  '✅ Contrainte mise à jour avec succès' as status,
  'Statuts autorisés: new, contacted, qualified, converted, archived, in_progress, won, lost' as allowed_statuses;