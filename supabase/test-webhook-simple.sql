-- Script SQL simple pour créer une commande de test
-- Exécutez ce script dans le SQL Editor de Supabase pour créer une commande de test

-- IMPORTANT: Le webhook sera déclenché uniquement si vous créez la commande depuis le Dashboard
-- Ce script crée juste la commande en base pour tester la structure

WITH new_order AS (
  INSERT INTO public.orders (
    id,
    created_at,
    lang,
    customer_name,
    customer_email,
    customer_phone,
    customer_company,
    delivery_address,
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
    gen_random_uuid(),
    NOW(),
    'fr',
    'Test Webhook',
    'test.webhook@example.com',
    '0612345678',
    'Entreprise Test',
    '123 Rue Test',
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
    'Commande de test pour webhook Make.com',
    '[]'::jsonb,
    'completed'
  )
  RETURNING id, customer_name, total_ht
)
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
)
SELECT
  gen_random_uuid(),
  new_order.id,
  COALESCE((SELECT id FROM products WHERE is_active = true LIMIT 1), gen_random_uuid()),
  'TEST-SKU',
  'Produit Test Webhook',
  2,
  750.00,
  'EUR',
  false,
  1500.00
FROM new_order;

-- Afficher la commande créée
SELECT 
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

-- Note importante:
-- Pour déclencher le webhook, créez la commande depuis le Dashboard: /admin/commandes/new
-- Le webhook est déclenché depuis le code JavaScript, pas depuis SQL

