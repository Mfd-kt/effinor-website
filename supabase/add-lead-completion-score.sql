-- Script pour ajouter la colonne completion_score à la table leads
-- et créer la fonction de calcul du score

-- 1. Ajouter la colonne completion_score
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'completion_score'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN completion_score INTEGER DEFAULT 0 CHECK (completion_score >= 0 AND completion_score <= 100);
  END IF;
END $$;

-- 2. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_leads_completion_score ON public.leads(completion_score DESC);

-- 3. Fonction de calcul du score de complétion
CREATE OR REPLACE FUNCTION calculate_lead_completion_score(lead_record public.leads)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Champs essentiels (10 points chacun)
  IF lead_record.email IS NOT NULL AND lead_record.email != '' THEN
    score := score + 10;
  END IF;
  
  IF lead_record.phone IS NOT NULL AND lead_record.phone != '' THEN
    score := score + 10;
  END IF;
  
  IF lead_record.name IS NOT NULL AND lead_record.name != '' THEN
    score := score + 10;
  END IF;
  
  -- Champs importants (8 points chacun)
  IF lead_record.beneficiary_email IS NOT NULL AND lead_record.beneficiary_email != '' THEN
    score := score + 8;
  END IF;
  
  IF lead_record.beneficiary_phone IS NOT NULL AND lead_record.beneficiary_phone != '' THEN
    score := score + 8;
  END IF;
  
  IF lead_record.beneficiary_first_name IS NOT NULL AND lead_record.beneficiary_first_name != '' THEN
    score := score + 8;
  END IF;
  
  IF lead_record.beneficiary_last_name IS NOT NULL AND lead_record.beneficiary_last_name != '' THEN
    score := score + 8;
  END IF;
  
  IF lead_record.work_address IS NOT NULL AND lead_record.work_address != '' THEN
    score := score + 8;
  END IF;
  
  IF lead_record.work_city IS NOT NULL AND lead_record.work_city != '' THEN
    score := score + 8;
  END IF;
  
  IF lead_record.work_postcode IS NOT NULL AND lead_record.work_postcode != '' THEN
    score := score + 8;
  END IF;
  
  -- Champs secondaires (5 points chacun)
  IF lead_record.company IS NOT NULL AND lead_record.company != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.headquarters_address IS NOT NULL AND lead_record.headquarters_address != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.headquarters_city IS NOT NULL AND lead_record.headquarters_city != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.headquarters_postcode IS NOT NULL AND lead_record.headquarters_postcode != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.work_company_name IS NOT NULL AND lead_record.work_company_name != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.work_region IS NOT NULL AND lead_record.work_region != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.work_climate_zone IS NOT NULL AND lead_record.work_climate_zone != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.beneficiary_title IS NOT NULL AND lead_record.beneficiary_title != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.beneficiary_function IS NOT NULL AND lead_record.beneficiary_function != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.beneficiary_landline IS NOT NULL AND lead_record.beneficiary_landline != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.cadastral_parcel IS NOT NULL AND lead_record.cadastral_parcel != '' THEN
    score := score + 5;
  END IF;
  
  IF lead_record.surface_m2 IS NOT NULL AND lead_record.surface_m2 > 0 THEN
    score := score + 5;
  END IF;
  
  -- Champs optionnels (3 points chacun)
  IF lead_record.siret_number IS NOT NULL AND lead_record.siret_number != '' THEN
    score := score + 3;
  END IF;
  
  IF lead_record.siren_number IS NOT NULL AND lead_record.siren_number != '' THEN
    score := score + 3;
  END IF;
  
  IF lead_record.work_siret IS NOT NULL AND lead_record.work_siret != '' THEN
    score := score + 3;
  END IF;
  
  IF lead_record.qualification_score IS NOT NULL AND lead_record.qualification_score > 0 THEN
    score := score + 3;
  END IF;
  
  IF lead_record.exterior_photo_url IS NOT NULL AND lead_record.exterior_photo_url != '' THEN
    score := score + 3;
  END IF;
  
  IF lead_record.cadastral_photo_url IS NOT NULL AND lead_record.cadastral_photo_url != '' THEN
    score := score + 3;
  END IF;
  
  IF lead_record.message IS NOT NULL AND lead_record.message != '' THEN
    score := score + 3;
  END IF;
  
  IF lead_record.category_id IS NOT NULL THEN
    score := score + 3;
  END IF;
  
  -- S'assurer que le score est entre 0 et 100
  IF score > 100 THEN
    score := 100;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Commentaire pour documentation
COMMENT ON COLUMN public.leads.completion_score IS 'Score de complétion du lead (0-100), calculé automatiquement basé sur les champs remplis';
COMMENT ON FUNCTION calculate_lead_completion_score(public.leads) IS 'Calcule le score de complétion d''un lead basé sur les champs remplis avec pondération';

