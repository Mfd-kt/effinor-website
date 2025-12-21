# Site Vitrine Effinor - Next.js 14 + Supabase

Site vitrine multilingue (FR/EN/AR) pour Effinor, développé avec Next.js 14 (App Router), TypeScript, Tailwind CSS et Supabase.

## 🚀 Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Base de données**: Supabase (PostgreSQL)
- **Multilingue**: FR, EN, AR (avec support RTL pour l'arabe)

## 📁 Structure du Projet

```
effinor-website/
├── app/
│   ├── [lang]/              # Routes multilingues
│   │   ├── layout.tsx       # Layout avec Header/Footer
│   │   ├── page.tsx         # Page d'accueil
│   │   ├── solutions/       # Page Solutions
│   │   ├── about/           # Page À propos
│   │   ├── contact/         # Page Contact
│   │   └── blog/            # Blog (structure prête)
│   ├── actions/             # Server Actions
│   │   └── contact.ts       # Action pour formulaire de contact
│   ├── layout.tsx           # Layout racine
│   └── globals.css          # Styles globaux
├── components/              # Composants réutilisables
│   ├── Header.tsx           # Header avec navigation et sélecteur de langue
│   ├── Footer.tsx           # Footer
│   ├── Hero.tsx              # Section Hero de la page d'accueil
│   ├── SolutionsSection.tsx # Section Solutions
│   ├── WhySection.tsx       # Section "Pourquoi Effinor"
│   ├── ProcessSection.tsx    # Section Processus
│   └── ContactFormSection.tsx # Formulaire de contact
├── i18n/                    # Dictionnaires de traduction
│   ├── fr.ts                # Traductions françaises
│   ├── en.ts                # Traductions anglaises
│   └── ar.ts                # Traductions arabes
├── lib/                     # Utilitaires
│   ├── i18n.ts              # Fonction getDictionary()
│   ├── detectLang.ts        # Détection de langue préférée
│   ├── routing.ts            # Utilitaires de routing multilingue
│   ├── supabaseClient.ts    # Client Supabase
│   └── leads.ts             # Fonctions pour gérer les leads
├── types/                   # Types TypeScript
│   └── index.ts             # Types Lang, Dictionary, Lead
├── middleware.ts            # Middleware pour routing multilingue
└── supabase/
    └── schema.sql           # Schéma SQL pour Supabase
```

## 🛠️ Installation

### 1. Cloner et installer les dépendances

```bash
cd effinor-website
npm install
```

### 2. Configurer Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Dans le SQL Editor de Supabase, exécutez le contenu de `supabase/schema.sql` pour créer la table `leads`
3. Récupérez votre URL et votre clé anonyme depuis les paramètres du projet

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Puis remplissez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🌍 Gestion Multilingue

### Routing

Le site utilise un routing par langue :
- `/fr` - Français
- `/en` - Anglais
- `/ar` - Arabe (RTL)

Le middleware redirige automatiquement les utilisateurs arrivant sur `/` vers leur langue préférée (cookie `lang` ou header `Accept-Language`).

### Modifier les textes

Les textes sont centralisés dans les fichiers `i18n/fr.ts`, `i18n/en.ts` et `i18n/ar.ts`.

Chaque fichier contient un objet `Dictionary` avec toutes les traductions :
- `nav.*` - Navigation
- `hero.*` - Section Hero
- `solutions.*` - Section Solutions
- `why.*` - Section "Pourquoi Effinor"
- `process.*` - Section Processus
- `contact.*` - Formulaires de contact
- `footer.*` - Footer

**Exemple de modification** :

```typescript
// i18n/fr.ts
export const fr: Dictionary = {
  hero: {
    title: 'Votre nouveau titre ici',
    // ...
  },
};
```

### Support RTL (Arabe)

Le layout `app/[lang]/layout.tsx` définit automatiquement `dir="rtl"` pour l'arabe. Les composants utilisent des classes Tailwind qui s'adaptent automatiquement.

## 🗄️ Base de Données Supabase

### Table `leads`

La table `leads` stocke les formulaires de contact :

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (généré automatiquement) |
| `created_at` | TIMESTAMPTZ | Date de création |
| `lang` | TEXT | Langue du formulaire ('fr', 'en', 'ar') |
| `name` | TEXT | Nom complet |
| `email` | TEXT | Email |
| `phone` | TEXT | Téléphone |
| `message` | TEXT | Message (optionnel) |
| `page` | TEXT | URL de la page d'origine |
| `origin` | TEXT | Origine du formulaire |

**Important** : La base de données est vierge (pas de données de test). Seul le schéma est créé.

### Créer la table

Exécutez le script SQL dans Supabase :

1. Allez dans **SQL Editor** de votre projet Supabase
2. Copiez-collez le contenu de `supabase/schema.sql`
3. Exécutez le script

## 📝 Formulaires de Contact

Le formulaire de contact est disponible sur :
- Page d'accueil (`/[lang]`) - Formulaire résumé
- Page Contact (`/[lang]/contact`) - Formulaire complet

Les données sont envoyées via une **Server Action** (`app/actions/contact.ts`) qui :
1. Valide les champs (nom, email, téléphone requis)
2. Valide le format de l'email
3. Insère le lead dans Supabase
4. Retourne un message de succès/erreur

## 🎨 Charte Graphique

- **Couleur principale** : `#116BAD` (bleu)
- **Couleur secondaire** : `#FFBA0B` (jaune)
- **Fond** : `#f5f5f5` (gris très clair)
- **Texte** : Noir / Gris foncé

Les couleurs sont définies dans `app/globals.css` et utilisées via Tailwind.

## 🚀 Déploiement

### Vercel (recommandé)

1. Connectez votre repo GitHub à Vercel
2. Ajoutez les variables d'environnement dans les paramètres du projet Vercel
3. Déployez

### Autres plateformes

Le projet est compatible avec toute plateforme supportant Next.js 14.

## 📚 Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linter ESLint
```

## 🔧 Personnalisation

### Ajouter une nouvelle page

1. Créez un nouveau dossier dans `app/[lang]/`
2. Créez un `page.tsx` dans ce dossier
3. Ajoutez les traductions dans `i18n/*.ts`
4. Ajoutez le lien dans `components/Header.tsx` si nécessaire

### Ajouter une nouvelle langue

1. Créez `i18n/[code].ts` avec le dictionnaire
2. Ajoutez le code dans le type `Lang` (`types/index.ts`)
3. Mettez à jour `lib/i18n.ts` et `lib/detectLang.ts`
4. Ajoutez la langue dans `components/Header.tsx`

### Modifier le design

Les styles sont gérés par Tailwind CSS. Modifiez les classes dans les composants ou personnalisez `tailwind.config.ts` si nécessaire.

## 📝 Notes Importantes

- **Pas de données de test** : La base Supabase reste vierge, seul le schéma est créé
- **Détection de langue** : La fonction `detectPreferredLang()` peut être étendue pour utiliser la géolocalisation IP (Cloudflare/Vercel Geo)
- **Sécurité** : Les Server Actions valident les données côté serveur avant insertion dans Supabase
- **RTL** : Le support RTL pour l'arabe est géré automatiquement via l'attribut `dir` sur `<html>`

## 🐛 Dépannage

### Erreur "Missing Supabase environment variables"

Vérifiez que `.env.local` existe et contient les bonnes valeurs.

### La table `leads` n'existe pas

Exécutez le script SQL `supabase/schema.sql` dans Supabase.

### Les traductions ne s'affichent pas

Vérifiez que le paramètre `lang` dans l'URL est valide (`fr`, `en`, `ar`).

## 📞 Support

Pour toute question, contactez l'équipe de développement.

---

**Développé avec ❤️ pour Effinor**
