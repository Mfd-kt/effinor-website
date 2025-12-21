-- Script pour créer le trigger automatique qui met à jour le score
-- à chaque insertion ou modification d'un lead

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS update_lead_completion_score_trigger ON public.leads;

-- Créer la fonction trigger
CREATE OR REPLACE FUNCTION update_lead_completion_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculer et mettre à jour le score
  NEW.completion_score := calculate_lead_completion_score(NEW);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger qui se déclenche avant INSERT ou UPDATE
CREATE TRIGGER update_lead_completion_score_trigger
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_completion_score();

-- Commentaire pour documentation
COMMENT ON FUNCTION update_lead_completion_score() IS 'Fonction trigger qui met à jour automatiquement le score de complétion d''un lead';
COMMENT ON TRIGGER update_lead_completion_score_trigger ON public.leads IS 'Trigger qui met à jour le score de complétion à chaque modification d''un lead';

