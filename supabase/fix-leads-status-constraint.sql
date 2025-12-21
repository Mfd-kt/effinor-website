-- Script pour corriger la contrainte CHECK sur leads.status
-- Ce script ajoute 'contacted' aux valeurs autorisées si elle n'est pas déjà présente

-- Étape 1: Supprimer l'ancienne contrainte
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;

-- Étape 2: Créer la nouvelle contrainte avec toutes les valeurs valides
-- Valeurs autorisées selon le schéma: 'new', 'contacted', 'qualified', 'converted', 'archived'
ALTER TABLE public.leads 
ADD CONSTRAINT leads_status_check 
CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived'));

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

