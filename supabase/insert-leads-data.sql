-- Script pour insérer 20 leads de test dans la table leads
-- Basé sur la structure du fichier leads_rows.json

-- Étape 1: Ajouter la colonne internal_notes si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'internal_notes'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN internal_notes TEXT;
  END IF;
END $$;

-- Étape 2: La contrainte CHECK est déjà correcte et autorise 'contacted'
-- Pas besoin de la modifier

-- Vérifier et afficher la structure de la table pour debug
-- SELECT column_name, data_type, ordinal_position 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'leads' 
-- ORDER BY ordinal_position;

-- Insérer les leads en spécifiant explicitement toutes les colonnes
-- Ordre selon le schéma : id, created_at, lang, name, email, phone, company, message, solution, category_id, page, origin, status, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, internal_notes

INSERT INTO public.leads (
  id, created_at, lang, name, email, phone, company, message, solution, category_id, 
  page, origin, status, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, internal_notes
) VALUES
  (gen_random_uuid(), NOW() - INTERVAL '5 days', 'fr', 'Jean Dupont', 'jean.dupont@example.com', '0612345678', 'Dupont Industries', 'Bonjour, je suis intéressé par vos solutions d''éclairage LED pour notre entreprise.', 'lighting', NULL, '/fr/contact', 'contact_page_form', 'new', 'google', 'cpc', 'led_campaign', 'éclairage led', 'ad1', NULL, NULL, 'Client intéressé par LED, à contacter rapidement'),
  (gen_random_uuid(), NOW() - INTERVAL '4 days', 'fr', 'Marie Martin', 'marie.martin@techcorp.fr', '0623456789', 'TechCorp', 'Nous cherchons une solution de pompe à chaleur pour nos bureaux.', 'heating', NULL, '/fr/contact', 'contact_page_form', 'contacted', 'google', 'cpc', 'pac_campaign', 'pompe à chaleur', 'ad2', 'CjwKCAjw...', NULL, 'Devis demandé, en attente de réponse'),
  (gen_random_uuid(), NOW() - INTERVAL '3 days', 'fr', 'Pierre Bernard', 'p.bernard@manufacturing.com', '0634567890', 'Manufacturing SA', 'Besoin d''informations sur les certificats d''économies d''énergie.', 'cee', NULL, '/fr/contact', 'contact_page_form', 'qualified', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Qualifié pour CEE, envoyer documentation'),
  (gen_random_uuid(), NOW() - INTERVAL '2 days', 'en', 'John Smith', 'john.smith@international.com', '+33123456789', 'International Corp', 'We are looking for EV charging stations for our parking lot.', 'irve', NULL, '/en/contact', 'contact_page_form', 'new', 'linkedin', 'social', 'ev_charging', 'ev charging', 'linkedin_post', NULL, NULL, 'International client, English speaking'),
  (gen_random_uuid(), NOW() - INTERVAL '1 day', 'fr', 'Sophie Leroy', 'sophie.leroy@retail.fr', '0645678901', 'Retail Solutions', 'Intéressée par la destratification pour notre magasin.', 'destratification', NULL, '/fr/contact', 'contact_page_form', 'contacted', 'facebook', 'social', 'destrat_campaign', 'destratification', 'fb_ad', NULL, '1234567890.1234567890', 'Magasin de 500m², besoin urgent'),
  (gen_random_uuid(), NOW() - INTERVAL '12 hours', 'fr', 'Thomas Moreau', 't.moreau@logistics.fr', '0656789012', 'Logistics Pro', 'Demande de devis pour installation LED dans nos entrepôts.', 'lighting', NULL, '/fr/contact', 'contact_page_form', 'new', 'google', 'organic', NULL, 'éclairage entrepôt', NULL, NULL, NULL, 'Grand projet, 3 entrepôts à équiper'),
  (gen_random_uuid(), NOW() - INTERVAL '8 hours', 'fr', 'Camille Dubois', 'camille.dubois@hospital.fr', '0667890123', 'Hôpital Saint-Martin', 'Recherche solution de ventilation performante pour notre établissement.', 'ventilation', NULL, '/fr/contact', 'contact_page_form', 'qualified', NULL, 'direct', NULL, NULL, NULL, NULL, NULL, 'Secteur santé, normes strictes'),
  (gen_random_uuid(), NOW() - INTERVAL '6 hours', 'ar', 'أحمد الخالدي', 'ahmed.khaldi@middleeast.com', '+33123456789', 'Middle East Energy', 'نبحث عن حلول الطاقة المتجددة لمشروعنا الجديد', 'renewable', NULL, '/ar/contact', 'contact_page_form', 'new', 'google', 'cpc', 'arabic_campaign', 'طاقة متجددة', 'ad_ar', NULL, NULL, 'Client arabophone, projet important'),
  (gen_random_uuid(), NOW() - INTERVAL '4 hours', 'fr', 'Lucie Petit', 'lucie.petit@restaurant.fr', '0678901234', 'Le Bon Goût', 'Besoin d''éclairage LED pour notre restaurant.', 'lighting', NULL, '/fr/contact', 'contact_page_form', 'contacted', 'google', 'cpc', 'restaurant_led', 'éclairage restaurant', 'ad3', 'CjwKCAjw...', NULL, 'Restaurant, ambiance importante'),
  (gen_random_uuid(), NOW() - INTERVAL '3 hours', 'fr', 'Marc Rousseau', 'm.rousseau@factory.fr', '0689012345', 'Factory Plus', 'Demande d''information sur les pompes à chaleur industrielles.', 'heating', NULL, '/fr/contact', 'contact_page_form', 'qualified', 'linkedin', 'social', 'industrial_pac', 'pac industrielle', 'linkedin_ad', NULL, NULL, 'Industrie, gros volume'),
  (gen_random_uuid(), NOW() - INTERVAL '2 hours', 'en', 'Sarah Johnson', 'sarah.j@startup.io', '+33612345678', 'GreenTech Startup', 'We need EV charging infrastructure for our new office building.', 'irve', NULL, '/en/contact', 'contact_page_form', 'new', 'google', 'cpc', 'ev_office', 'ev charging office', 'ad4', NULL, NULL, 'Startup tech, building neuf'),
  (gen_random_uuid(), NOW() - INTERVAL '90 minutes', 'fr', 'Nicolas Blanc', 'nicolas.blanc@hotel.fr', '0690123456', 'Hôtel Le Palace', 'Intéressé par la destratification pour notre hôtel.', 'destratification', NULL, '/fr/contact', 'contact_page_form', 'contacted', 'facebook', 'social', 'hotel_destrat', 'destratification hôtel', 'fb_post', NULL, '9876543210.0987654321', 'Hôtel 4 étoiles, 200 chambres'),
  (gen_random_uuid(), NOW() - INTERVAL '1 hour', 'fr', 'Isabelle Roux', 'isabelle.roux@school.fr', '0601234567', 'École Primaire Victor Hugo', 'Recherche solution d''éclairage pour notre école.', 'lighting', NULL, '/fr/contact', 'contact_page_form', 'new', NULL, 'direct', NULL, NULL, NULL, NULL, NULL, 'École, budget public'),
  (gen_random_uuid(), NOW() - INTERVAL '45 minutes', 'fr', 'François Girard', 'f.girard@warehouse.fr', '0612345678', 'Warehouse Solutions', 'Besoin urgent de LED pour entrepôt, projet prioritaire.', 'lighting', NULL, '/fr/contact', 'contact_page_form', 'qualified', 'google', 'cpc', 'urgent_led', 'led urgent', 'ad5', 'CjwKCAjw...', NULL, 'URGENT - Projet prioritaire'),
  (gen_random_uuid(), NOW() - INTERVAL '30 minutes', 'fr', 'Émilie Laurent', 'emilie.laurent@pharmacy.fr', '0623456789', 'Pharmacie Centrale', 'Demande de devis pour ventilation pharmacie.', 'ventilation', NULL, '/fr/contact', 'contact_page_form', 'contacted', 'google', 'organic', NULL, 'ventilation pharmacie', NULL, NULL, NULL, 'Pharmacie, normes sanitaires'),
  (gen_random_uuid(), NOW() - INTERVAL '20 minutes', 'fr', 'David Mercier', 'david.mercier@gym.fr', '0634567890', 'Fitness Center', 'Intéressé par pompe à chaleur pour salle de sport.', 'heating', NULL, '/fr/contact', 'contact_page_form', 'new', 'facebook', 'social', 'gym_pac', 'pompe à chaleur salle sport', 'fb_ad2', NULL, '1112223333.4445556666', 'Salle de sport, besoin chauffage/rafraîchissement'),
  (gen_random_uuid(), NOW() - INTERVAL '15 minutes', 'en', 'Michael Brown', 'michael.brown@consulting.com', '+33623456789', 'Energy Consulting Ltd', 'Looking for energy efficiency solutions for our consulting firm.', 'cee', NULL, '/en/contact', 'contact_page_form', 'qualified', 'linkedin', 'social', 'consulting_energy', 'energy efficiency', 'linkedin_ad2', NULL, NULL, 'Consulting firm, multiple solutions needed'),
  (gen_random_uuid(), NOW() - INTERVAL '10 minutes', 'fr', 'Julie Moreau', 'julie.moreau@bakery.fr', '0645678901', 'Boulangerie Artisanale', 'Besoin LED pour boulangerie, ambiance chaleureuse.', 'lighting', NULL, '/fr/contact', 'contact_page_form', 'contacted', 'google', 'cpc', 'bakery_led', 'éclairage boulangerie', 'ad6', NULL, NULL, 'Boulangerie, ambiance importante'),
  (gen_random_uuid(), NOW() - INTERVAL '5 minutes', 'fr', 'Antoine Lefebvre', 'antoine.lefebvre@garage.fr', '0656789012', 'Garage Auto Pro', 'Recherche bornes de recharge pour garage automobile.', 'irve', NULL, '/fr/contact', 'contact_page_form', 'new', 'google', 'organic', NULL, 'borne recharge', NULL, NULL, NULL, 'Garage auto, besoin IRVE'),
  (gen_random_uuid(), NOW(), 'fr', 'Claire Vincent', 'claire.vincent@office.fr', '0667890123', 'Office Solutions', 'Demande information destratification bureaux open space.', 'destratification', NULL, '/fr/contact', 'contact_page_form', 'new', NULL, 'direct', NULL, NULL, NULL, NULL, NULL, 'Bureaux open space, 500m²')
;

-- Vérification
SELECT 
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
  COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
  COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads
FROM public.leads
WHERE created_at >= NOW() - INTERVAL '7 days';