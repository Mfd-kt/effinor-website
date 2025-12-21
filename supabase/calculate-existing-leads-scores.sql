-- Script pour calculer et mettre à jour les scores de tous les leads existants

-- Mettre à jour le score de complétion pour tous les leads existants
UPDATE public.leads
SET completion_score = calculate_lead_completion_score(leads.*)
WHERE completion_score IS NULL OR completion_score = 0;

-- Afficher un résumé des scores
SELECT 
  COUNT(*) as total_leads,
  AVG(completion_score)::INTEGER as average_score,
  MIN(completion_score) as min_score,
  MAX(completion_score) as max_score,
  COUNT(*) FILTER (WHERE completion_score < 50) as low_score_count,
  COUNT(*) FILTER (WHERE completion_score >= 50 AND completion_score < 75) as medium_score_count,
  COUNT(*) FILTER (WHERE completion_score >= 75) as high_score_count
FROM public.leads;