# Effinor Admin Dashboard

Dashboard d'administration pour Effinor, construit avec Next.js, TypeScript, Tailwind CSS et Supabase.

## Technologies

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Supabase**
- **lucide-react**

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du Dashboard avec les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj
```

**Où trouver ces valeurs :**
1. Connectez-vous à votre projet Supabase
2. Allez dans **Settings** > **API**
3. Copiez l'**URL** du projet → `NEXT_PUBLIC_SUPABASE_URL`
4. Copiez la **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Installation

```bash
cd Dashboard
npm install
```

### Développement

Le Dashboard fonctionne sur un port différent du site principal pour permettre un développement en parallèle :

```bash
# Depuis le dossier Dashboard
npm run dev
```

Le Dashboard sera accessible sur **http://localhost:3001**

Pour démarrer le site principal et le Dashboard en même temps, depuis la racine du projet :

```bash
# Depuis la racine du projet
npm run dev:all
```

- Site principal : **http://localhost:3000**
- Dashboard : **http://localhost:3001**

### Production - Configuration sous-domaine

Pour déployer le Dashboard sur un sous-domaine (ex: `admin.effinor.com`), vous avez plusieurs options :

#### Option 1 : Déploiement séparé (recommandé)

1. Déployez le Dashboard comme une application Next.js séparée
2. Configurez votre DNS pour pointer `admin.effinor.com` vers le serveur du Dashboard
3. Configurez votre reverse proxy (Nginx, Cloudflare, etc.) pour router le sous-domaine

**Exemple de configuration Nginx :**

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

#### Option 2 : Middleware Next.js (si même domaine)

Si vous préférez utiliser le même domaine avec un préfixe (`effinor.com/admin`), vous pouvez intégrer le Dashboard dans le site principal en utilisant le middleware Next.js.

### Build et Production

```bash
# Build du Dashboard
    cd Dashboard
    npm run build
    npm run start
```

## Structure de la base de données

Le dashboard s'attend à trouver les tables suivantes dans Supabase :

- `products` - Produits
- `categories` - Catégories
- `commandes` - Commandes
- `commande_statuses` - Statuts des commandes
- `leads` - Leads
- `lead_statuses` - Statuts des leads
- `utilisateurs` - Utilisateurs
- `roles` - Rôles
- `posts` - Articles de blog
- `blog_categories` - Catégories de blog
- `visiteurs` - Visiteurs
- `visiteurs_events` - Événements des visiteurs
- `notifications` - Notifications

Les colonnes utilisent des noms français (snake_case) qui sont automatiquement mappés vers les types TypeScript (camelCase).

## Configuration Supabase Storage

### Problème

Si vous rencontrez l'erreur `StorageApiError: new row violates row-level security policy`, cela signifie que les buckets Supabase Storage ne sont pas configurés ou que les politiques RLS (Row Level Security) ne sont pas définies.

### Solution

#### Étape 1 : Créer les buckets dans Supabase

1. Connectez-vous à votre projet Supabase
2. Allez dans **Storage** dans le menu de gauche
3. Cliquez sur **New bucket**
4. Créez deux buckets :
   - **Nom** : `product-images` → Cochez **Public bucket**
   - **Nom** : `product-documents` → Cochez **Public bucket**

#### Étape 2 : Configurer les politiques RLS

1. Dans Supabase, allez dans **SQL Editor**
2. Copiez et exécutez le contenu du fichier `supabase/supabase-storage-setup.sql`
3. Ce script configure automatiquement toutes les politiques nécessaires pour les buckets

#### Étape 3 : Ajouter la colonne technical_sheet_url (optionnel)

Si vous souhaitez stocker les URLs des PDF de fiches techniques :

1. Dans Supabase, allez dans **SQL Editor**
2. Copiez et exécutez le contenu du fichier `supabase/add-technical-sheet-column.sql`

#### Étape 4 : Vérifier la configuration

1. Rechargez la page de détail produit
2. Essayez d'uploader une image
3. L'upload devrait maintenant fonctionner

### Note importante

Si vous utilisez le mode développement (sans authentification Supabase), vous devrez soit :
- Configurer l'authentification Supabase pour les utilisateurs
- OU modifier les politiques pour permettre les uploads anonymes (non recommandé en production)

Le script `supabase-storage-setup.sql` inclut des politiques pour les utilisateurs anonymes (développement uniquement). **Supprimez ces politiques en production** pour des raisons de sécurité.

### Structure des fichiers

Les fichiers sont organisés comme suit dans Storage :

- **Images** : `product-images/{product_id}/{timestamp}-{random}.{ext}`
- **PDF** : `product-documents/{product_id}/technical-sheet.{ext}`

## Charte graphique

Le Dashboard utilise la même charte graphique que le site principal Effinor :

- **Couleurs principales** : 
  - Bleu foncé : `#0F172A` (Sidebar, backgrounds sombres)
  - Bleu slate : `#1E293B` (Hover, accents)
  - Émeraude : `#10B981` (Boutons primaires, éléments actifs)
  - Émeraude hover : `#059669` (États hover)
  - Gris clair : `#F9FAFB` (Backgrounds)
  - Gris texte : `#4B5563` (Textes secondaires)
- **Police** : Inter
- **Styles** : Cohérents avec le site principal

Les composants UI sont basés sur shadcn/ui mais adaptés pour utiliser la charte Effinor.

## Scripts disponibles

- `npm run dev` : Démarre le serveur de développement sur le port 3001
- `npm run build` : Build de production
- `npm run start` : Démarre le serveur de production sur le port 3001
- `npm run lint` : Lance le linter ESLint