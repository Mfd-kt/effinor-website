/**
 * Service pour envoyer des notifications webhook vers Make.com
 * Les erreurs sont gérées silencieusement pour ne pas bloquer les opérations principales
 */

export type WebhookEventType = 'new_order' | 'new_lead';

export interface WebhookNotificationPayload {
  event: WebhookEventType;
  timestamp: string;
  data: Record<string, any>;
}

export interface OrderItemWebhookData {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isQuoteOnly: boolean;
}

export interface OrderWebhookData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  amount: number;
  currency: string;
  orderType: 'paid' | 'quote';
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod?: string;
  paidAt?: string;
  itemCount: number;
  items: OrderItemWebhookData[];
  shippingAddress?: {
    street: string;
    street2?: string;
    city: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  hasQuoteItems: boolean;
  createdAt: string;
  dashboardUrl?: string;
}

export interface LeadWebhookData {
  leadId: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  company?: string;
  source: string;
  status: string;
  message?: string;
  solution?: string;
  categoryId?: string;
  categoryName?: string;
  page?: string;
  origin?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  lang: string;
  createdAt: string;
  dashboardUrl?: string;
}

/**
 * Envoie une notification webhook vers Make.com
 * Les erreurs sont loggées mais ne bloquent pas l'exécution
 */
export async function sendWebhookNotification(
  payload: WebhookNotificationPayload
): Promise<void> {
  try {
    // Récupérer l'URL du webhook - supporte plusieurs sources
    const webhookUrl = 
      process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL ||
      process.env.MAKE_WEBHOOK_URL ||
      'https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj'; // Fallback direct

    if (!webhookUrl || webhookUrl === '') {
      console.error('❌ ERREUR: NEXT_PUBLIC_MAKE_WEBHOOK_URL n\'est pas configuré.');
      console.error('   Veuillez ajouter NEXT_PUBLIC_MAKE_WEBHOOK_URL dans votre .env.local');
      console.error('   Exemple: NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/7xra7iqm2bvjk5cgdyq4qn7rt7ad88dj');
      return;
    }

    const payloadJson = JSON.stringify(payload, null, 2);
    console.log(`\n📤 ===== ENVOI WEBHOOK ${payload.event} =====`);
    console.log(`🔗 URL: ${webhookUrl}`);
    console.log(`📦 Payload (${payloadJson.length} bytes):`);
    console.log(payloadJson);
    console.log('');

    const startTime = Date.now();
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Effinor-Dashboard/1.0',
        'Accept': 'application/json',
      },
      body: payloadJson,
      // Timeout de 30 secondes
      signal: AbortSignal.timeout(30000),
    });

    const duration = Date.now() - startTime;
    const responseText = await response.text();
    
    console.log(`📥 Réponse Make.com (${duration}ms):`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Headers:`, Object.fromEntries(response.headers.entries()));
    console.log(`   Body (${responseText.length} chars):`, responseText.substring(0, 500));
    console.log('');

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}: ${responseText}`);
    }

    console.log(`✅ Webhook ${payload.event} envoyé avec succès !`);
    console.log(`   Make.com devrait avoir reçu le webhook.`);
    console.log(`==========================================\n`);
  } catch (error: any) {
    // Logger l'erreur en détail mais ne pas la propager pour ne pas bloquer les opérations principales
    console.error(`\n❌ ===== ERREUR WEBHOOK ${payload.event} =====`);
    console.error(`   Type: ${error.constructor?.name || 'Unknown'}`);
    console.error(`   Message: ${error.message}`);
    
    if (error.name === 'AbortError') {
      console.error('   ⚠️ Timeout: Le webhook a pris plus de 30 secondes');
    }
    
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    
    if (error.cause) {
      console.error(`   Cause:`, error.cause);
    }
    
    if (error.stack) {
      console.error(`   Stack:`, error.stack);
    }
    
    console.error(`==========================================\n`);
    // Ne pas throw pour ne pas bloquer les opérations
  }
}

/**
 * Envoie une notification pour une nouvelle commande
 */
export async function notifyNewOrder(orderData: OrderWebhookData): Promise<void> {
  const payload: WebhookNotificationPayload = {
    event: 'new_order',
    timestamp: new Date().toISOString(),
    data: orderData,
  };

  await sendWebhookNotification(payload);
}

/**
 * Envoie une notification pour un nouveau lead
 */
export async function notifyNewLead(leadData: LeadWebhookData): Promise<void> {
  const payload: WebhookNotificationPayload = {
    event: 'new_lead',
    timestamp: new Date().toISOString(),
    data: leadData,
  };

  await sendWebhookNotification(payload);
}

