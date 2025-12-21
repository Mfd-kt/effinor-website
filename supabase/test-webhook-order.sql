-- Script SQL pour créer une commande de test et déclencher le webhook
-- Note: Le webhook sera déclenché automatiquement si vous créez la commande depuis le Dashboard
-- Ce script crée juste la commande en base pour tester

-- Étape 1: Créer une commande de test
DO $$
DECLARE
  test_order_id UUID;
  test_product_id UUID;
BEGIN
  -- Générer un ID pour la commande
  test_order_id := gen_random_uuid();
  
  -- Récupérer un produit existant (ou utiliser un UUID de référence)
  SELECT id INTO test_product_id 
  FROM products 
  WHERE is_active = true 
  LIMIT 1;
  
  -- Si aucun produit n'existe, créer un UUID de référence
  IF test_product_id IS NULL THEN
    test_product_id := gen_random_uuid();
  END IF;

  -- Insérer la commande de test
  INSERT INTO public.orders (
    id,
    created_at,
    lang,
    customer_name,
    customer_email,
    customer_phone,
    customer_company,
    delivery_address,
    delivery_address_2,
    delivery_postcode,
    delivery_city,
    delivery_country,
    order_type,
    payment_status,
    fulfillment_status,
    has_quote_items,
    currency,
    total_ht,
    payment_method,
    paid_at,
    notes,
    cart_snapshot,
    status
  ) VALUES (
    test_order_id,
    NOW(),
    'fr',
    'Client Test Webhook',
    'test.webhook@example.com',
    '0612345678',
    'Entreprise Test',
    '123 Rue de Test',
    NULL,
    '75001',
    'Paris',
    'FR',
    'paid',
    'paid',
    'to_ship',
    false,
    'EUR',
    1500.00,
    'card',
    NOW(),
    'Commande de test pour vérifier le webhook Make.com',
    '[]'::jsonb,
    'completed'
  );

  -- Créer un item pour cette commande
  INSERT INTO public.order_items (
    id,
    order_id,
    product_id,
    sku,
    name,
    quantity,
    unit_price_ht,
    currency,
    is_quote_only,
    line_total_ht
  ) VALUES (
    gen_random_uuid(),
    test_order_id,
    test_product_id,
    'TEST-SKU-001',
    'Produit de test pour webhook',
    2,
    750.00,
    'EUR',
    false,
    1500.00
  );

  -- Afficher l'ID de la commande créée
  RAISE NOTICE 'Commande de test créée avec l''ID: %', test_order_id;
  RAISE NOTICE 'Numéro de commande: CMD-%', UPPER(SUBSTRING(test_order_id::TEXT, 1, 8));
  RAISE NOTICE '';
  RAISE NOTICE 'Pour déclencher le webhook, créez une commande depuis le Dashboard:';
  RAISE NOTICE '/admin/commandes/new';
  RAISE NOTICE '';
  RAISE NOTICE 'Ou utilisez cette commande pour voir les détails:';
  RAISE NOTICE 'SELECT * FROM orders WHERE id = ''%'';', test_order_id;

END $$;

-- Vérifier la commande créée
SELECT 
  id,
  'CMD-' || UPPER(SUBSTRING(id::TEXT, 1, 8)) as order_number,
  customer_name,
  customer_email,
  total_ht,
  payment_status,
  created_at
FROM orders
WHERE customer_email = 'test.webhook@example.com'
ORDER BY created_at DESC
LIMIT 1;

