# Guide de démarrage rapide - Dashboard Effinor

## Installation des dépendances

### 1. Installer les dépendances du Dashboard

```bash
cd Dashboard
npm install
```

### 2. Installer concurrently pour démarrer les deux serveurs (optionnel)

Depuis la racine du projet :

```bash
npm install concurrently --save-dev
```

## Développement

### Option 1 : Dashboard seul

```bash
cd Dashboard
npm run dev
```

Le Dashboard sera accessible sur **http://localhost:3001**

### Option 2 : Site principal et Dashboard en parallèle

Depuis la racine du projet :

```bash
npm run dev:all
```

- Site principal : **http://localhost:3000**
- Dashboard : **http://localhost:3001**

### Option 3 : Démarrer manuellement dans deux terminaux

**Terminal 1 (Site principal) :**
```bash
npm run dev
```

**Terminal 2 (Dashboard) :**
```bash
cd Dashboard
npm run dev
```

## Configuration pour sous-domaine en production

### Déploiement sur admin.effinor.com

1. **Build du Dashboard :**
   ```bash
   cd Dashboard
   npm run build
   ```

2. **Démarrer le serveur de production :**
   ```bash
   npm run start
   ```

3. **Configurer Nginx (exemple) :**
   ```nginx
   server {
       listen 80;
       server_name admin.effinor.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Configurer SSL avec Let's Encrypt :**
   ```bash
   certbot --nginx -d admin.effinor.com
   ```

## Variables d'environnement

Créez un fichier `.env.local` dans le dossier Dashboard :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

## Charte graphique

Le Dashboard utilise exactement la même charte graphique que le site principal :

- **Couleurs Effinor** : Bleu foncé (#0F172A), Émeraude (#10B981)
- **Police** : Inter
- **Styles** : Cohérents avec le site principal

Tous les composants ont été adaptés pour respecter cette charte.

