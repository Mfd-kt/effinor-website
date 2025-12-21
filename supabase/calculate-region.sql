-- Script pour créer la fonction de calcul de la région
-- et le trigger automatique

-- 1. Fonction de calcul de la région
CREATE OR REPLACE FUNCTION calculate_region(postcode TEXT)
RETURNS TEXT AS $$
DECLARE
  raw_code TEXT;
  code_dept TEXT;
  region TEXT;
BEGIN
  -- Si le code postal est NULL ou vide, retourner NULL
  IF postcode IS NULL OR TRIM(postcode) = '' THEN
    RETURN NULL;
  END IF;

  -- Supprimer tous les espaces (y compris insécables)
  raw_code := REGEXP_REPLACE(postcode, '\s', '', 'g');

  -- Si aucun chiffre trouvé, retourner "Code postal à remplir"
  IF raw_code = '' THEN
    RETURN 'Code postal à remplir';
  END IF;

  -- Vérifier que le code ne contient que 4 ou 5 chiffres
  IF NOT raw_code ~ '^\d{4,5}$' THEN
    RETURN 'Erreur de format';
  END IF;

  -- Ajouter un 0 devant si code à 4 chiffres
  IF LENGTH(raw_code) = 4 THEN
    raw_code := '0' || raw_code;
  END IF;

  -- Extraire les 2 premiers chiffres (code département)
  code_dept := LEFT(raw_code, 2);

  -- Déterminer la région selon le code département
  CASE code_dept
    -- Auvergne-Rhône-Alpes
    WHEN '01' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '03' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '07' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '15' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '26' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '38' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '42' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '43' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '63' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '69' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '73' THEN region := 'Auvergne-Rhône-Alpes';
    WHEN '74' THEN region := 'Auvergne-Rhône-Alpes';
    
    -- Hauts-de-France
    WHEN '02' THEN region := 'Hauts-de-France';
    WHEN '59' THEN region := 'Hauts-de-France';
    WHEN '60' THEN region := 'Hauts-de-France';
    WHEN '62' THEN region := 'Hauts-de-France';
    WHEN '80' THEN region := 'Hauts-de-France';
    
    -- Provence-Alpes-Côte d'Azur
    WHEN '04' THEN region := 'Provence-Alpes-Côte d''Azur';
    WHEN '05' THEN region := 'Provence-Alpes-Côte d''Azur';
    WHEN '06' THEN region := 'Provence-Alpes-Côte d''Azur';
    WHEN '13' THEN region := 'Provence-Alpes-Côte d''Azur';
    WHEN '83' THEN region := 'Provence-Alpes-Côte d''Azur';
    WHEN '84' THEN region := 'Provence-Alpes-Côte d''Azur';
    
    -- Grand Est
    WHEN '08' THEN region := 'Grand Est';
    WHEN '10' THEN region := 'Grand Est';
    WHEN '51' THEN region := 'Grand Est';
    WHEN '52' THEN region := 'Grand Est';
    WHEN '54' THEN region := 'Grand Est';
    WHEN '55' THEN region := 'Grand Est';
    WHEN '57' THEN region := 'Grand Est';
    WHEN '67' THEN region := 'Grand Est';
    WHEN '68' THEN region := 'Grand Est';
    WHEN '88' THEN region := 'Grand Est';
    
    -- Occitanie
    WHEN '09' THEN region := 'Occitanie';
    WHEN '11' THEN region := 'Occitanie';
    WHEN '12' THEN region := 'Occitanie';
    WHEN '30' THEN region := 'Occitanie';
    WHEN '31' THEN region := 'Occitanie';
    WHEN '32' THEN region := 'Occitanie';
    WHEN '34' THEN region := 'Occitanie';
    WHEN '46' THEN region := 'Occitanie';
    WHEN '48' THEN region := 'Occitanie';
    WHEN '65' THEN region := 'Occitanie';
    WHEN '66' THEN region := 'Occitanie';
    WHEN '81' THEN region := 'Occitanie';
    WHEN '82' THEN region := 'Occitanie';
    
    -- Normandie
    WHEN '14' THEN region := 'Normandie';
    WHEN '27' THEN region := 'Normandie';
    WHEN '50' THEN region := 'Normandie';
    WHEN '61' THEN region := 'Normandie';
    WHEN '76' THEN region := 'Normandie';
    
    -- Nouvelle-Aquitaine
    WHEN '16' THEN region := 'Nouvelle-Aquitaine';
    WHEN '17' THEN region := 'Nouvelle-Aquitaine';
    WHEN '19' THEN region := 'Nouvelle-Aquitaine';
    WHEN '23' THEN region := 'Nouvelle-Aquitaine';
    WHEN '24' THEN region := 'Nouvelle-Aquitaine';
    WHEN '33' THEN region := 'Nouvelle-Aquitaine';
    WHEN '40' THEN region := 'Nouvelle-Aquitaine';
    WHEN '47' THEN region := 'Nouvelle-Aquitaine';
    WHEN '64' THEN region := 'Nouvelle-Aquitaine';
    WHEN '79' THEN region := 'Nouvelle-Aquitaine';
    WHEN '86' THEN region := 'Nouvelle-Aquitaine';
    WHEN '87' THEN region := 'Nouvelle-Aquitaine';
    
    -- Centre-Val de Loire
    WHEN '18' THEN region := 'Centre-Val de Loire';
    WHEN '28' THEN region := 'Centre-Val de Loire';
    WHEN '36' THEN region := 'Centre-Val de Loire';
    WHEN '37' THEN region := 'Centre-Val de Loire';
    WHEN '41' THEN region := 'Centre-Val de Loire';
    WHEN '45' THEN region := 'Centre-Val de Loire';
    
    -- Bourgogne-Franche-Comté
    WHEN '21' THEN region := 'Bourgogne-Franche-Comté';
    WHEN '25' THEN region := 'Bourgogne-Franche-Comté';
    WHEN '39' THEN region := 'Bourgogne-Franche-Comté';
    WHEN '58' THEN region := 'Bourgogne-Franche-Comté';
    WHEN '70' THEN region := 'Bourgogne-Franche-Comté';
    WHEN '71' THEN region := 'Bourgogne-Franche-Comté';
    WHEN '89' THEN region := 'Bourgogne-Franche-Comté';
    WHEN '90' THEN region := 'Bourgogne-Franche-Comté';
    
    -- Bretagne
    WHEN '22' THEN region := 'Bretagne';
    WHEN '29' THEN region := 'Bretagne';
    WHEN '35' THEN region := 'Bretagne';
    WHEN '56' THEN region := 'Bretagne';
    
    -- Pays de la Loire
    WHEN '44' THEN region := 'Pays de la Loire';
    WHEN '49' THEN region := 'Pays de la Loire';
    WHEN '53' THEN region := 'Pays de la Loire';
    WHEN '72' THEN region := 'Pays de la Loire';
    WHEN '85' THEN region := 'Pays de la Loire';
    
    -- Île-de-France
    WHEN '75' THEN region := 'Île-de-France';
    WHEN '77' THEN region := 'Île-de-France';
    WHEN '78' THEN region := 'Île-de-France';
    WHEN '91' THEN region := 'Île-de-France';
    WHEN '92' THEN region := 'Île-de-France';
    WHEN '93' THEN region := 'Île-de-France';
    WHEN '94' THEN region := 'Île-de-France';
    WHEN '95' THEN region := 'Île-de-France';
    
    -- Par défaut, région inconnue
    ELSE region := 'Région inconnue';
  END CASE;

  RETURN region;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, retourner "Région inconnue"
    RETURN 'Région inconnue';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Commentaire pour documentation
