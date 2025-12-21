-- Script SQL pour créer un lead de test
-- Note: Le webhook sera déclenché automatiquement si vous créez le lead depuis le formulaire de contact
-- Ce script crée juste le lead en base pour tester

-- Insérer un lead de test
INSERT INTO public.leads (
  id,
  created_at,
  lang,
  name,
  email,
  phone,
  company,
  message,
  solution,
  category_id,
  page,
  origin,
  status,
  utm_source,
  utm_medium,
  utm_campaign
) VALUES (
  gen_random_uuid(),
  NOW(),
  'fr',
  'Lead Test Webhook',
  'lead.test.webhook@example.com',
  '0623456789',
  'Entreprise Test Lead',
  'Ceci est un message de test pour vérifier le webhook Make.com lors de la création d''un nouveau lead.',
  'lighting',
  NULL,
  '/fr/contact',
  'contact_page_form',
  'new',
  'test',
  'webhook',
  'test_webhook_campaign'
)
RETURNING 
  id,
  name,
  email,
  phone,
  company,
  status,
  created_at;

-- Note: Pour déclencher le webhook, soumettez le formulaire de contact sur le site public
-- Le webhook sera automatiquement envoyé lors de la création via submitContactLead()

