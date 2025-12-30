# Guide de déploiement complet - Hostinger

## 📋 Prérequis

- Compte Hostinger avec accès Node.js
- Fichiers ZIP du site principal et du Dashboard
- Clés Supabase (URL et clé anonyme)

## 🚀 Étape 1 : Uploader et extraire les fichiers

### Site principal (groupe-effinor.fr)

1. Connectez-vous au File Manager de Hostinger
2. Allez dans `public_html/`
3. Uploadez le fichier `effinor-main-site-[timestamp].zip`
4. Extrayez le ZIP (clic droit → Extract)
5. Supprimez le fichier ZIP après extraction

### Dashboard (admin.groupe-effinor.fr)

1. Créez le sous-domaine `admin` dans Hostinger (Domaines → Sous-domaines)
2. Allez dans `admin.groupe-effinor.fr/public_html/`
3. Uploadez le fichier `effinor-dashboard-[timestamp].zip`
4. Extrayez le ZIP
5. Supprimez le fichier ZIP après extraction

## 🔧 Étape 2 : Installation des dépendances

### Option A : Via SSH (recommandé)

Si vous avez accès SSH dans Hostinger :

```bash
# Pour le site principal
cd public_html
npm install --production

# Pour le Dashboard
cd admin.groupe-effinor.fr/public_html
npm install --production
```

### Option B : Via le script automatique

1. Uploadez le fichier `hostinger-setup.sh` dans `public_html/`
2. Donnez-lui les permissions d'exécution :
   ```bash
   chmod +x hostinger-setup.sh
   ```
3. Exécutez-le :
   ```bash
   ./hostinger-setup.sh
   ```

### Option C : Via le terminal intégré de Hostinger

1. Dans le File Manager, ouvrez le terminal intégré
2. Naviguez vers `public_html`
3. Exécutez `npm install --production`

## ⚙️ Étape 3 : Configuration des variables d'environnement

### Site principal

1. Dans `public_html/`, créez ou éditez `.env.local`
2. Ajoutez les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NODE_ENV=production
PORT=3000
```

**Où trouver les clés Supabase :**
1. Connectez-vous à [Supabase](https://supabase.com)
2. Allez dans votre projet
3. Settings → API
4. Copiez l'URL du projet → `NEXT_PUBLIC_SUPABASE_URL`
5. Copiez la clé "anon public" → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Dashboard

1. Dans `admin.groupe-effinor.fr/public_html/`, créez `.env.local`
2. Ajoutez les mêmes variables (même Supabase, port différent) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NODE_ENV=production
PORT=3001
```

## 🖥️ Étape 4 : Configuration des applications Node.js

### Site principal

1. Dans Hostinger, allez dans **Node.js Applications**
2. Cliquez sur **Create Application**
3. Configurez :
   - **Name** : `effinor-main-site`
   - **Node.js Version** : `18.x` ou `20.x` (recommandé)
   - **Application Root** : `public_html`
   - **Application Startup File** : `node_modules/.bin/next start`
   - **Port** : `3000` (ou celui fourni par Hostinger)
   - **Environment Variables** :
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
     NODE_ENV=production
     PORT=3000
     ```

### Dashboard

1. Créez une **nouvelle** application Node.js
2. Configurez :
   - **Name** : `effinor-dashboard`
   - **Node.js Version** : `18.x` ou `20.x`
   - **Application Root** : `admin.groupe-effinor.fr/public_html`
   - **Application Startup File** : `node_modules/.bin/next start`
   - **Port** : `3001` (différent du site principal)
   - **Environment Variables** : Même que le site principal, mais `PORT=3001`

## 🌐 Étape 5 : Configuration du reverse proxy

### Option A : Via .htaccess (Apache)

Le fichier `.htaccess` a été créé automatiquement. **Modifiez-le** pour utiliser le bon port :

```apache
# Dans public_html/.htaccess
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
# Remplacez 3000 par le port de votre application Node.js
```

### Option B : Via la configuration du domaine dans Hostinger

1. Allez dans **Domaines** → Votre domaine
2. Configurez le reverse proxy pour pointer vers `localhost:PORT`
3. Portez utilisé : celui de votre application Node.js

### Option C : Via Nginx (si disponible)

Si Hostinger utilise Nginx, créez un fichier de configuration :

```nginx
server {
    listen 80;
    server_name groupe-effinor.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ▶️ Étape 6 : Démarrer les applications

1. Dans **Node.js Applications** de Hostinger
2. Pour chaque application (site principal et Dashboard) :
   - Cliquez sur **Start** ou **Restart**
   - Vérifiez les logs pour confirmer qu'il n'y a pas d'erreurs

## ✅ Étape 7 : Vérification

### Site principal

1. Visitez `http://groupe-effinor.fr` ou `https://groupe-effinor.fr`
2. Vous devriez voir la page d'accueil
3. Testez les routes :
   - `/fr` - Page d'accueil en français
   - `/en` - Page d'accueil en anglais
   - `/ar` - Page d'accueil en arabe

### Dashboard

1. Visitez `http://admin.groupe-effinor.fr` ou `https://admin.groupe-effinor.fr`
2. Vous devriez voir la page de connexion
3. Connectez-vous avec vos identifiants

## 🔒 Étape 8 : Configuration SSL (HTTPS)

1. Dans Hostinger, allez dans **SSL**
2. Activez **Let's Encrypt SSL** pour :
   - `groupe-effinor.fr`
   - `admin.groupe-effinor.fr`
3. Attendez quelques minutes pour l'activation

## 🐛 Dépannage

### Le site affiche toujours la page par défaut de Hostinger

**Problème** : Le reverse proxy n'est pas configuré ou l'application Node.js n'est pas démarrée.

**Solution** :
1. Vérifiez que l'application Node.js est démarrée dans Hostinger
2. Vérifiez les logs de l'application pour les erreurs
3. Vérifiez que le `.htaccess` pointe vers le bon port
4. Vérifiez que le domaine pointe vers `public_html`

### Erreur "Cannot find module"

**Problème** : Les dépendances ne sont pas installées.

**Solution** :
```bash
cd public_html
npm install --production
```

### Erreur "Environment variables not found"

**Problème** : Le fichier `.env.local` n'existe pas ou est mal configuré.

**Solution** :
1. Créez `.env.local` dans `public_html/`
2. Ajoutez toutes les variables d'environnement nécessaires
3. Redémarrez l'application Node.js

### Le site charge mais affiche des erreurs

**Problème** : Les clés Supabase sont incorrectes ou manquantes.

**Solution** :
1. Vérifiez que `.env.local` contient les bonnes clés
2. Vérifiez que les variables d'environnement sont bien configurées dans l'application Node.js
3. Vérifiez les logs de l'application pour plus de détails

### Port déjà utilisé

**Problème** : Le port est déjà utilisé par une autre application.

**Solution** :
1. Utilisez un port différent dans la configuration Node.js
2. Mettez à jour le `.htaccess` avec le nouveau port
3. Redémarrez l'application

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de l'application Node.js dans Hostinger
2. Vérifiez les logs du serveur web
3. Contactez le support Hostinger si nécessaire

## 📝 Notes importantes

- **Ne supprimez jamais** le dossier `.next` (contient le build)
- **Ne supprimez jamais** `node_modules` (contient les dépendances)
- **Sauvegardez** `.env.local` (contient vos clés secrètes)
- **Redémarrez** l'application Node.js après chaque modification de `.env.local`
- Les deux applications (site principal et Dashboard) doivent utiliser des **ports différents**

