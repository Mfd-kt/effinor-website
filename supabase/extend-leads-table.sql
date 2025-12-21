-- Script pour étendre la table leads avec tous les champs nécessaires
-- pour les projets de travaux énergétiques

-- Section Siège Social
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'headquarters_address') THEN
    ALTER TABLE public.leads ADD COLUMN headquarters_address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'headquarters_city') THEN
    ALTER TABLE public.leads ADD COLUMN headquarters_city TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'headquarters_postcode') THEN
    ALTER TABLE public.leads ADD COLUMN headquarters_postcode TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'siret_number') THEN
    ALTER TABLE public.leads ADD COLUMN siret_number TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'siren_number') THEN
    ALTER TABLE public.leads ADD COLUMN siren_number TEXT;
  END IF;
END $$;

-- Section Adresse des travaux
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'work_company_name') THEN
    ALTER TABLE public.leads ADD COLUMN work_company_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'work_address') THEN
    ALTER TABLE public.leads ADD COLUMN work_address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'work_city') THEN
    ALTER TABLE public.leads ADD COLUMN work_city TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'work_postcode') THEN
    ALTER TABLE public.leads ADD COLUMN work_postcode TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'work_siret') THEN
    ALTER TABLE public.leads ADD COLUMN work_siret TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'work_region') THEN
    ALTER TABLE public.leads ADD COLUMN work_region TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'work_climate_zone') THEN
    ALTER TABLE public.leads ADD COLUMN work_climate_zone TEXT;
  END IF;
END $$;

-- Section Bénéficiaire
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'beneficiary_title') THEN
    ALTER TABLE public.leads ADD COLUMN beneficiary_title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'beneficiary_last_name') THEN
    ALTER TABLE public.leads ADD COLUMN beneficiary_last_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'beneficiary_first_name') THEN
    ALTER TABLE public.leads ADD COLUMN beneficiary_first_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'beneficiary_function') THEN
    ALTER TABLE public.leads ADD COLUMN beneficiary_function TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'beneficiary_phone') THEN
    ALTER TABLE public.leads ADD COLUMN beneficiary_phone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'beneficiary_email') THEN
    ALTER TABLE public.leads ADD COLUMN beneficiary_email TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'beneficiary_landline') THEN
    ALTER TABLE public.leads ADD COLUMN beneficiary_landline TEXT;
  END IF;
END $$;

-- Section Cadastre
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'cadastral_parcel') THEN
    ALTER TABLE public.leads ADD COLUMN cadastral_parcel TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'qualification_score') THEN
    ALTER TABLE public.leads ADD COLUMN qualification_score INTEGER CHECK (qualification_score >= 0 AND qualification_score <= 10);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'surface_m2') THEN
    ALTER TABLE public.leads ADD COLUMN surface_m2 NUMERIC(10,2);
  END IF;
END $$;

-- Section Photos
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'exterior_photo_url') THEN
    ALTER TABLE public.leads ADD COLUMN exterior_photo_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'cadastral_photo_url') THEN
    ALTER TABLE public.leads ADD COLUMN cadastral_photo_url TEXT;
  END IF;
END $$;

-- Commentaires pour documentation
COMMENT ON COLUMN public.leads.headquarters_address IS 'Adresse du siège social';
COMMENT ON COLUMN public.leads.headquarters_city IS 'Ville du siège social';
COMMENT ON COLUMN public.leads.headquarters_postcode IS 'Code postal du siège social';
COMMENT ON COLUMN public.leads.siret_number IS 'Numéro SIRET du siège social';
COMMENT ON COLUMN public.leads.siren_number IS 'Numéro SIREN du siège social';
COMMENT ON COLUMN public.leads.work_company_name IS 'Raison sociale du site des travaux';
COMMENT ON COLUMN public.leads.work_address IS 'Adresse du site des travaux';
COMMENT ON COLUMN public.leads.work_city IS 'Ville du site des travaux';
COMMENT ON COLUMN public.leads.work_postcode IS 'Code postal du site des travaux';
COMMENT ON COLUMN public.leads.work_siret IS 'SIRET du site des travaux';
COMMENT ON COLUMN public.leads.work_region IS 'Région du site des travaux';
COMMENT ON COLUMN public.leads.work_climate_zone IS 'Zone climatique (H1, H2, H3)';
COMMENT ON COLUMN public.leads.beneficiary_title IS 'Civilité du bénéficiaire (M., Mme, Mlle)';
COMMENT ON COLUMN public.leads.beneficiary_last_name IS 'Nom du responsable bénéficiaire';
COMMENT ON COLUMN public.leads.beneficiary_first_name IS 'Prénom du responsable bénéficiaire';
COMMENT ON COLUMN public.leads.beneficiary_function IS 'Fonction du responsable bénéficiaire';
COMMENT ON COLUMN public.leads.beneficiary_phone IS 'Numéro de téléphone du responsable';
COMMENT ON COLUMN public.leads.beneficiary_email IS 'Email du responsable';
COMMENT ON COLUMN public.leads.beneficiary_landline IS 'Numéro de téléphone fixe du responsable';
COMMENT ON COLUMN public.leads.cadastral_parcel IS 'Référence de la parcelle cadastrale';
COMMENT ON COLUMN public.leads.qualification_score IS 'Score de qualification (0-10 étoiles)';
COMMENT ON COLUMN public.leads.surface_m2 IS 'Surface en mètres carrés';
COMMENT ON COLUMN public.leads.exterior_photo_url IS 'URL de la photo extérieure';
COMMENT ON COLUMN public.leads.cadastral_photo_url IS 'URL de la photo de la parcelle cadastrale';

