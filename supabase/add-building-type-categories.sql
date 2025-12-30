-- Script pour ajouter les catégories "Type de bâtiment" si elles n'existent pas
-- Ces catégories seront utilisées dans le formulaire d'estimation

-- Catégorie 1: Entrepôt / Logistique
INSERT INTO public.categories (slug, name_fr, name_en, name_ar, description_fr, description_en, description_ar)
VALUES (
  'entrepot-logistique',
  'Entrepôt / Logistique',
  'Warehouse / Logistics',
  'مستودع / لوجستيات',
  'Entrepôts, plateformes logistiques, zones de stockage',
  'Warehouses, logistics platforms, storage areas',
  'المستودعات، منصات الخدمات اللوجستية، مناطق التخزين'
)
ON CONFLICT (slug) DO UPDATE
SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar;

-- Catégorie 2: Bureau
INSERT INTO public.categories (slug, name_fr, name_en, name_ar, description_fr, description_en, description_ar)
VALUES (
  'bureau',
  'Bureau',
  'Office',
  'مكتب',
  'Bureaux, espaces de travail, open space',
  'Offices, workspaces, open space',
  'المكاتب، مساحات العمل، المساحات المفتوحة'
)
ON CONFLICT (slug) DO UPDATE
SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar;

-- Catégorie 3: Usine / Production
INSERT INTO public.categories (slug, name_fr, name_en, name_ar, description_fr, description_en, description_ar)
VALUES (
  'usine-production',
  'Usine / Production',
  'Factory / Production',
  'مصنع / إنتاج',
  'Usines, ateliers de production, zones industrielles',
  'Factories, production workshops, industrial areas',
  'المصانع، ورش الإنتاج، المناطق الصناعية'
)
ON CONFLICT (slug) DO UPDATE
SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar;

-- Catégorie 4: Commerce / Retail
INSERT INTO public.categories (slug, name_fr, name_en, name_ar, description_fr, description_en, description_ar)
VALUES (
  'commerce-retail',
  'Commerce / Retail',
  'Commerce / Retail',
  'تجارة / بيع بالتجزئة',
  'Commerces, surfaces de vente, magasins',
  'Stores, retail spaces, shops',
  'المتاجر، مساحات البيع بالتجزئة، المحلات'
)
ON CONFLICT (slug) DO UPDATE
SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar;

-- Catégorie 5: Autre
INSERT INTO public.categories (slug, name_fr, name_en, name_ar, description_fr, description_en, description_ar)
VALUES (
  'autre-batiment',
  'Autre',
  'Other',
  'آخر',
  'Autre type de bâtiment',
  'Other building type',
  'نوع مبنى آخر'
)
ON CONFLICT (slug) DO UPDATE
SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar;

-- Commentaires pour documentation
COMMENT ON TABLE public.categories IS 'Catégories de projets Effinor (luminaire, ventilation, IRVE, étude) et types de bâtiments (entrepôt, bureau, usine, commerce, autre)';



