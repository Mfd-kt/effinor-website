-- ============================================
-- Vérifier le statut d'authentification de l'utilisateur
-- ============================================

SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  au.created_at,
  au.last_sign_in_at,
  au.confirmed_at,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN 'Email non confirmé'
    ELSE 'Email confirmé'
  END as email_status,
  CASE 
    WHEN au.confirmed_at IS NULL THEN 'Compte non confirmé'
    ELSE 'Compte confirmé'
  END as account_status
FROM auth.users au
WHERE au.id = '02510ead-a238-458c-96c0-f10985b43942'::UUID;

