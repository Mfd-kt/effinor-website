# Installation des Scripts SEO

Ce fichier ZIP contient les scripts SQL nécessaires pour installer la gestion des scripts de tracking et publicité dans votre base de données Supabase.

## Fichiers inclus

1. **create-seo-scripts-table.sql** - Crée la table `seo_scripts` avec les permissions RLS
2. **init-seo-scripts.sql** - Initialise les scripts par défaut (Meta Ads, Google Ads, etc.)

## Instructions d'installation

### Étape 1 : Créer la table

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Ouvrez le fichier `create-seo-scripts-table.sql`
4. Copiez-collez le contenu dans l'éditeur SQL
5. Cliquez sur **Run** pour exécuter le script

### Étape 2 : Initialiser les scripts par défaut

1. Toujours dans le **SQL Editor**
2. Ouvrez le fichier `init-seo-scripts.sql`
3. Copiez-collez le contenu dans l'éditeur SQL
4. Cliquez sur **Run** pour exécuter le script

## Scripts préconfigurés

Les scripts suivants seront créés (tous inactifs par défaut) :

- **Meta Ads (Facebook Pixel)** - `meta-ads`
- **Google Ads (Conversion Tracking)** - `google-ads`
- **Google Analytics 4** - `google-analytics`
- **Google Tag Manager** - `google-tag-manager` (head + noscript)
- **Microsoft Advertising (Bing Ads)** - `microsoft-advertising`
- **LinkedIn Insight Tag** - `linkedin-insight`
- **TikTok Pixel** - `tiktok-pixel`
- **Pinterest Tag** - `pinterest-tag`

## Configuration des scripts

1. Connectez-vous au Dashboard admin : `http://votre-domaine:3001/admin/seo?tab=contenu`
2. Cliquez sur **"Gérer les scripts"** dans la section "Scripts de tracking et publicité"
3. Pour chaque script :
   - Cliquez sur **"Éditer"**
   - Remplacez `VOTRE_PIXEL_ID`, `VOTRE_ID`, etc. par vos identifiants réels
   - Activez le script en cochant **"Script actif"**
   - Cliquez sur **"Enregistrer"**

## Vérification

Une fois les scripts activés, ils seront automatiquement injectés dans le site principal :
- Les scripts avec position **"head"** seront injectés dans le `<head>` du site
- Les scripts avec position **"body"** seront injectés dans le `<body>` du site

Vous pouvez vérifier en inspectant le code source de votre site public.

## Notes importantes

- Les scripts sont injectés uniquement dans le **site principal** (pas dans le Dashboard)
- Seuls les scripts **actifs** sont injectés
- Les scripts sont triés par **priorité** (plus petit = exécuté en premier)
- Les scripts inactifs ne sont pas chargés, ce qui améliore les performances

