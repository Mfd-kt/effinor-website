-- Script pour ajouter la colonne detailed_form_data à la table leads
-- Cette colonne stocke les données du formulaire multi-étapes détaillé

-- Ajouter la colonne detailed_form_data si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'detailed_form_data'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN detailed_form_data JSONB;
  END IF;
END $$;

-- Créer un index GIN pour améliorer les performances des requêtes JSON
CREATE INDEX IF NOT EXISTS idx_leads_detailed_form_data ON public.leads USING GIN (detailed_form_data);

-- Commentaire pour documentation
COMMENT ON COLUMN public.leads.detailed_form_data IS 'Données du formulaire multi-étapes détaillé (entreprise, contact, dépenses, bâtiments) au format JSON';

