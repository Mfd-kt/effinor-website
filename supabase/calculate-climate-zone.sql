-- Script pour créer la fonction de calcul de la zone climatique
-- et le trigger automatique

-- 1. Fonction de calcul de la zone climatique
CREATE OR REPLACE FUNCTION calculate_climate_zone(postcode TEXT)
RETURNS TEXT AS $$
DECLARE
  dept_code TEXT;
  dept_num INTEGER;
BEGIN
  -- Si le code postal est NULL ou vide, retourner NULL
  IF postcode IS NULL OR TRIM(postcode) = '' THEN
    RETURN NULL;
  END IF;

  -- Extraire uniquement les chiffres du code postal
  dept_code := REGEXP_REPLACE(postcode, '[^0-9]', '', 'g');
  
  -- Si aucun chiffre trouvé, retourner "Zone inconnue"
  IF dept_code = '' THEN
    RETURN 'Zone inconnue';
  END IF;

  -- Déterminer le code département
  -- Pour les départements 97 et 98 (DOM-TOM), prendre les 3 premiers chiffres
  IF LEFT(dept_code, 2) = '97' OR LEFT(dept_code, 2) = '98' THEN
    dept_code := LEFT(dept_code, 3);
  ELSE
    -- Pour les autres départements, prendre les 2 premiers chiffres
    dept_code := LEFT(dept_code, 2);
  END IF;

  -- Convertir en nombre pour la comparaison
  dept_num := dept_code::INTEGER;

  -- Zone H1
  IF dept_num IN (1, 2, 3, 5, 8, 10, 14, 15, 19, 21, 23, 25, 27, 28, 38, 39, 42, 43, 45, 51, 52, 54, 55, 57, 58, 59, 60, 61, 62, 63, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77, 78, 80, 87, 88, 89, 90, 91, 92, 93, 94, 95, 975) THEN
    RETURN 'H1';
  END IF;

  -- Zone H2
  IF dept_num IN (4, 7, 9, 12, 16, 17, 18, 22, 24, 26, 29, 31, 32, 33, 35, 36, 37, 40, 41, 44, 46, 47, 48, 49, 50, 53, 56, 64, 65, 72, 79, 81, 82, 84, 85, 86) THEN
    RETURN 'H2';
  END IF;

  -- Zone H3
  IF dept_num IN (6, 11, 13, 20, 30, 34, 66, 83, 971, 972, 973, 974, 976) THEN
    RETURN 'H3';
  END IF;

  -- Si aucun match, retourner "Zone inconnue"
  RETURN 'Zone inconnue';
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur (par exemple, conversion en INTEGER échoue), retourner "Zone inconnue"
    RETURN 'Zone inconnue';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Commentaire pour documentation
COMMENT ON FUNCTION calculate_climate_zone(TEXT) IS 'Calcule la zone climatique (H1, H2, H3) à partir du code postal des travaux';

-- 2. Fonction trigger pour mettre à jour automatiquement la zone climatique
CREATE OR REPLACE FUNCTION update_climate_zone_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Si work_postcode est modifié et non vide, calculer la zone climatique
  -- Ne mettre à jour que si work_climate_zone est NULL ou vide (pour permettre la modification manuelle)
  IF NEW.work_postcode IS NOT NULL AND TRIM(NEW.work_postcode) != '' THEN
    -- Si la zone n'est pas déjà définie manuellement, la calculer automatiquement
    IF NEW.work_climate_zone IS NULL OR TRIM(NEW.work_climate_zone) = '' THEN
      NEW.work_climate_zone := calculate_climate_zone(NEW.work_postcode);
    -- Si le code postal a changé, recalculer même si la zone était déjà définie
    ELSIF OLD.work_postcode IS DISTINCT FROM NEW.work_postcode THEN
      NEW.work_climate_zone := calculate_climate_zone(NEW.work_postcode);
    END IF;
  -- Si le code postal est supprimé, supprimer aussi la zone
  ELSIF NEW.work_postcode IS NULL OR TRIM(NEW.work_postcode) = '' THEN
    NEW.work_climate_zone := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Créer le trigger
DROP TRIGGER IF EXISTS update_climate_zone_on_postcode_change ON public.leads;

CREATE TRIGGER update_climate_zone_on_postcode_change
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_climate_zone_trigger();

-- Commentaire pour documentation
COMMENT ON FUNCTION update_climate_zone_trigger() IS 'Fonction trigger qui met à jour automatiquement la zone climatique quand le code postal des travaux change';
COMMENT ON TRIGGER update_climate_zone_on_postcode_change ON public.leads IS 'Trigger qui calcule automatiquement la zone climatique à partir du code postal des travaux';

-- 4. Mettre à jour les zones climatiques existantes
UPDATE public.leads
SET work_climate_zone = calculate_climate_zone(work_postcode)
WHERE work_postcode IS NOT NULL 
  AND TRIM(work_postcode) != ''
  AND (work_climate_zone IS NULL OR work_climate_zone = '');