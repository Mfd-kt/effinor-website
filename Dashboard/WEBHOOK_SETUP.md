# Configuration Webhook Make.com pour Notifications Slack

## Vue d'ensemble

Le système envoie automatiquement des webhooks vers Make.com lorsqu'une nouvelle commande ou un nouveau lead est créé. Make.com reçoit ces webhooks et peut ensuite notifier l'équipe via Slack.

## Configuration

### 1. Variables d'environnement

Ajoutez l'URL du webhook Make.com dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj
```

### 2. Format des données webhook

#### Nouvelle commande (`new_order`) - DONNÉES COMPLÈTES

```json
{
  "event": "new_order",
  "timestamp": "2024-12-20T20:00:00.000Z",
  "data": {
    "orderId": "uuid-de-la-commande",
    "orderNumber": "CMD-12345678",
    "customerName": "Jean Dupont",
    "customerEmail": "jean@example.com",
    "customerPhone": "0612345678",
    "customerCompany": "Entreprise XYZ",
    "amount": 2500.50,
    "currency": "EUR",
    "orderType": "paid",
    "paymentStatus": "paid",
    "fulfillmentStatus": "to_ship",
    "paymentMethod": "card",
    "paidAt": "2024-12-20T20:00:00.000Z",
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
        "productName": "Borne de recharge IRVE",
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
    "notes": "Commande urgente",
    "hasQuoteItems": false,
    "createdAt": "2024-12-20T20:00:00.000Z",
    "dashboardUrl": "http://localhost:3001/admin/commandes/uuid"
  }
}
```

#### Nouveau lead (`new_lead`) - DONNÉES COMPLÈTES

```json
{
  "event": "new_lead",
  "timestamp": "2024-12-20T20:00:00.000Z",
  "data": {
    "leadId": "uuid-du-lead",
    "fullName": "Marie Martin",
    "firstName": "Marie",
    "lastName": "Martin",
    "email": "marie@example.com",
    "phone": "0623456789",
    "company": "TechCorp",
    "source": "website",
    "status": "new",
    "message": "Message du lead...",
    "solution": "lighting",
    "categoryId": "cat-123",
    "categoryName": "Éclairage professionnel LED",
    "page": "/fr/contact",
    "origin": "contact_page_form",
    "utmSource": "google",
    "utmMedium": "cpc",
    "utmCampaign": "led_campaign_2024",
    "utmTerm": "éclairage led",
    "utmContent": "ad_variant_1",
    "gclid": "CjwKCAjw...",
    "fbclid": null,
    "lang": "fr",
    "createdAt": "2024-12-20T20:00:00.000Z",
    "dashboardUrl": "http://localhost:3001/admin/leads/uuid"
  }
}
```

## Configuration Make.com

### Scénario Make.com recommandé

1. **Module Webhook** (Trigger)
   - Configurez un webhook HTTP
   - URL : `https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj`
   - Méthode : POST
   - Format : JSON

2. **Module Router** (Optionnel)
   - Route selon `event` :
     - `new_order` → Traitement commande
     - `new_lead` → Traitement lead

3. **Module Slack** (Action)
   - Envoyer un message dans un canal Slack
   - Formater le message selon le type d'événement

### Exemple de message Slack pour une commande

```
🛒 Nouvelle commande !

Numéro: CMD-12345678
Client: Jean Dupont (jean@example.com)
Téléphone: 0612345678
Montant: 1 500,00 €
Type: Commande payée
Articles: 3

Voir dans le Dashboard: https://dashboard.effinor.com/admin/commandes/{orderId}
```

### Exemple de message Slack pour un lead

```
📧 Nouveau lead !

Nom: Marie Martin
Email: marie@example.com
Téléphone: 0623456789
Entreprise: TechCorp
Source: Site web
Message: Message du lead...

Voir dans le Dashboard: https://dashboard.effinor.com/admin/leads/{leadId}
```

## Gestion des erreurs

- Les erreurs de webhook sont loggées mais **ne bloquent pas** les opérations principales
- Si le webhook échoue, la commande/lead est quand même créé(e)
- Les logs sont disponibles dans la console du serveur

## Test

### Option 1: Test via le Dashboard (Recommandé)

#### Tester une notification de commande

1. Créez une nouvelle commande depuis le Dashboard (`/admin/commandes/new`)
2. Vérifiez les logs du serveur pour voir le webhook envoyé
3. Vérifiez Make.com pour voir si le webhook a été reçu
4. Vérifiez Slack pour voir la notification

#### Tester une notification de lead

1. Soumettez le formulaire de contact sur le site public
2. Vérifiez les logs du serveur
3. Vérifiez Make.com
4. Vérifiez Slack

### Option 2: Test avec scripts SQL

#### Créer une commande de test en SQL

Exécutez le script `supabase/test-webhook-order.sql` dans le SQL Editor de Supabase :

```sql
-- Ce script crée une commande de test
-- Note: Le webhook ne sera PAS déclenché car il est déclenché depuis le code JavaScript
-- Utilisez ce script uniquement pour tester la structure de données
```

#### Créer un lead de test en SQL

Exécutez le script `supabase/test-webhook-lead.sql` :

```sql
-- Ce script crée un lead de test
-- Note: Le webhook ne sera PAS déclenché car il est déclenché depuis le code JavaScript
-- Utilisez ce script uniquement pour tester la structure de données
```

### Option 3: Test direct du webhook (Script Node.js)

Pour tester directement l'envoi du webhook sans créer de commande/lead :

```bash
# Depuis le dossier Dashboard
npx tsx test-webhook.ts
```

Ce script envoie des webhooks de test avec toutes les données complètes directement vers Make.com.

### Option 4: Test avec curl (Recommandé pour debug)

Pour tester directement avec curl et voir la réponse complète :

```bash
# Depuis la racine du projet
bash supabase/test-webhook-curl.sh
```

Ou manuellement :

```bash
curl -X POST "https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "new_order",
    "timestamp": "2024-12-20T20:00:00.000Z",
    "data": {
      "orderId": "test-123",
      "orderNumber": "CMD-TEST",
      "customerName": "Test",
      "customerEmail": "test@example.com",
      "customerPhone": "0612345678",
      "amount": 1500.00,
      "currency": "EUR",
      "orderType": "paid",
      "paymentStatus": "paid",
      "fulfillmentStatus": "to_ship",
      "itemCount": 1,
      "items": [{"id": "1", "productName": "Test", "quantity": 1, "unitPrice": 1500, "total": 1500, "isQuoteOnly": false}],
      "createdAt": "2024-12-20T20:00:00.000Z"
    }
  }' -v
```

Le flag `-v` affiche tous les détails de la requête et de la réponse.

## Dépannage

### Le webhook n'est pas envoyé

1. Vérifiez que `NEXT_PUBLIC_MAKE_WEBHOOK_URL` est bien configuré
2. Vérifiez les logs du serveur pour les erreurs
3. Testez l'URL du webhook avec curl :
   ```bash
   curl -X POST https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj \
     -H "Content-Type: application/json" \
     -d '{"event":"test","timestamp":"2024-12-20T20:00:00Z","data":{}}'
   ```

### Make.com ne reçoit pas le webhook

1. Vérifiez que le scénario Make.com est actif
2. Vérifiez les logs Make.com pour voir les webhooks reçus
3. Vérifiez que l'URL du webhook est correcte

### Slack ne reçoit pas les notifications

1. Vérifiez la configuration du module Slack dans Make.com
2. Vérifiez que le token Slack est valide
3. Vérifiez que le canal Slack existe et que le bot a les permissions