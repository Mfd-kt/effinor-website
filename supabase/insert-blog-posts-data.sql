-- Insertion des données dans la table blog_posts
-- Note: Assurez-vous que l'author_id existe dans auth.users ou remplacez-le par un ID valide

-- Article 1: Certificats d'Économies d'Énergie (CEE)
INSERT INTO public.blog_posts (
  id,
  created_at,
  updated_at,
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  status,
  published_at,
  author_id,
  seo_title,
  seo_description,
  tags,
  category_id,
  seo_og_image_url
) VALUES (
  '44e7f32a-1ef8-4b3c-ab5a-1c04f741158e',
  '2025-12-02 16:33:59.110366+00',
  NULL,
  'Certificats d''Économies d''Énergie (CEE) : Guide complet',
  'certificats-economies-energie-cee-guide',
  'Tout ce que vous devez savoir sur les CEE : fonctionnement, éligibilité, montants et démarches pour bénéficier de ces aides financières.',
  '# Certificats d''Économies d''Énergie (CEE) : Guide complet

Les Certificats d''Économies d''Énergie sont un dispositif mis en place par l''État pour encourager les économies d''énergie. Voici comment en bénéficier.

## Qu''est-ce qu''un CEE ?

Les CEE sont des aides financières accordées pour la réalisation de travaux d''économie d''énergie. Ils sont financés par les fournisseurs d''énergie (obligés) et reversés aux particuliers et entreprises.

## Types d''opérations éligibles

### Éclairage LED
- Remplacement d''éclairage par des LED
- Montant : jusqu''à 50€ par m² de surface éclairée

### Chauffage
- Installation de pompes à chaleur
- Isolation thermique
- Remplacement de chaudière

### Autres opérations
- Ventilation performante
- Déshumidification
- Destratification

## Montants des primes CEE

Les montants varient selon :
- Le type d''opération
- La zone géographique
- La surface concernée
- Le type de bâtiment

## Comment bénéficier des CEE ?

1. **Choisir une opération éligible**
2. **Faire réaliser les travaux** par un professionnel RGE
3. **Déclarer les travaux** et recevoir la prime

## Conclusion

Les CEE représentent une opportunité financière importante pour réduire vos coûts énergétiques tout en améliorant votre confort.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
  'published',
  '2025-11-29 16:33:59.110366+00',
  '4e39a1dc-deef-4584-aabb-3e724120db7c',
  'CEE : Guide complet des Certificats d''Économies d''Énergie | Effinor',
  'Guide complet sur les Certificats d''Économies d''Énergie : fonctionnement, éligibilité, montants et démarches pour bénéficier des primes CEE.',
  ARRAY['CEE', 'Aides financières', 'Économies d''énergie', 'Prime énergie'],
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  updated_at = NOW();

-- Article 2: Pompes à chaleur
INSERT INTO public.blog_posts (
  id,
  created_at,
  updated_at,
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  status,
  published_at,
  author_id,
  seo_title,
  seo_description,
  tags,
  category_id,
  seo_og_image_url
) VALUES (
  '4ad98fcc-6dd7-4f73-a800-035da06a6370',
  '2025-12-02 16:33:59.110366+00',
  NULL,
  'Pompes à chaleur : l''avenir du chauffage écologique',
  'pompes-chaleur-avenir-chauffage-ecologique',
  'Les pompes à chaleur représentent la solution de chauffage la plus performante et écologique pour les entreprises. Découvrez leurs avantages.',
  '# Pompes à chaleur : l''avenir du chauffage écologique

Les pompes à chaleur (PAC) sont devenues la référence en matière de chauffage performant et écologique pour les entreprises.

## Comment fonctionne une pompe à chaleur ?

Une PAC prélève les calories présentes dans l''air extérieur (aérothermie) ou dans le sol (géothermie) pour chauffer votre bâtiment. Elle fonctionne comme un réfrigérateur inversé.

## Avantages des pompes à chaleur

### Performance énergétique
- **COP élevé** : 3 à 5 (1 kWh d''électricité = 3 à 5 kWh de chaleur)
- **Économies** : 60 à 70% sur la facture de chauffage
- **Éligible CEE** : Primes importantes disponibles

### Écologie
- **Énergie renouvelable** : Utilise les calories de l''air ou du sol
- **Faible émission CO2** : Réduction de l''empreinte carbone
- **Durabilité** : Durée de vie de 15 à 20 ans

### Polyvalence
- **Chauffage** : En hiver
- **Rafraîchissement** : En été (modèles réversibles)
- **Eau chaude sanitaire** : Production possible

## Types de pompes à chaleur

### Aérothermique
- **Avantage** : Installation simple, coût modéré
- **Inconvénient** : Performance réduite en cas de grand froid

### Géothermique
- **Avantage** : Performance constante toute l''année
- **Inconvénient** : Installation plus complexe, coût plus élevé

## Retour sur investissement

Avec les primes CEE et les économies d''énergie, l''investissement est rentabilisé en 5 à 8 ans.

## Conclusion

Les pompes à chaleur représentent l''investissement idéal pour un chauffage performant, économique et écologique.',
  'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200',
  'published',
  '2025-12-01 16:33:59.110366+00',
  '4e39a1dc-deef-4584-aabb-3e724120db7c',
  'Pompes à chaleur : chauffage écologique et performant | Effinor',
  'Découvrez les avantages des pompes à chaleur pour votre entreprise : performance énergétique, économies et écologie. Guide complet.',
  ARRAY['Pompe à chaleur', 'Chauffage', 'Écologie', 'Performance énergétique', 'CEE'],
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  updated_at = NOW();

-- Article 3: Destratification
INSERT INTO public.blog_posts (
  id,
  created_at,
  updated_at,
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  status,
  published_at,
  author_id,
  seo_title,
  seo_description,
  tags,
  category_id,
  seo_og_image_url
) VALUES (
  '9b505af6-dc78-4f2a-8987-479eee0e4d13',
  '2025-12-02 16:33:59.110366+00',
  '2025-12-02 16:35:29.643037+00',
  'La destratification : solution pour réduire vos coûts de chauffage',
  'destratification-reduire-couts-chauffage',
  'La destratification permet de répartir uniformément la chaleur dans vos locaux et de réduire significativement vos factures de chauffage.',
  '# La destratification : solution pour réduire vos coûts de chauffage

Dans les bâtiments à hauteur sous plafond importante, la chaleur a tendance à monter et à se concentrer en hauteur. La destratification résout ce problème.

## Le problème de la stratification

Dans un local de 6 mètres de hauteur :
- **Température au sol** : 18°C
- **Température à 3 mètres** : 22°C
- **Température au plafond** : 28°C

Résultat : vous chauffez le plafond au lieu de chauffer l''espace de travail !

## La solution : destratification

Les ventilateurs de destratification brassent l''air chaud du plafond vers le sol, créant une température uniforme dans tout le volume.

### Avantages

- **Économies** : 20 à 30% sur la facture de chauffage
- **Confort** : Température uniforme dans tout le local
- **Rapidité** : Installation simple et rapide
- **CEE** : Éligible aux Certificats d''Économies d''Énergie

## Retour sur investissement

L''investissement est généralement rentabilisé en moins de 2 ans grâce aux économies d''énergie réalisées.

## Conclusion

La destratification est une solution simple et efficace pour réduire vos coûts de chauffage tout en améliorant le confort de vos équipes.',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200',
  'published',
  '2025-12-02 16:35:29.48+00',
  '4e39a1dc-deef-4584-aabb-3e724120db7c',
  'Destratification : réduire les coûts de chauffage | Effinor',
  'Découvrez comment la destratification peut réduire vos coûts de chauffage de 20 à 30% en répartissant uniformément la chaleur dans vos locaux.',
  ARRAY['Destratification', 'Chauffage', 'Économies d''énergie', 'Confort thermique'],
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  updated_at = EXCLUDED.updated_at;

-- Article 4: Éclairage LED
INSERT INTO public.blog_posts (
  id,
  created_at,
  updated_at,
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  status,
  published_at,
  author_id,
  seo_title,
  seo_description,
  tags,
  category_id,
  seo_og_image_url
) VALUES (
  'f3bae67c-5399-4046-9cb5-795ab752b0df',
  '2025-12-02 16:33:59.110366+00',
  '2025-12-03 15:10:17.69743+00',
  'Les avantages de l''éclairage LED pour les entreprises',
  'avantages-eclairage-led-entreprises',
  'Découvrez pourquoi l''éclairage LED est devenu la solution incontournable pour réduire les coûts énergétiques et améliorer le confort de travail dans les entreprises.',
  '# Les avantages de l''éclairage LED pour les entreprises

L''éclairage LED révolutionne le monde de l''entreprise en offrant des solutions performantes, économiques et écologiques. Voici pourquoi vous devriez envisager de passer aux LED.

## Économies d''énergie significatives

Les LED consomment jusqu''à 80% d''énergie en moins que les ampoules traditionnelles. Pour une entreprise avec 1000 points lumineux, cela peut représenter plusieurs milliers d''euros d''économies par an.

### Calcul des économies

- **Consommation réduite** : 80% d''économie par rapport aux halogènes
- **Durée de vie** : 50 000 heures contre 2 000 heures pour les halogènes
- **Maintenance** : Réduction drastique des coûts de remplacement

## Qualité de l''éclairage

Les LED offrent une qualité de lumière supérieure :

- **Indice de rendu des couleurs (IRC)** : > 80 pour un éclairage naturel
- **Température de couleur** : Adaptable selon les besoins (blanc chaud, blanc froid)
- **Absence de scintillement** : Réduction de la fatigue visuelle

## Retour sur investissement

L''investissement dans l''éclairage LED est généralement rentabilisé en moins de 3 ans grâce aux économies d''énergie et à la réduction des coûts de maintenance.

## Conclusion

Passer aux LED est un investissement intelligent qui allie performance, économies et respect de l''environnement.',
  'https://erjgptxkctrfszrzhoxa.supabase.co/storage/v1/object/public/effinor-assets/blog/1764774613714-71fg1wzm2wl_ac_sl1500_jpg',
  'published',
  '2025-11-27 16:33:59.110366+00',
  '4e39a1dc-deef-4584-aabb-3e724120db7c',
  'Éclairage LED entreprise : économies et performance | Effinor',
  'Découvrez tous les avantages de l''éclairage LED pour votre entreprise : économies d''énergie, qualité d''éclairage et retour sur investissement rapide.',
  ARRAY['LED', 'Éclairage', 'Économies d''énergie', 'Entreprise'],
  NULL,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  updated_at = EXCLUDED.updated_at;

