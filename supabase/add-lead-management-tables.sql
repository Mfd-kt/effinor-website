-- Script SQL pour créer les tables nécessaires aux fonctionnalités avancées de gestion des leads

-- Table pour l'historique des modifications (Audit Trail)
CREATE TABLE IF NOT EXISTS public.lead_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID,
  user_name VARCHAR(255),
  action VARCHAR(50) NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'status_changed', 'merged', 'note_added', 'email_sent', 'call_made')),
  field VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  description TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les tags personnalisés
CREATE TABLE IF NOT EXISTS public.lead_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  UNIQUE(lead_id, tag)
);

-- Table pour les rappels et tâches
CREATE TABLE IF NOT EXISTS public.lead_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les vues sauvegardées
CREATE TABLE IF NOT EXISTS public.saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name VARCHAR(255) NOT NULL,
  filters JSONB DEFAULT '{}',
  sort_by VARCHAR(100),
  sort_order VARCHAR(10) CHECK (sort_order IN ('asc', 'desc')),
  columns TEXT[],
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_lead_history_lead_id ON public.lead_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_history_timestamp ON public.lead_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_lead_history_action ON public.lead_history(action);

CREATE INDEX IF NOT EXISTS idx_lead_tags_lead_id ON public.lead_tags(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_tags_tag ON public.lead_tags(tag);

CREATE INDEX IF NOT EXISTS idx_lead_reminders_lead_id ON public.lead_reminders(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_reminders_due_date ON public.lead_reminders(due_date) WHERE completed = FALSE;
CREATE INDEX IF NOT EXISTS idx_lead_reminders_completed ON public.lead_reminders(completed);

CREATE INDEX IF NOT EXISTS idx_saved_views_user_id ON public.saved_views(user_id);

-- RLS Policies pour la sécurité
ALTER TABLE public.lead_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_views ENABLE ROW LEVEL SECURITY;

-- Policies pour lead_history (lecture publique, écriture authentifiée)
CREATE POLICY "Public read access for lead_history" ON public.lead_history
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert lead_history" ON public.lead_history
  FOR INSERT WITH CHECK (true);

-- Policies pour lead_tags
CREATE POLICY "Public read access for lead_tags" ON public.lead_tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage lead_tags" ON public.lead_tags
  FOR ALL USING (true);

-- Policies pour lead_reminders
CREATE POLICY "Public read access for lead_reminders" ON public.lead_reminders
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage lead_reminders" ON public.lead_reminders
  FOR ALL USING (true);

-- Policies pour saved_views
CREATE POLICY "Users can read their own saved_views" ON public.saved_views
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own saved_views" ON public.saved_views
  FOR ALL USING (true);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_saved_views_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_saved_views_updated_at
  BEFORE UPDATE ON public.saved_views
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_views_updated_at();

-- Fonction pour logger automatiquement les changements de statut
CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.lead_history (
      lead_id,
      action,
      field,
      old_value,
      new_value,
      description
    ) VALUES (
      NEW.id,
      'status_changed',
      'status',
      OLD.status,
      NEW.status,
      'Statut changé de ' || COALESCE(OLD.status, 'N/A') || ' à ' || COALESCE(NEW.status, 'N/A')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_status_change_trigger
  AFTER UPDATE OF status ON public.leads
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION log_lead_status_change();

