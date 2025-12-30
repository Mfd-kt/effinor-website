-- Script pour ajouter les colonnes nécessaires pour le formulaire détaillé
-- Les données des étapes 1-4 seront stockées dans des colonnes séparées
-- Seule l'étape 5 (détails des bâtiments) sera dans detailed_form_data JSONB
-- 
-- NOTE: Ce script utilise les colonnes existantes quand elles existent déjà
-- et n'ajoute que les colonnes manquantes

-- Étape 1 : Informations entreprise
-- On utilise les colonnes existantes : headquarters_address, headquarters_city, headquarters_postcode, siret_number
-- Pas besoin d'ajouter de nouvelles colonnes pour l'étape 1

-- Étape 2 : Contact principal
-- On utilise les colonnes existantes : beneficiary_title, beneficiary_last_name, beneficiary_first_name, beneficiary_function
-- Les colonnes name, email, phone existent déjà
-- Pas besoin d'ajouter de nouvelles colonnes pour l'étape 2

-- Étape 3 : Dépenses énergétiques
-- Colonne à ajouter (nouvelle)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'annual_expense_range') THEN
    ALTER TABLE public.leads ADD COLUMN annual_expense_range TEXT CHECK (annual_expense_range IN ('less-than-10000', '10000-50000', '50000-100000', '100000-500000', 'more-than-500000'));
  END IF;
END $$;

-- Étape 4 : Configuration des bâtiments
-- Colonne à ajouter (nouvelle)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'building_count') THEN
    ALTER TABLE public.leads ADD COLUMN building_count INTEGER CHECK (building_count >= 1 AND building_count <= 10);
  END IF;
END $$;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_leads_annual_expense_range ON public.leads(annual_expense_range);
CREATE INDEX IF NOT EXISTS idx_leads_building_count ON public.leads(building_count);

-- Commentaires pour documentation
COMMENT ON COLUMN public.leads.annual_expense_range IS 'Tranche de dépenses énergétiques annuelles (étape 3 du formulaire détaillé)';
COMMENT ON COLUMN public.leads.building_count IS 'Nombre de bâtiments à analyser (1-10) (étape 4 du formulaire détaillé)';
COMMENT ON COLUMN public.leads.detailed_form_data IS 'Détails des bâtiments (étape 5) au format JSON';

-- Mapping des colonnes existantes pour le formulaire détaillé :
-- Étape 1 (Informations entreprise) :
--   - companyName -> company (existe déjà)
--   - siret -> siret_number (existe déjà)
--   - address -> headquarters_address (existe déjà)
--   - postalCode -> headquarters_postcode (existe déjà)
--   - city -> headquarters_city (existe déjà)
--
-- Étape 2 (Contact principal) :
--   - title -> beneficiary_title (existe déjà)
--   - lastName -> beneficiary_last_name (existe déjà)
--   - firstName -> beneficiary_first_name (existe déjà)
--   - function -> beneficiary_function (existe déjà)
--   - phone -> phone (existe déjà)
--   - email -> email (existe déjà)
--   - name -> name (existe déjà, sera mis à jour avec firstName + lastName)
