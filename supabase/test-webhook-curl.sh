#!/bin/bash

# Script pour tester le webhook Make.com directement avec curl
# Usage: bash supabase/test-webhook-curl.sh

WEBHOOK_URL="https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj"

echo "🧪 Test du webhook Make.com"
echo "URL: $WEBHOOK_URL"
echo ""

# Test 1: Commande complète
echo "📦 Test 1: Notification de commande (données complètes)"
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Effinor-Dashboard-Test/1.0" \
  -d '{
    "event": "new_order",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
    "data": {
      "orderId": "test-order-'$(date +%s)'",
      "orderNumber": "CMD-TEST001",
      "customerName": "Jean Dupont",
      "customerEmail": "jean.dupont@example.com",
      "customerPhone": "0612345678",
      "customerCompany": "Entreprise Test SARL",
      "amount": 2500.50,
      "currency": "EUR",
      "orderType": "paid",
      "paymentStatus": "paid",
      "fulfillmentStatus": "to_ship",
      "paymentMethod": "card",
      "paidAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
      "itemCount": 2,
      "items": [
        {
          "id": "item-1",
          "productId": "prod-1",
          "productName": "Luminaire LED 150W",
          "quantity": 2,
          "unitPrice": 750.00,
          "total": 1500.00,
          "isQuoteOnly": false
        },
        {
          "id": "item-2",
          "productId": "prod-2",
          "productName": "Borne de recharge IRVE 11kW",
          "quantity": 1,
          "unitPrice": 1000.50,
          "total": 1000.50,
          "isQuoteOnly": false
        }
      ],
      "shippingAddress": {
        "street": "123 Rue de la République",
        "street2": "Bureau 301",
        "city": "Paris",
        "zipCode": "75001",
        "country": "FR"
      },
      "notes": "Commande urgente, expédition prioritaire",
      "hasQuoteItems": false,
      "createdAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
      "dashboardUrl": "http://localhost:3001/admin/commandes/test-order-123"
    }
  }' \
  -w "\n\nStatus: %{http_code}\n" \
  -v

echo ""
echo "⏳ Attente de 2 secondes..."
sleep 2
echo ""

# Test 2: Lead complet
echo "📧 Test 2: Notification de lead (données complètes)"
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Effinor-Dashboard-Test/1.0" \
  -d '{
    "event": "new_lead",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
    "data": {
      "leadId": "test-lead-'$(date +%s)'",
      "fullName": "Marie Martin",
      "firstName": "Marie",
      "lastName": "Martin",
      "email": "marie.martin@example.com",
      "phone": "0623456789",
      "company": "TechCorp Solutions",
      "source": "website",
      "status": "new",
      "message": "Bonjour, je suis intéressée par vos solutions d'\''éclairage LED pour notre nouveau bureau de 500m². Pouvez-vous me faire un devis ?",
      "solution": "lighting",
      "categoryId": "cat-123",
      "categoryName": "Éclairage professionnel LED",
      "page": "/fr/contact",
      "origin": "contact_page_form",
      "utmSource": "google",
      "utmMedium": "cpc",
      "utmCampaign": "led_campaign_2024",
      "utmTerm": "éclairage led professionnel",
      "utmContent": "ad_variant_1",
      "gclid": "CjwKCAjw...",
      "lang": "fr",
      "createdAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
      "dashboardUrl": "http://localhost:3001/admin/leads/test-lead-123"
    }
  }' \
  -w "\n\nStatus: %{http_code}\n" \
  -v

echo ""
echo "✨ Tests terminés"
echo "Vérifiez Make.com pour voir si les webhooks ont été reçus"



