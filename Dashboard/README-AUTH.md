# Guide d'authentification - Dashboard Effinor

## Configuration initiale

### 1. Créer les tables dans Supabase

Exécutez le script SQL suivant dans Supabase SQL Editor :

```sql
-- Exécutez d'abord ce script
supabase/create-users-tables.sql
```

Ce script crée :
- La table `roles` avec les 4 rôles par défaut (super_admin, admin, editor, viewer)
- La table `utilisateurs` pour stocker les métadonnées des utilisateurs
- Les politiques RLS (Row Level Security)
- Les triggers et fonctions nécessaires

### 2. Créer le premier utilisateur admin

#### Option A : Via le Dashboard Supabase (Recommandé)

1. Allez dans **Supabase Dashboard > Authentication > Users**
2. Cliquez sur **"Add user"** > **"Create new user"**
3. Remplissez :
   - **Email** : `admin@effinor.com` (ou votre email)
   - **Password** : Choisissez un mot de passe fort
   - **Auto Confirm User** : Cochez cette case
4. Cliquez sur **"Create user"**
5. **Copiez l'UUID** de l'utilisateur créé (visible dans la liste des utilisateurs)

#### Option B : Via SQL (si vous avez déjà créé l'utilisateur dans Auth)

1. Exécutez le script `supabase/create-first-admin-user.sql`
2. Remplacez `VOTRE_AUTH_USER_ID_ICI` par l'UUID copié à l'étape précédente
3. Ajustez l'email, prénom et nom si nécessaire

### 3. Créer l'entrée dans la table utilisateurs

Après avoir créé l'utilisateur dans Supabase Auth, vous devez créer l'entrée correspondante dans la table `utilisateurs` :

```sql
-- Remplacez 'VOTRE_AUTH_USER_ID' par l'UUID de l'utilisateur créé
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
  'VOTRE_AUTH_USER_ID'::UUID,
  'admin@effinor.com',
  'Admin',
  'Effinor',
  'Admin Effinor',
  r.id,
  'actif',
  TRUE
FROM public.roles r
WHERE r.slug = 'super_admin';
```

## Connexion

1. Allez sur `http://localhost:3000/login` (ou votre URL de développement)
2. Entrez l'email et le mot de passe créés
3. Vous serez redirigé vers le Dashboard

## Rôles disponibles

- **super_admin** : Accès complet à toutes les fonctionnalités
- **admin** : Gestion complète du système
- **editor** : Peut créer et modifier du contenu
- **viewer** : Accès en lecture seule

## Réinitialisation de mot de passe

1. Allez sur `/reset-password`
2. Entrez votre email
3. Un lien de réinitialisation sera envoyé par email
4. Cliquez sur le lien et définissez un nouveau mot de passe

## Configuration Supabase

### URLs de redirection

Dans **Supabase Dashboard > Authentication > URL Configuration**, configurez :

- **Site URL** : `http://localhost:3000` (développement) ou votre URL de production
- **Redirect URLs** : 
  - `http://localhost:3000/reset-password`
  - `http://localhost:3000/verify-email`
  - Votre URL de production + `/reset-password`
  - Votre URL de production + `/verify-email`

### Templates d'email

Les templates d'email pour la réinitialisation de mot de passe et la vérification d'email sont configurés dans **Supabase Dashboard > Authentication > Email Templates**.

Vous pouvez les personnaliser selon vos besoins.

## Dépannage

### "Invalid login credentials"

- Vérifiez que l'utilisateur existe dans **Supabase Auth > Users**
- Vérifiez que le mot de passe est correct
- Vérifiez que l'utilisateur a une entrée dans la table `utilisateurs`

### Erreur de permissions

- Vérifiez que les politiques RLS sont correctement configurées
- Vérifiez que l'utilisateur a un `role_id` valide dans la table `utilisateurs`

### L'utilisateur ne peut pas se connecter

- Vérifiez que `active = TRUE` dans la table `utilisateurs`
- Vérifiez que `statut = 'actif'` dans la table `utilisateurs`
- Vérifiez que l'email est vérifié dans Supabase Auth (si la vérification d'email est requise)

