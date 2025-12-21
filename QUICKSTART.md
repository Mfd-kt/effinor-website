# Guide de Démarrage Rapide

## 🚀 Installation en 5 minutes

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans **SQL Editor**
4. Copiez-collez le contenu de `supabase/schema.sql`
5. Exécutez le script (bouton "Run")

### 3. Récupérer les clés Supabase

1. Dans votre projet Supabase, allez dans **Settings** → **API**
2. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Créer le fichier `.env.local`

```bash
cp .env.example .env.local
```

Puis éditez `.env.local` avec vos valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 5. Lancer le serveur

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

Vous serez automatiquement redirigé vers `/fr`, `/en` ou `/ar` selon votre langue préférée.

## ✅ Vérification

1. Testez les routes :
   - `/fr` - Page d'accueil en français
   - `/en` - Page d'accueil en anglais
   - `/ar` - Page d'accueil en arabe (RTL)
   - `/fr/contact` - Page de contact

2. Testez le formulaire de contact :
   - Remplissez le formulaire sur la page d'accueil
   - Vérifiez dans Supabase → Table Editor → `leads` que le lead a été créé

## 🎨 Personnalisation

### Modifier les textes

Éditez les fichiers dans `i18n/` :
- `i18n/fr.ts` - Textes français
- `i18n/en.ts` - Textes anglais
- `i18n/ar.ts` - Textes arabes

### Modifier les couleurs

Les couleurs principales sont dans `app/globals.css` :
- `--primary: #116BAD` (bleu)
- `--secondary: #FFBA0B` (jaune)

## 📚 Documentation complète

Voir `README.md` pour la documentation complète.
