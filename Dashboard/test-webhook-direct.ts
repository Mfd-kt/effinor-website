/**
 * Script de test direct du webhook - Diagnostic
 * 
 * Usage:
 *   cd Dashboard
 *   npx tsx test-webhook-direct.ts
 */

const WEBHOOK_URL = 'https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj';

async function testWebhookDirect() {
  console.log('🔍 Diagnostic du webhook Make.com\n');
  console.log('URL:', WEBHOOK_URL);
  console.log('');

  const testPayload = {
    event: 'new_order',
    timestamp: new Date().toISOString(),
    data: {
      orderId: 'test-' + Date.now(),
      orderNumber: 'CMD-TEST-DIRECT',
      customerName: 'Test Direct',
      customerEmail: 'test@example.com',
      customerPhone: '0612345678',
      amount: 100.00,
      currency: 'EUR',
      orderType: 'paid',
      paymentStatus: 'paid',
      fulfillmentStatus: 'to_ship',
      itemCount: 1,
      items: [{
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Produit Test',
        quantity: 1,
        unitPrice: 100.00,
        total: 100.00,
        isQuoteOnly: false,
      }],
      createdAt: new Date().toISOString(),
    },
  };

  console.log('📦 Payload à envoyer:');
  console.log(JSON.stringify(testPayload, null, 2));
  console.log('');

  try {
    console.log('📤 Envoi de la requête...');
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Effinor-Dashboard-Test/1.0',
      },
      body: JSON.stringify(testPayload),
    });

    console.log('📥 Réponse reçue:');
    console.log('   Status:', response.status, response.statusText);
    console.log('   Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('   Body:', responseText);
    console.log('');

    if (response.ok) {
      console.log('✅ Webhook envoyé avec succès !');
      console.log('   Make.com devrait avoir reçu le webhook.');
    } else {
      console.log('❌ Erreur HTTP:', response.status);
      console.log('   Réponse:', responseText);
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'envoi:');
    console.error('   Type:', error.constructor.name);
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    
    if (error.code) {
      console.error('   Code:', error.code);
    }
    if (error.cause) {
      console.error('   Cause:', error.cause);
    }
  }

  console.log('\n✨ Test terminé');
}

testWebhookDirect().catch(console.error);



