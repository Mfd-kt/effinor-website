-- ============================================
-- Schéma de base de données Supabase pour Effinor
-- ============================================
-- 
-- Ce fichier contient le schéma SQL pour créer les tables nécessaires :
-- - 'categories' : catégories de projets (luminaire, ventilation, etc.)
-- - 'leads' : formulaires de contact
--
-- IMPORTANT : Ne pas insérer de données de test.
-- La base doit rester vierge au niveau des données.
-- ============================================

-- Table : categories
-- Catégories de projets Effinor
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  description_ar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour le slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Commentaires pour documentation
COMMENT ON TABLE categories IS 'Catégories de projets Effinor (luminaire, ventilation, IRVE, étude)';
COMMENT ON COLUMN categories.slug IS 'Identifiant unique de la catégorie (ex: luminaire, ventilation, irve, etude)';

-- Table : leads
-- Stocke les demandes de contact provenant des formulaires du site
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lang TEXT NOT NULL CHECK (lang IN ('fr', 'en', 'ar')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  message TEXT,
  solution TEXT, -- Conservé pour rétrocompatibilité
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  page TEXT,
  origin TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived')),
  -- Champs UTM et tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,
  fbclid TEXT
);

-- Ajout de la colonne category_id si elle n'existe pas (pour les migrations)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_lang ON leads(lang);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_origin ON leads(origin);
CREATE INDEX IF NOT EXISTS idx_leads_category_id ON leads(category_id);

-- Commentaires pour documentation
COMMENT ON TABLE leads IS 'Table stockant les leads provenant des formulaires de contact du site Effinor';
COMMENT ON COLUMN leads.lang IS 'Langue du formulaire (fr, en, ar)';
COMMENT ON COLUMN leads.page IS 'URL ou slug de la page d''où provient la demande';
COMMENT ON COLUMN leads.origin IS 'Origine du formulaire (ex: homepage_form, contact_page_form)';
COMMENT ON COLUMN leads.status IS 'Statut du lead (new, contacted, qualified, converted, archived)';
COMMENT ON COLUMN leads.solution IS 'Type de solution demandée (lighting, air, energie, charge) - conservé pour rétrocompatibilité';
COMMENT ON COLUMN leads.category_id IS 'Référence à la catégorie de projet (privilégié sur solution)';
COMMENT ON COLUMN leads.utm_source IS 'Source UTM du trafic';
COMMENT ON COLUMN leads.utm_medium IS 'Medium UTM du trafic';
COMMENT ON COLUMN leads.utm_campaign IS 'Campagne UTM';
COMMENT ON COLUMN leads.gclid IS 'Google Click ID pour tracking Google Ads';
COMMENT ON COLUMN leads.fbclid IS 'Facebook Click ID pour tracking Facebook Ads';

-- ============================================
-- Tables pour le catalogue produits
-- ============================================

-- Table : products
-- Caractéristiques techniques des produits (indépendantes de la langue)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  internal_ref TEXT,
  type TEXT,
  power_w INTEGER,
  luminous_flux_lm INTEGER,
  efficiency_lm_per_w NUMERIC,
  cct_min INTEGER,
  cct_max INTEGER,
  cri INTEGER,
  ip_rating TEXT,
  ik_rating TEXT,
  is_dimmable BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  main_image_url TEXT,
  price_ht NUMERIC(12,2),
  price_currency TEXT NOT NULL DEFAULT 'EUR' CHECK (price_currency IN ('EUR','USD')),
  is_quote_only BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Colonnes enrichies pour e-commerce B2B
DO $$ 
BEGIN
  -- Ajout des colonnes enrichies de manière idempotente
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'datasheet_url') THEN
    ALTER TABLE public.products ADD COLUMN datasheet_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'warranty_years') THEN
    ALTER TABLE public.products ADD COLUMN warranty_years INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'brand') THEN
    ALTER TABLE public.products ADD COLUMN brand TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'model') THEN
    ALTER TABLE public.products ADD COLUMN model TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'voltage') THEN
    ALTER TABLE public.products ADD COLUMN voltage TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'lifetime_hours') THEN
    ALTER TABLE public.products ADD COLUMN lifetime_hours INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'beam_angle_deg') THEN
    ALTER TABLE public.products ADD COLUMN beam_angle_deg INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'operating_temp') THEN
    ALTER TABLE public.products ADD COLUMN operating_temp TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'dimensions_mm') THEN
    ALTER TABLE public.products ADD COLUMN dimensions_mm TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'weight_kg') THEN
    ALTER TABLE public.products ADD COLUMN weight_kg NUMERIC(6,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'certifications') THEN
    ALTER TABLE public.products ADD COLUMN certifications JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'features') THEN
    ALTER TABLE public.products ADD COLUMN features JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'specs') THEN
    ALTER TABLE public.products ADD COLUMN specs JSONB;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

