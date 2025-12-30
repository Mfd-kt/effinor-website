# ✅ Checklist de déploiement - Hostinger

Utilisez cette checklist pour vous assurer que tout est correctement configuré.

## 📦 Préparation

- [ ] Fichiers ZIP créés (`effinor-main-site-*.zip` et `effinor-dashboard-*.zip`)
- [ ] Clés Supabase récupérées (URL et clé anonyme)
- [ ] Accès au File Manager Hostinger
- [ ] Accès au gestionnaire Node.js de Hostinger

## 🚀 Site principal (groupe-effinor.fr)

### Upload et extraction
- [ ] Fichier ZIP uploadé dans `public_html/`
- [ ] Fichier ZIP extrait
- [ ] Fichier ZIP supprimé après extraction
- [ ] Dossiers présents : `app/`, `components/`, `.next/`, `node_modules/`

### Installation
- [ ] Dépendances installées (`npm install --production`)
- [ ] Dossier `node_modules/` présent

### Configuration
- [ ] Fichier `.env.local` créé
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configuré
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configuré
- [ ] `NODE_ENV=production` défini
- [ ] `PORT=3000` (ou port fourni par Hostinger) défini

### Application Node.js
- [ ] Application Node.js créée dans Hostinger
- [ ] Nom : `effinor-main-site`
- [ ] Version Node.js : `18.x` ou `20.x`
- [ ] Dossier racine : `public_html`
- [ ] Point d'entrée : `node_modules/.bin/next start`
- [ ] Port configuré (ex: `3000`)
- [ ] Variables d'environnement ajoutées
- [ ] Application démarrée

### Reverse proxy
- [ ] Fichier `.htaccess` créé/modifié
- [ ] Port dans `.htaccess` correspond au port de l'application Node.js
- [ ] Configuration du domaine vérifiée

### Vérification
- [ ] Site accessible sur `http://groupe-effinor.fr`
- [ ] Page d'accueil s'affiche
- [ ] Routes `/fr`, `/en`, `/ar` fonctionnent
- [ ] Pas d'erreurs dans les logs

## 🎛️ Dashboard (admin.groupe-effinor.fr)

### Sous-domaine
- [ ] Sous-domaine `admin` créé dans Hostinger
- [ ] Dossier `admin.groupe-effinor.fr/public_html/` créé

### Upload et extraction
- [ ] Fichier ZIP uploadé dans `admin.groupe-effinor.fr/public_html/`
- [ ] Fichier ZIP extrait
- [ ] Fichier ZIP supprimé après extraction
- [ ] Dossiers présents : `app/`, `components/`, `.next/`, `node_modules/`

### Installation
- [ ] Dépendances installées (`npm install --production`)
- [ ] Dossier `node_modules/` présent

### Configuration
- [ ] Fichier `.env.local` créé
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configuré (même que site principal)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configuré (même que site principal)
- [ ] `NODE_ENV=production` défini
- [ ] `PORT=3001` (différent du site principal) défini

### Application Node.js
- [ ] Application Node.js créée dans Hostinger
- [ ] Nom : `effinor-dashboard`
- [ ] Version Node.js : `18.x` ou `20.x`
- [ ] Dossier racine : `admin.groupe-effinor.fr/public_html`
- [ ] Point d'entrée : `node_modules/.bin/next start`
- [ ] Port configuré (ex: `3001`, différent du site principal)
- [ ] Variables d'environnement ajoutées
- [ ] Application démarrée

### Reverse proxy
- [ ] Fichier `.htaccess` créé/modifié
- [ ] Port dans `.htaccess` correspond au port de l'application Node.js
- [ ] Configuration du sous-domaine vérifiée

### Vérification
- [ ] Dashboard accessible sur `http://admin.groupe-effinor.fr`
- [ ] Page de connexion s'affiche
- [ ] Connexion fonctionne
- [ ] Pas d'erreurs dans les logs

## 🔒 SSL/HTTPS

- [ ] SSL activé pour `groupe-effinor.fr`
- [ ] SSL activé pour `admin.groupe-effinor.fr`
- [ ] Redirection HTTP → HTTPS configurée (optionnel)

## 🧪 Tests finaux

### Site principal
- [ ] Page d'accueil charge correctement
- [ ] Navigation fonctionne
- [ ] Formulaire de contact fonctionne
- [ ] Pages multilingues fonctionnent (`/fr`, `/en`, `/ar`)
- [ ] Images et assets se chargent

### Dashboard
- [ ] Page de connexion fonctionne
- [ ] Connexion réussie
- [ ] Dashboard principal s'affiche
- [ ] Navigation dans le Dashboard fonctionne
- [ ] Pas d'erreurs dans la console du navigateur

## 📝 Notes

- Date de déploiement : ___________
- Port site principal : ___________
- Port Dashboard : ___________
- Version Node.js : ___________

## 🆘 En cas de problème

1. Vérifiez les logs de l'application Node.js dans Hostinger
2. Vérifiez les logs du serveur web
3. Vérifiez que les ports ne sont pas en conflit
4. Vérifiez que les variables d'environnement sont correctes
5. Contactez le support Hostinger si nécessaire

