-- Script pour corriger le calcul du score de complétion
-- Le score doit être calculé en pourcentage (0-100) basé sur le score maximum possible

-- Fonction de calcul du score de complétion (corrigée)
CREATE OR REPLACE FUNCTION calculate_lead_completion_score(lead_record public.leads)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  max_score INTEGER := 170; -- Score maximum possible (voir calcul ci-dessous)
  -- Essentiels (10 pts): email, phone, name = 30 pts
  -- Importants (8 pts): beneficiary_email, beneficiary_phone, beneficiary_first_name, beneficiary_last_name, 
  --                     work_address, work_city, work_postcode = 7 * 8 = 56 pts
  -- Secondaires (5 pts): company, headquarters_address, headquarters_city, headquarters_postcode, 
  --                      work_company_name, work_region, work_climate_zone, beneficiary_title, 
  --                      beneficiary_function, beneficiary_landline, cadastral_parcel, surface_m2 = 12 * 5 = 60 pts
  -- Optionnels (3 pts): siret_number, siren_number, work_siret, qualification_score, 
  --                    exterior_photo_url, cadastral_photo_url, message, category_id = 8 * 3 = 24 pts
  -- Total = 30 + 56 + 60 + 24 = 170 points
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
  
  -- Convertir le score brut en pourcentage (0-100)
  -- score_percentage = (score / max_score) * 100
  IF max_score > 0 THEN
    score := ROUND((score::NUMERIC / max_score::NUMERIC) * 100);
  ELSE
    score := 0;
  END IF;
  
  -- S'assurer que le score est entre 0 et 100
  IF score < 0 THEN
    score := 0;
  ELSIF score > 100 THEN
    score := 100;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Mettre à jour tous les scores existants
UPDATE public.leads
SET completion_score = calculate_lead_completion_score(leads.*)
WHERE completion_score IS NULL OR completion_score != calculate_lead_completion_score(leads.*);

-- Commentaire pour documentation
COMMENT ON FUNCTION calculate_lead_completion_score(public.leads) IS 'Calcule le score de complétion d''un lead en pourcentage (0-100) basé sur les champs remplis avec pondération. Score max = 170 points.';