COMMENT ON TABLE public.products IS 'Produits catalogue Effinor (luminaires, ventilation, IRVE, etc.).';
COMMENT ON COLUMN public.products.price_ht IS 'Prix unitaire HT du produit.';
COMMENT ON COLUMN public.products.price_currency IS 'Devise du prix : EUR ou USD uniquement.';
COMMENT ON COLUMN public.products.is_quote_only IS 'Si TRUE, le produit n''a pas de prix affiché et nécessite une demande de devis.';
COMMENT ON COLUMN public.products.datasheet_url IS 'URL de la fiche technique PDF';
COMMENT ON COLUMN public.products.warranty_years IS 'Garantie en années';
COMMENT ON COLUMN public.products.certifications IS 'Tableau JSON des certifications (ex: ["CE", "RoHS"])';
COMMENT ON COLUMN public.products.features IS 'Tableau JSON des points forts (ex: ["Économie d''énergie", "Installation rapide"])';
COMMENT ON COLUMN public.products.specs IS 'Spécifications techniques extensibles (clé/valeur JSON)';

-- Table : product_translations
-- Contenu multilingue pour chaque produit
CREATE TABLE IF NOT EXISTS public.product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('fr', 'en', 'ar')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  application TEXT,
  UNIQUE (product_id, lang)
);

CREATE INDEX IF NOT EXISTS idx_product_translations_lang ON public.product_translations(lang);
CREATE INDEX IF NOT EXISTS idx_product_translations_slug ON public.product_translations(slug);
CREATE INDEX IF NOT EXISTS idx_product_translations_product_id ON public.product_translations(product_id);

COMMENT ON TABLE public.product_translations IS 'Traductions FR/EN/AR du catalogue produits Effinor.';

-- Table : product_images
-- Images multiples pour chaque produit
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_fr TEXT,
  alt_en TEXT,
  alt_ar TEXT,
  position INTEGER NOT NULL DEFAULT 1,
  is_main BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_position ON public.product_images(product_id, position);

COMMENT ON TABLE public.product_images IS 'Images multiples pour chaque produit Effinor';
COMMENT ON COLUMN public.product_images.is_main IS 'Image principale (une seule par produit)';
COMMENT ON COLUMN public.product_images.position IS 'Ordre d''affichage des images';

-- ============================================
-- Tables pour les commandes
-- ============================================

