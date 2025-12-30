-- ============================================
-- Script pour corriger le problème d'email
-- ============================================
-- 
-- Si l'email dans auth.users est différent de celui dans utilisateurs,
-- ce script met à jour la table utilisateurs pour correspondre à auth.users
-- ============================================

-- Mettre à jour l'email dans utilisateurs pour correspondre à auth.users
UPDATE public.utilisateurs u
SET 
  email = au.email,
  updated_at = now()
FROM auth.users au
WHERE u.auth_user_id = au.id
  AND u.auth_user_id = '02510ead-a238-458c-96c0-f10985b43942'::UUID
  AND u.email != au.email;

-- Afficher le résultat
SELECT 
  'Email mis à jour avec succès' as message,
  u.email as email_utilisateurs,
  au.email as email_auth_users
FROM public.utilisateurs u
JOIN auth.users au ON u.auth_user_id = au.id
WHERE u.auth_user_id = '02510ead-a238-458c-96c0-f10985b43942'::UUID;

