/**
 * Script de test pour vérifier l'envoi des webhooks vers Make.com
 * 
 * Usage:
 *   cd Dashboard
 *   npx tsx test-webhook.ts
 * 
 * Ou avec Node.js:
 *   node --loader tsx/esm test-webhook.ts
 */

import { notifyNewOrder, notifyNewLead } from './lib/services/webhook';

async function testWebhook() {
  console.log('🧪 Test des webhooks Make.com\n');
  console.log('URL webhook:', process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL || 'NON CONFIGURÉ\n');

  // Test 1: Notification de commande avec toutes les infos
  console.log('📦 Test 1: Notification de nouvelle commande (données complètes)');
  try {
    await notifyNewOrder({
      orderId: 'test-order-' + Date.now(),
      orderNumber: 'CMD-TEST001',
      customerName: 'Jean Dupont',
      customerEmail: 'jean.dupont@example.com',
      customerPhone: '0612345678',
      customerCompany: 'Entreprise Test SARL',
      amount: 2500.50,
      currency: 'EUR',
      orderType: 'paid',
      paymentStatus: 'paid',
      fulfillmentStatus: 'to_ship',
      paymentMethod: 'card',
      paidAt: new Date().toISOString(),
      itemCount: 3,
      items: [
        {
          id: 'item-1',
          productId: 'prod-1',
          productName: 'Luminaire LED 150W',
          quantity: 2,
          unitPrice: 750.00,
          total: 1500.00,
          isQuoteOnly: false,
        },
        {
          id: 'item-2',
          productId: 'prod-2',
          productName: 'Borne de recharge IRVE 11kW',
          quantity: 1,
          unitPrice: 1000.50,
          total: 1000.50,
          isQuoteOnly: false,
        },
      ],
      shippingAddress: {
        street: '123 Rue de la République',
        street2: 'Bureau 301',
        city: 'Paris',
        zipCode: '75001',
        country: 'FR',
      },
      notes: 'Commande urgente, expédition prioritaire demandée',
      hasQuoteItems: false,
      createdAt: new Date().toISOString(),
      dashboardUrl: 'http://localhost:3001/admin/commandes/test-order-123',
    });
    console.log('✅ Webhook commande envoyé\n');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }

  // Attendre 2 secondes
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Notification de lead avec toutes les infos
  console.log('📧 Test 2: Notification de nouveau lead (données complètes)');
  try {
    await notifyNewLead({
      leadId: 'test-lead-' + Date.now(),
      fullName: 'Marie Martin',
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      phone: '0623456789',
      company: 'TechCorp Solutions',
      source: 'website',
      status: 'new',
      message: 'Bonjour, je suis intéressée par vos solutions d\'éclairage LED pour notre nouveau bureau de 500m². Pouvez-vous me faire un devis ?',
      solution: 'lighting',
      categoryId: 'cat-123',
      categoryName: 'Éclairage professionnel LED',
      page: '/fr/contact',
      origin: 'contact_page_form',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'led_campaign_2024',
      utmTerm: 'éclairage led professionnel',
      utmContent: 'ad_variant_1',
      gclid: 'CjwKCAjw...',
      fbclid: undefined,
      lang: 'fr',
      createdAt: new Date().toISOString(),
      dashboardUrl: 'http://localhost:3001/admin/leads/test-lead-123',
    });
    console.log('✅ Webhook lead envoyé\n');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }

  console.log('✨ Tests terminés');
  console.log('\n📋 Vérifications:');
  console.log('   1. Vérifiez les logs ci-dessus pour voir le payload envoyé');
  console.log('   2. Vérifiez Make.com pour voir si les webhooks ont été reçus');
  console.log('   3. Vérifiez Slack pour voir les notifications');
}

// Exécuter les tests
testWebhook().catch(console.error);

