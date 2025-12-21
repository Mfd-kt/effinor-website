'use server';

import { createSupabaseClient } from '@/lib/supabaseClient';
import type { OrderInput, OrderType, PaymentStatus, FulfillmentStatus } from '@/types';

/**
 * Soumet une commande (payée ou devis) selon la logique métier unifiée
 * 
 * LOGIQUE MÉTIER :
 * - Panier 100% prix → order_type='paid', payment_status='paid', fulfillment_status='to_ship'
 * - Panier avec au moins un produit "sur devis" → order_type='quote', payment_status='quote', fulfillment_status='to_confirm'
 * - Panier mixte (prix + devis) → traité comme devis
 */
export async function submitOrder(
  input: OrderInput
): Promise<{ ok: true; orderId: string; orderType: OrderType } | { ok: false; error: string }> {
  try {
    const supabase = createSupabaseClient();

    // 1. Validation des champs obligatoires
    if (!input.customer.name || !input.customer.email || !input.customer.phone) {
      return {
        ok: false,
        error: 'Les champs nom, email et téléphone sont obligatoires',
      };
    }

    if (!input.customer.email.includes('@') || !input.customer.email.includes('.')) {
      return {
        ok: false,
        error: 'Email invalide',
      };
    }

    // Validation adresse de livraison
    if (
      !input.deliveryAddress.address ||
      !input.deliveryAddress.postcode ||
      !input.deliveryAddress.city ||
      !input.deliveryAddress.country
    ) {
      return {
        ok: false,
        error: 'L\'adresse de livraison est obligatoire (adresse, code postal, ville, pays)',
      };
    }

    if (!input.cartItems || input.cartItems.length === 0) {
      return {
        ok: false,
        error: 'Le panier est vide',
      };
    }

    // 2. Analyser le panier pour déterminer le type de commande
    const itemsWithPrice = input.cartItems.filter(
      (item) => item.priceHt !== null
    );

    // Vérifier devises mixtes (ignorer les items avec priceHt null)
    const currencies = new Set(
      itemsWithPrice.map((item) => item.priceCurrency)
    );
    const hasMixedCurrencies = currencies.size > 1;

    // Vérifier si au moins un item est sur devis
    const hasQuoteItems = input.cartItems.some(
      (item) => item.isQuoteOnly || item.priceHt === null
    );

    // 3. Déterminer order_type, payment_status, fulfillment_status selon la logique métier
    let orderType: OrderType;
    let paymentStatus: PaymentStatus;
    let fulfillmentStatus: FulfillmentStatus;
    let currency: 'EUR' | 'USD' | null = null;
    let totalHt: number | null = null;

    if (!hasQuoteItems && !hasMixedCurrencies && itemsWithPrice.length > 0) {
      // Cas 1 : Panier 100% prix
      orderType = 'paid';
      paymentStatus = input.paymentResult ? 'paid' : 'pending';
      fulfillmentStatus = input.paymentResult ? 'to_ship' : 'to_confirm';
      
      // Calculer totalHt
      totalHt = input.cartItems.reduce(
        (sum, item) => sum + (item.priceHt || 0) * item.quantity,
        0
      );
      currency = itemsWithPrice[0].priceCurrency;
    } else {
      // Cas 2 et 3 : Panier avec devis (ou mixte) → traité comme devis
      orderType = 'quote';
      paymentStatus = 'quote';
      fulfillmentStatus = 'to_confirm';
      
      // Pas de totalHt calculé, mais on peut garder la devise si pas mixte
      if (!hasMixedCurrencies && itemsWithPrice.length > 0) {
        currency = itemsWithPrice[0].priceCurrency;
      }
    }

    // 4. Insérer la commande dans orders
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        lang: input.lang,
        customer_name: input.customer.name,
        customer_email: input.customer.email,
        customer_phone: input.customer.phone,
        customer_company: input.customer.company || null,
        // Adresse de livraison
        delivery_address: input.deliveryAddress.address,
        delivery_address_2: input.deliveryAddress.address2 || null,
        delivery_postcode: input.deliveryAddress.postcode,
        delivery_city: input.deliveryAddress.city,
        delivery_country: input.deliveryAddress.country,
        // Métier
        order_type: orderType,
        payment_status: paymentStatus,
        fulfillment_status: fulfillmentStatus,
        has_quote_items: hasQuoteItems,
        // Montants
        currency: currency,
        total_ht: totalHt,
        // Paiement (si payé)
        payment_method: input.paymentResult?.method || null,
        paid_at: input.paymentResult?.paidAt || null,
        // Technique
        notes: input.notes || null,
        cart_snapshot: input.cartItems,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return {
        ok: false,
        error: 'Erreur lors de la création de la commande',
      };
    }

    // 5. Insérer les items de la commande (batch)
    const orderItems = input.cartItems.map((item) => {
      const lineTotalHt =
        item.isQuoteOnly || item.priceHt === null
          ? null
          : item.priceHt * item.quantity;

      return {
        order_id: order.id,
        product_id: item.productId,
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        unit_price_ht: item.isQuoteOnly || item.priceHt === null ? null : item.priceHt,
        currency: item.priceCurrency,
        is_quote_only: item.isQuoteOnly || item.priceHt === null,
        line_total_ht: lineTotalHt,
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return {
        ok: false,
        error: 'Erreur lors de la création des items de commande',
      };
    }

    return {
      ok: true,
      orderId: order.id,
      orderType: orderType,
    };
  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return {
      ok: false,
      error: 'Une erreur inattendue est survenue',
    };
  }
}

/**
 * Fonction legacy pour compatibilité (sera supprimée après migration)
 * @deprecated Utiliser submitOrder() à la place
 */
export async function submitCartOrder(input: {
  lang: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  cart: Array<{
    productId: string;
    sku: string | null;
    name: string;
    priceHt: number | null;
    priceCurrency: 'EUR' | 'USD';
    isQuoteOnly: boolean;
    quantity: number;
  }>;
}): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  // Migration vers la nouvelle structure
  // Pour l'instant, on retourne une erreur pour forcer la migration
  return {
    ok: false,
    error: 'Cette fonction est obsolète. Veuillez utiliser la page de checkout.',
  };
}

