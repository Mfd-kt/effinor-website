-- Script pour insérer 20 commandes de test dans la table orders
-- Basé sur la structure du schéma orders et order_items

-- Note: Ce script utilise des UUIDs générés aléatoirement pour les produits
-- Si vous avez des produits existants, remplacez les product_id par les vrais IDs

-- Étape 1: Créer les commandes
-- Les commandes seront créées avec des dates variées (derniers 30 jours)
INSERT INTO public.orders (
  id, created_at, lang, customer_name, customer_email, customer_phone, customer_company,
  delivery_address, delivery_address_2, delivery_postcode, delivery_city, delivery_country,
  order_type, payment_status, fulfillment_status, has_quote_items,
  currency, total_ht, payment_method, paid_at, notes, cart_snapshot, status
) VALUES
  -- Commande 1: Devis en attente
  (
    gen_random_uuid(),
    NOW() - INTERVAL '25 days',
    'fr',
    'Jean Dupont',
    'jean.dupont@example.com',
    '0612345678',
    'Dupont Industries',
    '123 Rue de la République',
    NULL,
    '75001',
    'Paris',
    'FR',
    'quote',
    'quote',
    'to_confirm',
    true,
    'EUR',
    2500.00,
    NULL,
    NULL,
    'Client intéressé par éclairage LED pour entrepôt',
    '[]'::jsonb,
    'pending'
  ),
  -- Commande 2: Commande payée, à expédier
  (
    gen_random_uuid(),
    NOW() - INTERVAL '20 days',
    'fr',
    'Marie Martin',
    'marie.martin@techcorp.fr',
    '0623456789',
    'TechCorp',
    '45 Avenue des Champs-Élysées',
    'Bureau 301',
    '75008',
    'Paris',
    'FR',
    'paid',
    'paid',
    'to_ship',
    false,
    'EUR',
    1850.50,
    'card',
    NOW() - INTERVAL '20 days',
    'Commande urgente, expédition prioritaire',
    '[]'::jsonb,
    'completed'
  ),
  -- Commande 3: Commande en traitement
  (
    gen_random_uuid(),
    NOW() - INTERVAL '18 days',
    'fr',
    'Pierre Bernard',
    'p.bernard@manufacturing.com',
    '0634567890',
    'Manufacturing SA',
    '78 Boulevard Saint-Germain',
    NULL,
    '75005',
    'Paris',
    'FR',
    'paid',
    'pending',
    'to_ship',
    false,
    'EUR',
    3200.00,
    'transfer',
    NULL,
    'En attente de virement bancaire',
    '[]'::jsonb,
    'processing'
  ),
  -- Commande 4: Devis qualifié
  (
    gen_random_uuid(),
    NOW() - INTERVAL '15 days',
    'fr',
    'Sophie Leroy',
    'sophie.leroy@retail.fr',
    '0645678901',
    'Retail Solutions',
    '12 Place de la Bastille',
    NULL,
    '75011',
    'Paris',
    'FR',
    'quote',
    'quote',
    'to_confirm',
    true,
    'EUR',
    4500.75,
    NULL,
    NULL,
    'Grand projet de rénovation',
    '[]'::jsonb,
    'pending'
  ),
  -- Commande 5: Commande expédiée
  (
    gen_random_uuid(),
    NOW() - INTERVAL '12 days',
    'fr',
    'Thomas Moreau',
    't.moreau@logistics.fr',
    '0656789012',
    'Logistics Pro',
    '56 Rue de Rivoli',
    NULL,
    '75004',
    'Paris',
    'FR',
    'paid',
    'paid',
    'shipped',
    false,
    'EUR',
    980.25,
    'card',
    NOW() - INTERVAL '12 days',
    'Expédiée le 12/12/2024',
    '[]'::jsonb,
    'completed'
  ),
  -- Commande 6: Commande annulée
  (
    gen_random_uuid(),
    NOW() - INTERVAL '10 days',
    'fr',
    'Camille Dubois',
    'camille.dubois@hospital.fr',
    '0667890123',
    'Hôpital Saint-Martin',
    '89 Avenue de la Grande Armée',
    NULL,
    '75016',
    'Paris',
    'FR',
    'paid',
    'failed',
    'cancelled',
    false,
    'EUR',
    1500.00,
    'card',
    NULL,
    'Paiement refusé, commande annulée',
    '[]'::jsonb,
    'cancelled'
  ),
  -- Commande 7: Devis en anglais
  (
    gen_random_uuid(),
    NOW() - INTERVAL '8 days',
    'en',
    'John Smith',
    'john.smith@international.com',
    '+33123456789',
    'International Corp',
    '100 Main Street',
    'Suite 200',
    '10001',
    'New York',
    'US',
    'quote',
    'quote',
    'to_confirm',
    true,
    'USD',
    3500.00,
    NULL,
    NULL,
    'International client, English speaking',
    '[]'::jsonb,
    'pending'
  ),
  -- Commande 8: Commande mixte (devis + payé)
  (
    gen_random_uuid(),
    NOW() - INTERVAL '7 days',
    'fr',
    'Laurent Petit',
    'laurent.petit@construction.fr',
    '0678901234',
    'Construction Plus',
    '34 Rue du Faubourg Saint-Antoine',
    NULL,
    '75012',
    'Paris',
    'FR',
    'paid',
    'paid',
    'to_ship',
    true,
    'EUR',
    5200.00,
    'transfer',
    NOW() - INTERVAL '7 days',
    'Commande mixte avec produits sur devis',
    '[]'::jsonb,
    'completed'
  ),
  -- Commande 9: Commande récente
  (
    gen_random_uuid(),
    NOW() - INTERVAL '5 days',
    'fr',
    'Isabelle Rousseau',
    'isabelle.rousseau@energy.fr',
    '0689012345',
    'Energy Solutions',
    '67 Boulevard Haussmann',
    NULL,
    '75009',
    'Paris',
    'FR',
    'paid',
    'paid',
    'to_ship',
    false,
    'EUR',
    2100.00,
    'card',
    NOW() - INTERVAL '5 days',
    NULL,
    '[]'::jsonb,
    'completed'
  ),
  -- Commande 10: Devis en attente de réponse
  (
    gen_random_uuid(),
    NOW() - INTERVAL '4 days',
    'fr',
    'Marc Lefebvre',
    'marc.lefebvre@automotive.fr',
    '0690123456',
    'Automotive Group',
    '23 Rue de la Paix',
    NULL,
    '75002',
    'Paris',
    'FR',
    'quote',
    'quote',
    'to_confirm',
    false,
    'EUR',
    1800.50,
    NULL,
    NULL,
    'Devis à valider par le client',
    '[]'::jsonb,
    'pending'
  ),
  -- Commande 11: Commande urgente
  (
    gen_random_uuid(),
    NOW() - INTERVAL '3 days',
    'fr',
    'Nathalie Girard',
    'nathalie.girard@retail.fr',
    '0601234567',
    'Retail Chain',
    '45 Rue de Vaugirard',
    NULL,
    '75006',
    'Paris',
    'FR',
    'paid',
    'paid',
    'to_ship',
    false,
    'EUR',
    750.00,
    'card',
    NOW() - INTERVAL '3 days',
    'URGENT - Expédition express demandée',
    '[]'::jsonb,
    'completed'
  ),
  -- Commande 12: Commande en arabe
  (
    gen_random_uuid(),
    NOW() - INTERVAL '2 days',
    'ar',
    'أحمد الخالدي',
    'ahmed.khalidi@middleeast.com',
    '+33198765432',
    'Middle East Trading',
    'شارع الحمراء',
    NULL,
    '75007',
    'Paris',
    'FR',
    'quote',
    'quote',
    'to_confirm',
    true,
    'EUR',
    2800.00,
    NULL,
    NULL,
    'Client du Moyen-Orient',
    '[]'::jsonb,
    'pending'
  ),
  -- Commande 13: Commande avec remboursement
  (
    gen_random_uuid(),
    NOW() - INTERVAL '14 days',
    'fr',
    'Claire Moreau',
    'claire.moreau@services.fr',
    '0612345678',
    'Services Pro',
    '12 Rue de la Sorbonne',
    NULL,
    '75005',
    'Paris',
    'FR',
    'paid',
    'refunded',
    'cancelled',
    false,
    'EUR',
    1200.00,
    'card',
    NOW() - INTERVAL '14 days',
    'Produit défectueux, remboursement effectué',
    '[]'::jsonb,
    'cancelled'
  ),
  -- Commande 14: Grande commande
  (
    gen_random_uuid(),
    NOW() - INTERVAL '6 days',
    'fr',
    'François Dubois',
    'francois.dubois@industry.fr',
    '0623456789',
    'Industry Group',
    '89 Avenue de la République',
    'Bâtiment B',
    '75011',
    'Paris',
    'FR',
    'paid',
    'paid',
    'shipped',
    false,
    'EUR',
    8500.00,
    'transfer',
    NOW() - INTERVAL '6 days',
    'Grande commande pour installation complète',
    '[]'::jsonb,
    'completed'
  ),
  -- Commande 15: Commande en attente de confirmation
  (
    gen_random_uuid(),
    NOW() - INTERVAL '1 day',
    'fr',
    'Émilie Rousseau',
    'emilie.rousseau@business.fr',
    '0634567890',
    'Business Solutions',
    '34 Rue Montmartre',
    NULL,
    '75002',
    'Paris',
    'FR',
    'quote',
    'quote',
    'to_confirm',
    false,
    'EUR',
    1650.00,
    NULL,
    NULL,
    'En attente de validation client',
    '[]'::jsonb,
    'pending'
  ),
  -- Commande 16: Commande internationale USD
  (
    gen_random_uuid(),
    NOW() - INTERVAL '9 days',
    'en',
    'Robert Johnson',
    'robert.johnson@global.com',
    '+33123456789',
    'Global Enterprises',
    '200 Park Avenue',
    'Floor 15',
    '10017',
    'New York',
    'US',
    'paid',
    'paid',
    'shipped',
    false,
    'USD',
    4200.00,
    'card',
    NOW() - INTERVAL '9 days',
    'International order, USD currency',
    '[]'::jsonb,
    'completed'
  ),
  -- Commande 17: Commande avec échec de paiement
  (
    gen_random_uuid(),
    NOW() - INTERVAL '11 days',
    'fr',
    'Sylvie Martin',
    'sylvie.martin@commerce.fr',
    '0645678901',
    'Commerce Plus',
    '56 Rue du Commerce',
    NULL,
    '75015',
    'Paris',
    'FR',
    'paid',
    'failed',
    'cancelled',
    false,
    'EUR',
    950.00,
    'card',
    NULL,
    'Carte bancaire refusée',
    '[]'::jsonb,
    'cancelled'
  ),
  -- Commande 18: Commande récente payée
  (
    gen_random_uuid(),
    NOW() - INTERVAL '6 hours',
    'fr',
    'David Leroy',
    'david.leroy@tech.fr',
    '0656789012',
    'Tech Innovations',
    '78 Rue de la Technologie',
    NULL,
    '75013',
    'Paris',
    'FR',
    'paid',
    'paid',
    'to_ship',
    false,
    'EUR',
    1350.75,
    'card',
    NOW() - INTERVAL '6 hours',
    'Commande récente',
    '[]'::jsonb,
    'completed'
  ),
  -- Commande 19: Devis complexe
  (
    gen_random_uuid(),
    NOW() - INTERVAL '13 days',
    'fr',
    'Patricia Bernard',
    'patricia.bernard@complex.fr',
    '0667890123',
    'Complex Systems',
    '23 Boulevard Voltaire',
    NULL,
    '75011',
    'Paris',
    'FR',
    'quote',
    'quote',
    'to_confirm',
    true,
    'EUR',
    6800.50,
    NULL,
    NULL,
    'Devis complexe avec plusieurs produits sur devis',
    '[]'::jsonb,
    'pending'
  ),
  -- Commande 20: Commande aujourd'hui
  (
    gen_random_uuid(),
    NOW() - INTERVAL '2 hours',
    'fr',
    'Michel Durand',
    'michel.durand@client.fr',
    '0678901234',
    'Client Direct',
    '45 Avenue de la Grande Armée',
    NULL,
    '75016',
    'Paris',
    'FR',
    'paid',
    'paid',
    'to_confirm',
    false,
    'EUR',
    550.00,
    'card',
    NOW() - INTERVAL '2 hours',
    'Commande passée aujourd''hui',
    '[]'::jsonb,
    'processing'
  );