-- Table : orders
-- Commandes clients (unifiées : commandes payées et devis)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lang TEXT NOT NULL CHECK (lang IN ('fr','en','ar')),
  
  -- Informations client
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_company TEXT,
  
  -- Adresse de livraison (obligatoire)
  delivery_address TEXT NOT NULL,
  delivery_address_2 TEXT,
  delivery_postcode TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_country TEXT NOT NULL DEFAULT 'FR',
  
  -- Métier : type et statuts
  order_type TEXT NOT NULL CHECK (order_type IN ('paid','quote')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending','paid','quote','failed','refunded')),
  fulfillment_status TEXT NOT NULL CHECK (fulfillment_status IN ('to_confirm','to_ship','shipped','cancelled')),
  has_quote_items BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Montants
  currency TEXT CHECK (currency IN ('EUR','USD')),
  total_ht NUMERIC(14,2),
  
  -- Paiement
  payment_method TEXT CHECK (payment_method IN ('card','transfer')),
  paid_at TIMESTAMPTZ,
  
  -- Technique
  notes TEXT,
  cart_snapshot JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

COMMENT ON TABLE public.orders IS 'Commandes clients Effinor';
COMMENT ON COLUMN public.orders.cart_snapshot IS 'Snapshot JSON du panier au moment de la commande';

-- Migration pour les colonnes existantes (idempotent)
DO $$
BEGIN
  -- Ajouter lang si n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'lang') THEN
    ALTER TABLE public.orders ADD COLUMN lang TEXT;
    -- Ajouter la contrainte CHECK
    ALTER TABLE public.orders ADD CONSTRAINT orders_lang_check CHECK (lang IN ('fr','en','ar'));
    -- Mettre une valeur par défaut pour les enregistrements existants
    UPDATE public.orders SET lang = 'fr' WHERE lang IS NULL;
    -- Rendre NOT NULL après mise à jour
    ALTER TABLE public.orders ALTER COLUMN lang SET NOT NULL;
  END IF;

  -- Ajouter currency si n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'currency') THEN
    ALTER TABLE public.orders ADD COLUMN currency TEXT CHECK (currency IN ('EUR','USD'));
  END IF;

  -- Ajouter total_ht si n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'total_ht') THEN
    ALTER TABLE public.orders ADD COLUMN total_ht NUMERIC(14,2);
  END IF;

  -- Renommer comment en notes si comment existe et notes n'existe pas
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'comment')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'notes') THEN
    ALTER TABLE public.orders RENAME COLUMN comment TO notes;
  END IF;

  -- Ajouter notes si n'existe pas (et comment n'existe pas)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'notes')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'comment') THEN
    ALTER TABLE public.orders ADD COLUMN notes TEXT;
  END IF;

  -- Ajouter colonnes d'adresse de livraison
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'delivery_address') THEN
    ALTER TABLE public.orders ADD COLUMN delivery_address TEXT;
    -- Pour les commandes existantes, on met une valeur par défaut (à compléter manuellement)
    UPDATE public.orders SET delivery_address = 'À compléter' WHERE delivery_address IS NULL;
    -- On ne rend pas NOT NULL ici pour éviter d'échec si des données existent déjà
    -- Si besoin, rendre NOT NULL après migration manuelle des données
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'delivery_address_2') THEN
    ALTER TABLE public.orders ADD COLUMN delivery_address_2 TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'delivery_postcode') THEN
    ALTER TABLE public.orders ADD COLUMN delivery_postcode TEXT;
    UPDATE public.orders SET delivery_postcode = '' WHERE delivery_postcode IS NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'delivery_city') THEN
    ALTER TABLE public.orders ADD COLUMN delivery_city TEXT;
    UPDATE public.orders SET delivery_city = 'À compléter' WHERE delivery_city IS NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'delivery_country') THEN
    ALTER TABLE public.orders ADD COLUMN delivery_country TEXT DEFAULT 'FR';
    UPDATE public.orders SET delivery_country = 'FR' WHERE delivery_country IS NULL;
  END IF;

  -- Ajouter colonnes métier (order_type, payment_status, fulfillment_status, has_quote_items)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'order_type') THEN
    ALTER TABLE public.orders ADD COLUMN order_type TEXT CHECK (order_type IN ('paid','quote'));
    -- Déterminer order_type pour les commandes existantes basé sur status
    UPDATE public.orders SET order_type = CASE 
      WHEN status IN ('new','processing') THEN 'quote'
      ELSE 'paid'
    END WHERE order_type IS NULL;
    -- Ajouter contrainte NOT NULL après migration
    ALTER TABLE public.orders ALTER COLUMN order_type SET NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'payment_status') THEN
    ALTER TABLE public.orders ADD COLUMN payment_status TEXT CHECK (payment_status IN ('pending','paid','quote','failed','refunded'));
    -- Migrer depuis l'ancien status
    UPDATE public.orders SET payment_status = CASE 
      WHEN status = 'new' THEN 'quote'
      WHEN status = 'processing' THEN 'pending'
      WHEN status = 'quoted' THEN 'quote'
      WHEN status = 'closed' THEN 'paid'
      WHEN status = 'cancelled' THEN 'failed'
      ELSE 'pending'
    END WHERE payment_status IS NULL;
    ALTER TABLE public.orders ALTER COLUMN payment_status SET NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'fulfillment_status') THEN
    ALTER TABLE public.orders ADD COLUMN fulfillment_status TEXT CHECK (fulfillment_status IN ('to_confirm','to_ship','shipped','cancelled'));
    -- Déterminer fulfillment_status pour les commandes existantes
    UPDATE public.orders SET fulfillment_status = CASE 
      WHEN status IN ('new','quoted') THEN 'to_confirm'
      WHEN status = 'processing' THEN 'to_ship'
      WHEN status = 'closed' THEN 'shipped'
      WHEN status = 'cancelled' THEN 'cancelled'
      ELSE 'to_confirm'
    END WHERE fulfillment_status IS NULL;
    ALTER TABLE public.orders ALTER COLUMN fulfillment_status SET NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'has_quote_items') THEN
    ALTER TABLE public.orders ADD COLUMN has_quote_items BOOLEAN NOT NULL DEFAULT FALSE;
    -- Déterminer has_quote_items en analysant cart_snapshot pour les commandes existantes
    -- Pour simplifier, on suppose que si order_type = 'quote' alors has_quote_items = true
    UPDATE public.orders SET has_quote_items = (order_type = 'quote') WHERE has_quote_items IS NULL;
  END IF;

  -- Ajouter colonnes paiement
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'payment_method') THEN
    ALTER TABLE public.orders ADD COLUMN payment_method TEXT CHECK (payment_method IN ('card','transfer'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'paid_at') THEN
    ALTER TABLE public.orders ADD COLUMN paid_at TIMESTAMPTZ;
    -- Si payment_status = 'paid' et created_at existe, utiliser created_at comme paid_at
    UPDATE public.orders SET paid_at = created_at 
    WHERE payment_status = 'paid' AND paid_at IS NULL;
  END IF;

  -- Modifier status pour utiliser les nouvelles valeurs (si la contrainte existe avec les anciennes valeurs)
  -- Note: PostgreSQL ne permet pas de modifier directement une CHECK constraint, il faut la recréer
  -- On laisse la contrainte existante, elle sera recréée lors d'un DROP/CREATE si nécessaire
END $$;

-- Créer les index sur les nouvelles colonnes (après migration)
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON public.orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON public.orders(order_type);

-- Commentaires sur les colonnes ajoutées par migration (après leur création)
COMMENT ON COLUMN public.orders.lang IS 'Langue de la commande (fr/en/ar)';
COMMENT ON COLUMN public.orders.currency IS 'Devise unique si pas mixte, NULL sinon';
COMMENT ON COLUMN public.orders.total_ht IS 'Total HT calculé (NULL si devises mixtes ou sur devis)';
COMMENT ON COLUMN public.orders.notes IS 'Notes et commentaires du client';
COMMENT ON COLUMN public.orders.order_type IS 'Type de commande : paid (payée) ou quote (devis)';
COMMENT ON COLUMN public.orders.payment_status IS 'Statut paiement : pending, paid, quote, failed, refunded';
COMMENT ON COLUMN public.orders.fulfillment_status IS 'Statut expédition : to_confirm, to_ship, shipped, cancelled';
COMMENT ON COLUMN public.orders.has_quote_items IS 'TRUE si au moins un produit est sur devis';
COMMENT ON COLUMN public.orders.payment_method IS 'Méthode de paiement : card (carte) ou transfer (virement)';
COMMENT ON COLUMN public.orders.paid_at IS 'Date/heure de paiement (NULL si non payé)';

-- Table : order_items
-- Items d'une commande
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  sku TEXT,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_ht NUMERIC(12,2),
  currency TEXT CHECK (currency IN ('EUR','USD')),
  is_quote_only BOOLEAN NOT NULL DEFAULT FALSE,
  line_total_ht NUMERIC(14,2)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

COMMENT ON TABLE public.order_items IS 'Items d''une commande Effinor';
COMMENT ON COLUMN public.order_items.product_id IS 'Référence au produit (ON DELETE RESTRICT pour préserver l''historique)';
COMMENT ON COLUMN public.order_items.sku IS 'SKU du produit au moment de la commande';
COMMENT ON COLUMN public.order_items.name IS 'Nom du produit au moment de la commande';

-- Migration pour les colonnes existantes (idempotent)
DO $$
BEGIN
  -- Renommer price_ht en unit_price_ht si price_ht existe et unit_price_ht n'existe pas
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'price_ht')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'unit_price_ht') THEN
    ALTER TABLE public.order_items RENAME COLUMN price_ht TO unit_price_ht;
  END IF;

  -- Ajouter unit_price_ht si n'existe pas (et price_ht n'existe pas)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'unit_price_ht')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'price_ht') THEN
    ALTER TABLE public.order_items ADD COLUMN unit_price_ht NUMERIC(12,2);
  END IF;

  -- Renommer price_currency en currency si price_currency existe et currency n'existe pas
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'price_currency')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'currency') THEN
    ALTER TABLE public.order_items RENAME COLUMN price_currency TO currency;
    -- Mettre à jour la contrainte CHECK
    ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_price_currency_check;
    ALTER TABLE public.order_items ADD CONSTRAINT order_items_currency_check CHECK (currency IN ('EUR', 'USD'));
  END IF;

  -- Ajouter currency si n'existe pas (et price_currency n'existe pas)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'currency')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'price_currency') THEN
    ALTER TABLE public.order_items ADD COLUMN currency TEXT CHECK (currency IN ('EUR','USD'));
  END IF;

  -- Ajouter line_total_ht si n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'line_total_ht') THEN
    ALTER TABLE public.order_items ADD COLUMN line_total_ht NUMERIC(14,2);
  END IF;

  -- Modifier product_id pour ON DELETE RESTRICT si nécessaire (cela nécessite de recréer la foreign key)
  -- On laisse la contrainte existante, elle sera recréée lors d'un DROP/CREATE si nécessaire
END $$;

-- Commentaires sur les colonnes ajoutées par migration dans order_items (après leur création)
COMMENT ON COLUMN public.order_items.unit_price_ht IS 'Prix unitaire HT (NULL si sur devis)';
COMMENT ON COLUMN public.order_items.currency IS 'Devise du prix (EUR ou USD)';
COMMENT ON COLUMN public.order_items.line_total_ht IS 'Total ligne HT (NULL si sur devis, sinon quantity * unit_price_ht)';
