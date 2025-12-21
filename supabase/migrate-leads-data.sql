-- Script de migration pour transférer les données existantes vers la nouvelle structure
-- Ce script préserve toutes les données existantes et remplit les nouveaux champs

-- Étape 1: S'assurer que toutes les colonnes existent (déjà fait par extend-leads-table.sql)
-- Cette étape est incluse pour être sûr que le script peut être exécuté indépendamment

-- Étape 2: Migrer les données existantes
UPDATE public.leads
SET
  -- Migrer le nom vers beneficiary (split en first_name et last_name)
  beneficiary_first_name = CASE 
    WHEN name IS NOT NULL AND name != '' THEN
      -- Prendre le premier mot comme prénom
      SPLIT_PART(TRIM(name), ' ', 1)
    ELSE NULL
  END,
  beneficiary_last_name = CASE 
    WHEN name IS NOT NULL AND name != '' AND POSITION(' ' IN TRIM(name)) > 0 THEN
      -- Prendre le reste comme nom
      SUBSTRING(TRIM(name) FROM POSITION(' ' IN TRIM(name)) + 1)
    WHEN name IS NOT NULL AND name != '' THEN
      -- Si un seul mot, le mettre dans last_name
      TRIM(name)
    ELSE NULL
  END,
  
  -- Migrer company vers work_company_name
  work_company_name = CASE 
    WHEN company IS NOT NULL AND company != '' THEN company
    ELSE NULL
  END,
  
  -- Migrer phone vers beneficiary_phone
  beneficiary_phone = CASE 
    WHEN phone IS NOT NULL AND phone != '' THEN phone
    ELSE NULL
  END,
  
  -- Migrer email vers beneficiary_email (et garder dans email pour compatibilité)
  beneficiary_email = CASE 
    WHEN email IS NOT NULL AND email != '' THEN email
    ELSE NULL
  END
  
WHERE 
  -- Ne mettre à jour que les leads qui n'ont pas encore ces données
  (beneficiary_first_name IS NULL OR beneficiary_last_name IS NULL)
  OR (work_company_name IS NULL AND company IS NOT NULL)
  OR (beneficiary_phone IS NULL AND phone IS NOT NULL)
  OR (beneficiary_email IS NULL AND email IS NOT NULL);

-- Étape 3: Vérification - Afficher un résumé de la migration
SELECT 
  COUNT(*) as total_leads,
  COUNT(beneficiary_first_name) as leads_with_beneficiary_first_name,
  COUNT(beneficiary_last_name) as leads_with_beneficiary_last_name,
  COUNT(work_company_name) as leads_with_work_company_name,
  COUNT(beneficiary_phone) as leads_with_beneficiary_phone,
  COUNT(beneficiary_email) as leads_with_beneficiary_email
FROM public.leads;

-- Note: Les champs name, company, phone, email originaux sont conservés
-- pour la compatibilité avec le code existant

