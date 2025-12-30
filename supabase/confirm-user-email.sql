-- ============================================
-- Confirmer l'email de l'utilisateur manuellement
-- ============================================
-- 
-- Si l'email n'est pas confirmé, cela peut empêcher la connexion
-- Ce script confirme l'email et le compte
-- ============================================

UPDATE auth.users
SET 
  email_confirmed_at = now(),
  confirmed_at = now(),
  updated_at = now()
WHERE id = '02510ead-a238-458c-96c0-f10985b43942'::UUID
  AND (email_confirmed_at IS NULL OR confirmed_at IS NULL);

-- Afficher le résultat
SELECT 
  'Email et compte confirmés avec succès' as message,
  email,
  email_confirmed_at,
  confirmed_at
FROM auth.users
WHERE id = '02510ead-a238-458c-96c0-f10985b43942'::UUID;