COMMENT ON FUNCTION calculate_region(TEXT) IS 'Calcule la région française à partir du code postal des travaux';

-- 2. Fonction trigger pour mettre à jour automatiquement la région
CREATE OR REPLACE FUNCTION update_region_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Si work_postcode est modifié et non vide, calculer la région
  IF NEW.work_postcode IS NOT NULL AND TRIM(NEW.work_postcode) != '' THEN
    -- Si la région n'est pas déjà définie manuellement, la calculer automatiquement
    IF NEW.work_region IS NULL OR TRIM(NEW.work_region) = '' THEN
      NEW.work_region := calculate_region(NEW.work_postcode);
    -- Si le code postal a changé, recalculer même si la région était déjà définie
    ELSIF OLD.work_postcode IS DISTINCT FROM NEW.work_postcode THEN
      NEW.work_region := calculate_region(NEW.work_postcode);
    END IF;
  -- Si le code postal est supprimé, supprimer aussi la région
  ELSIF NEW.work_postcode IS NULL OR TRIM(NEW.work_postcode) = '' THEN
    NEW.work_region := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Créer le trigger
DROP TRIGGER IF EXISTS update_region_on_postcode_change ON public.leads;

CREATE TRIGGER update_region_on_postcode_change
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_region_trigger();

-- Commentaire pour documentation
COMMENT ON FUNCTION update_region_trigger() IS 'Fonction trigger qui met à jour automatiquement la région quand le code postal des travaux change';
COMMENT ON TRIGGER update_region_on_postcode_change ON public.leads IS 'Trigger qui calcule automatiquement la région à partir du code postal des travaux';

-- 4. Mettre à jour les régions existantes
UPDATE public.leads
SET work_region = calculate_region(work_postcode)
WHERE work_postcode IS NOT NULL 
  AND TRIM(work_postcode) != ''
  AND (work_region IS NULL OR work_region = '');

