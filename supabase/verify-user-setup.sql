-- ============================================
-- Script de vérification de la configuration utilisateur
-- ============================================
-- 
-- Ce script vérifie que l'utilisateur est correctement configuré
-- dans auth.users ET dans la table utilisateurs
-- ============================================

-- 1. Vérifier l'utilisateur dans auth.users
SELECT 
  id as auth_user_id,
  email,
  email_confirmed_at,
  created_at as auth_created_at
FROM auth.users
WHERE id = '02510ead-a238-458c-96c0-f10985b43942'::UUID;

-- 2. Vérifier l'utilisateur dans la table utilisateurs
SELECT 
  u.id,
  u.auth_user_id,
  u.email,
  u.prenom,
  u.nom,
  u.full_name,
  u.statut,
  u.active,
  r.slug as role_slug,
  r.name_fr as role_name
FROM public.utilisateurs u
LEFT JOIN public.roles r ON u.role_id = r.id
WHERE u.auth_user_id = '02510ead-a238-458c-96c0-f10985b43942'::UUID
   OR u.email = 'koutmoufdi.pro@gmail.com'
   OR u.email = 'admin@effinor.com';

-- 3. Vérifier la correspondance entre auth.users et utilisateurs
SELECT 
  au.id as auth_id,
  au.email as auth_email,
  u.id as user_id,
  u.email as user_email,
  u.statut,
  u.active,
  r.slug as role
FROM auth.users au
LEFT JOIN public.utilisateurs u ON au.id = u.auth_user_id
LEFT JOIN public.roles r ON u.role_id = r.id
WHERE au.id = '02510ead-a238-458c-96c0-f10985b43942'::UUID
   OR au.email = 'koutmoufdi.pro@gmail.com'
   OR au.email = 'admin@effinor.com';

