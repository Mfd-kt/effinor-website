export type SeoContentLang = 'fr' | 'en' | 'ar';

export interface SeoContent {
  id: string;
  slug: string;
  lang: SeoContentLang;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SeoContentSlug = 
  | 'espace-client'
  | 'mentions-legales'
  | 'cgv'
  | 'politique-confidentialite'
  | 'contact'
  | 'a-propos'
  | 'faq'
  | 'plan-du-site'
  | 'conditions-utilisation'
  | 'cookies'
  | 'presse'
  | 'carrieres';

export interface SeoContentPageInfo {
  slug: SeoContentSlug;
  title: string;
  description: string;
  icon?: string;
}

export const SEO_CONTENT_PAGES: SeoContentPageInfo[] = [
  {
    slug: 'espace-client',
    title: 'Espace Client',
    description: 'Page d\'accès à l\'espace client',
  },
  {
    slug: 'mentions-legales',
    title: 'Mentions Légales',
    description: 'Informations légales de l\'entreprise',
  },
  {
    slug: 'cgv',
    title: 'Conditions Générales de Vente',
    description: 'CGV et conditions de vente',
  },
  {
    slug: 'politique-confidentialite',
    title: 'Politique de Confidentialité',
    description: 'Politique de protection des données personnelles',
  },
  {
    slug: 'contact',
    title: 'Contact',
    description: 'Informations de contact et formulaire',
  },
  {
    slug: 'a-propos',
    title: 'À propos',
    description: 'Présentation de l\'entreprise',
  },
  {
    slug: 'faq',
    title: 'FAQ',
    description: 'Questions fréquentes',
  },
  {
    slug: 'plan-du-site',
    title: 'Plan du site',
    description: 'Sitemap HTML',
  },
  {
    slug: 'conditions-utilisation',
    title: 'Conditions d\'utilisation',
    description: 'Termes d\'utilisation du site',
  },
  {
    slug: 'cookies',
    title: 'Politique des Cookies',
    description: 'Informations sur l\'utilisation des cookies',
  },
  {
    slug: 'presse',
    title: 'Presse',
    description: 'Communiqués et ressources presse',
  },
  {
    slug: 'carrieres',
    title: 'Carrières',
    description: 'Offres d\'emploi et recrutement',
  },
];

export interface SeoScript {
  id: string;
  name: string;
  label: string;
  description?: string;
  scriptCode: string;
  scriptPosition: 'head' | 'body';
  active: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

