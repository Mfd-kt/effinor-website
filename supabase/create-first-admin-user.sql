-- ============================================
-- Script pour créer le premier utilisateur admin
-- ============================================
-- 
-- IMPORTANT : Ce script doit être exécuté APRÈS avoir créé un utilisateur
-- dans Supabase Auth (via le Dashboard Supabase > Authentication > Users)
-- 
-- Étapes :
-- 1. Allez dans Supabase Dashboard > Authentication > Users
-- 2. Cliquez sur "Add user" > "Create new user"
-- 3. Entrez l'email et le mot de passe
-- 4. Copiez l'UUID de l'utilisateur créé (auth_user_id)
-- 5. Remplacez 'VOTRE_AUTH_USER_ID_ICI' dans le script ci-dessous par l'UUID copié
-- 6. Ajustez l'email, prénom et nom si nécessaire
-- 7. Exécutez le script
-- ============================================

-- ⚠️ REMPLACEZ 'VOTRE_AUTH_USER_ID_ICI' PAR L'UUID DE VOTRE UTILISATEUR ⚠️
-- Exemple : '123e4567-e89b-12d3-a456-426614174000'
INSERT INTO public.utilisateurs (
  auth_user_id,
  email,
  prenom,
  nom,
  full_name,
  role_id,
  statut,
  active
) 
SELECT 
  'VOTRE_AUTH_USER_ID_ICI'::UUID,  -- ⚠️ REMPLACEZ CETTE VALEUR ⚠️
  'admin@effinor.com',              -- Ajustez l'email si nécessaire
  'Admin',                          -- Ajustez le prénom si nécessaire
  'Effinor',                        -- Ajustez le nom si nécessaire
  'Admin Effinor',                  -- Ajustez le nom complet si nécessaire
  r.id,                             -- Rôle super_admin
  'actif',
  TRUE
FROM public.roles r
WHERE r.slug = 'super_admin'
ON CONFLICT (auth_user_id) DO NOTHING;

-- ============================================
-- Alternative : Créer un utilisateur directement via Supabase Auth
-- ============================================
-- 
-- Vous pouvez aussi utiliser l'API Supabase ou le Dashboard pour créer
-- l'utilisateur, puis exécuter seulement la partie INSERT ci-dessus
-- avec le bon auth_user_id.
-- 
-- Pour créer via le Dashboard :
-- 1. Allez dans Authentication > Users
-- 2. Cliquez sur "Add user" > "Create new user"
-- 3. Remplissez l'email et le mot de passe
-- 4. Copiez l'UUID de l'utilisateur créé
-- 5. Utilisez cet UUID dans le script ci-dessus
-- ============================================

