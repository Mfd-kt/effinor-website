-- Script pour ajouter la colonne building_type à la table leads
-- Cette colonne stocke le type de bâtiment sélectionné dans le formulaire

-- Ajouter la colonne building_type si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'building_type'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN building_type TEXT;
  END IF;
END $$;

-- Ajouter un index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_leads_building_type ON public.leads(building_type);

-- Commentaire pour documentation
COMMENT ON COLUMN public.leads.building_type IS 'Type de bâtiment sélectionné dans le formulaire (entrepot-logistique, bureau, usine-production, commerce-retail, autre-batiment)';

