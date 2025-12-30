# Guide de déploiement sur Vercel

Vercel est la plateforme recommandée pour Next.js. Elle offre un déploiement automatique, un CDN global, et SSL gratuit.

## 🚀 Étape 1 : Préparer le projet

### Vérifier les fichiers nécessaires

Assurez-vous que votre projet contient :
- ✅ `package.json` avec les scripts Next.js
- ✅ `next.config.ts` ou `next.config.js`
- ✅ `.env.local` avec vos variables (ne sera pas commité, on les ajoutera dans Vercel)

## 📝 Étape 2 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **Sign Up**
3. Connectez-vous avec GitHub, GitLab, ou Bitbucket (recommandé pour le déploiement automatique)
   - Ou créez un compte avec email

## 🔗 Étape 3 : Connecter votre projet

### Option A : Via Git (Recommandé - Déploiement automatique)

1. **Pousser votre code sur GitHub/GitLab/Bitbucket** :
   ```bash
   # Si vous n'avez pas encore de dépôt Git
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/votre-username/effinor-website.git
   git push -u origin main
   ```

2. **Dans Vercel** :
   - Cliquez sur **Add New Project**
   - Cliquez sur **Import Git Repository**
   - Sélectionnez votre dépôt
   - Vercel détectera automatiquement Next.js

### Option B : Via l'interface Vercel (Sans Git)

1. Dans Vercel, cliquez sur **Add New Project**
2. Cliquez sur **Upload** ou **Deploy**
3. Uploadez votre dossier du projet (ou créez un ZIP)

## ⚙️ Étape 4 : Configuration du projet

### Paramètres de build

Vercel détectera automatiquement Next.js, mais vérifiez :

- **Framework Preset** : Next.js
- **Root Directory** : `./` (racine du projet)
- **Build Command** : `npm run build` (automatique)
- **Output Directory** : `.next` (automatique)
- **Install Command** : `npm install` (automatique)

### Variables d'environnement

Dans les paramètres du projet → **Environment Variables**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=https://wzxpjwmxnbepgimkyusm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6eHBqd214bmJlcGdpbWt5dXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTcyMjQsImV4cCI6MjA4MTA3MzIyNH0.IivQyg9FhVJVQNgvCdCEL1HkOGZQPv7gaSdjSZ5JV5Q
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj
NODE_ENV=production
```

**Important** : 
- Les variables commençant par `NEXT_PUBLIC_` sont accessibles côté client
- Les autres variables sont uniquement côté serveur

## 🌐 Étape 5 : Configurer le domaine personnalisé

### Ajouter votre domaine

1. Dans Vercel → Votre projet → **Settings** → **Domains**
2. Cliquez sur **Add Domain**
3. Entrez `groupe-effinor.fr`
4. Vercel vous donnera des instructions DNS

### Configuration DNS

Vous devrez modifier les enregistrements DNS dans Hostinger :

1. **Allez dans Hostinger → Domaines → DNS**
2. **Ajoutez/modifiez ces enregistrements** :

   **Option A : Utiliser un sous-domaine (CNAME)**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

   **Option B : Utiliser le domaine racine (A Record)**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   Vercel vous donnera les valeurs exactes à utiliser.

3. **Attendez la propagation DNS** (peut prendre quelques minutes à quelques heures)

## 🚀 Étape 6 : Déployer

### Premier déploiement

1. Cliquez sur **Deploy**
2. Vercel va :
   - Installer les dépendances
   - Builder le projet
   - Déployer sur le CDN global
3. Vous recevrez une URL temporaire : `votre-projet.vercel.app`

### Déploiements automatiques (si connecté à Git)

- Chaque `git push` déclenchera un nouveau déploiement
- Les pull requests créent des preview deployments
- La branche `main` ou `master` est déployée en production

## ✅ Étape 7 : Vérification

1. Visitez votre URL Vercel : `votre-projet.vercel.app`
2. Testez les routes :
   - `/fr` - Page d'accueil en français
   - `/en` - Page d'accueil en anglais
   - `/ar` - Page d'accueil en arabe
3. Vérifiez que le formulaire de contact fonctionne
4. Testez avec votre domaine personnalisé : `groupe-effinor.fr`

## 🔧 Configuration avancée

### Fichier `vercel.json` (optionnel)

Créez un fichier `vercel.json` à la racine pour des configurations spécifiques :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

### Exclure le Dashboard du déploiement

Si vous ne voulez pas déployer le Dashboard avec le site principal, créez un fichier `.vercelignore` :

```
Dashboard/
deploy/
*.zip
```

## 📊 Monitoring et Analytics

Vercel offre :
- **Analytics** : Statistiques de visite
- **Speed Insights** : Performance du site
- **Logs** : Logs en temps réel
- **Deployments** : Historique des déploiements

## 🔄 Mises à jour

### Mise à jour manuelle

1. Modifiez votre code
2. Si connecté à Git : `git push`
3. Si upload manuel : re-upload dans Vercel

### Mise à jour automatique (avec Git)

Chaque commit sur la branche principale déclenche un nouveau déploiement.

## 🐛 Dépannage

### Erreur de build

1. Vérifiez les logs dans Vercel → Deployments → Votre déploiement
2. Vérifiez que toutes les dépendances sont dans `package.json`
3. Vérifiez que les variables d'environnement sont correctes

### Erreur "Module not found"

- Vérifiez que toutes les dépendances sont listées dans `package.json`
- Vérifiez que le `node_modules` n'est pas commité (il sera installé par Vercel)

### Le site ne se charge pas

1. Vérifiez les logs dans Vercel
2. Vérifiez la configuration DNS
3. Vérifiez que le domaine est bien configuré dans Vercel

## 💰 Tarifs

- **Hobby (Gratuit)** : Parfait pour commencer
  - Déploiements illimités
  - 100 GB de bande passante
  - SSL gratuit
  - CDN global

- **Pro ($20/mois)** : Pour les projets professionnels
  - Tout du plan Hobby
  - Analytics avancées
  - Plus de bande passante
  - Support prioritaire

## 📝 Checklist de déploiement

- [ ] Compte Vercel créé
- [ ] Projet connecté (Git ou Upload)
- [ ] Variables d'environnement configurées
- [ ] Build réussi
- [ ] Site accessible sur l'URL Vercel
- [ ] Domaine personnalisé configuré
- [ ] DNS configuré dans Hostinger
- [ ] SSL activé automatiquement
- [ ] Site testé et fonctionnel

## 🎉 Avantages de Vercel pour Next.js

✅ **Optimisé pour Next.js** : Configuration automatique  
✅ **Déploiement instantané** : Quelques secondes  
✅ **CDN global** : Performance optimale partout  
✅ **SSL automatique** : HTTPS gratuit  
✅ **Preview deployments** : Testez avant de publier  
✅ **Analytics intégrées** : Suivez les performances  
✅ **Gratuit pour commencer** : Plan Hobby gratuit  

## 🔗 Liens utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js sur Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Support Vercel](https://vercel.com/support)