-- Étape 2: Créer les items pour chaque commande
-- Le script utilise les produits existants s'ils sont disponibles, sinon génère des UUIDs de référence

DO $$
DECLARE
  order_rec RECORD;
  product_ids UUID[];
  selected_product_id UUID;
  product_name TEXT;
  product_sku TEXT;
  item_count INTEGER;
  i INTEGER;
  line_total NUMERIC;
  order_total NUMERIC;
  product_count INTEGER;
BEGIN
  -- Récupérer les IDs des produits existants
  SELECT ARRAY_AGG(id), COUNT(*) INTO product_ids, product_count
  FROM (
    SELECT id FROM products WHERE is_active = true LIMIT 20
  ) sub;

  -- Si aucun produit n'existe, créer des UUIDs de référence
  IF product_count = 0 OR product_ids IS NULL THEN
    product_ids := ARRAY(
      SELECT gen_random_uuid() FROM generate_series(1, 10)
    );
  END IF;

  -- Parcourir les commandes créées dans l'ordre (les 20 dernières créées)
  FOR order_rec IN 
    SELECT id, total_ht, payment_status, order_type, has_quote_items, lang
    FROM public.orders
    WHERE created_at >= NOW() - INTERVAL '30 days'
    ORDER BY created_at DESC
    LIMIT 20
  LOOP
    -- Déterminer le nombre d'items (1-3)
    item_count := 1 + floor(random() * 3)::INTEGER;
    order_total := 0;

    -- Créer les items
    FOR i IN 1..item_count LOOP
      -- Sélectionner un produit aléatoire
      selected_product_id := product_ids[1 + floor(random() * array_length(product_ids, 1))::INTEGER];
      
      -- Essayer de récupérer le nom et SKU du produit depuis la base
      SELECT pt.name, p.sku INTO product_name, product_sku
      FROM products p
      LEFT JOIN product_translations pt ON pt.product_id = p.id AND pt.lang = order_rec.lang
      WHERE p.id = selected_product_id
      LIMIT 1;

      -- Si le produit n'existe pas dans la base, utiliser des valeurs par défaut
      IF product_name IS NULL THEN
        product_name := 'Produit ' || i || ' - Commande ' || SUBSTRING(order_rec.id::TEXT, 1, 8);
        product_sku := 'SKU-' || LPAD(floor(random() * 10000)::TEXT, 5, '0');
      END IF;

      -- Générer un prix unitaire (50-2000€)
      DECLARE
        unit_price NUMERIC;
        quantity INTEGER;
        is_quote BOOLEAN;
      BEGIN
        unit_price := 50 + (random() * 1950);
        quantity := 1 + floor(random() * 5)::INTEGER;
        is_quote := order_rec.has_quote_items AND (random() < 0.5);
        line_total := unit_price * quantity;
        order_total := order_total + line_total;

        -- Insérer l'item
        INSERT INTO public.order_items (
          id, order_id, product_id, sku, name, quantity,
          unit_price_ht, currency, is_quote_only, line_total_ht
        ) VALUES (
          gen_random_uuid(),
          order_rec.id,
          selected_product_id,
          COALESCE(product_sku, 'SKU-' || LPAD(floor(random() * 10000)::TEXT, 5, '0')),
          product_name,
          quantity,
          unit_price,
          'EUR',
          is_quote,
          line_total
        );
      END;
    END LOOP;

    -- Mettre à jour le total_ht de la commande avec le total réel
    UPDATE public.orders
    SET total_ht = order_total
    WHERE id = order_rec.id;
  END LOOP;
END $$;

-- Note importante:
-- Ce script utilise automatiquement les produits existants dans votre table products.
-- Si aucun produit n'existe, il génère des UUIDs de référence et des noms génériques.
-- 
-- Pour vérifier que les commandes ont été créées correctement:
-- SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days';
-- 
-- Pour vérifier les items:
-- SELECT o.order_number, oi.name, oi.quantity, oi.unit_price_ht, oi.line_total_ht
-- FROM orders o
-- JOIN order_items oi ON oi.order_id = o.id
-- WHERE o.created_at >= NOW() - INTERVAL '30 days'
-- ORDER BY o.created_at DESC;

