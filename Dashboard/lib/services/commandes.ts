import { supabase } from '@/lib/supabase/client';
import { Order, OrderStatus } from '@/lib/types/order';

// Mapping des statuts depuis la base vers notre format
function mapStatus(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    'pending': { label: 'En attente', color: '#f59e0b' },
    'processing': { label: 'En traitement', color: '#3b82f6' },
    'completed': { label: 'Terminée', color: '#10b981' },
    'cancelled': { label: 'Annulée', color: '#ef4444' },
  };
  return statusMap[status] || { label: status, color: '#6b7280' };
}

function mapOrder(item: any, items?: any[]): Order {
  // Générer un numéro de commande à partir de l'ID
  const orderNumber = `CMD-${item.id.substring(0, 8).toUpperCase()}`;

  // Mapper les items depuis order_items
  const mappedItems = (items || []).map((orderItem: any) => ({
    id: orderItem.id,
    productId: orderItem.product_id || '',
    productName: orderItem.name,
    quantity: orderItem.quantity || 1,
    price: orderItem.unit_price_ht ? Number(orderItem.unit_price_ht) : 0,
    total: orderItem.line_total_ht ? Number(orderItem.line_total_ht) : (orderItem.unit_price_ht ? Number(orderItem.unit_price_ht) * (orderItem.quantity || 1) : 0),
  }));

  // Déterminer le statut : utiliser payment_status si disponible, sinon status legacy
  const statusValue = item.payment_status || item.status || 'pending';
  // Mapper payment_status vers les statuts legacy pour compatibilité
  let mappedStatus = statusValue;
  if (item.payment_status === 'paid') {
    mappedStatus = 'completed';
  } else if (item.payment_status === 'quote') {
    mappedStatus = 'pending';
  } else if (item.payment_status === 'pending') {
    mappedStatus = 'processing';
  } else if (item.payment_status === 'failed' || item.payment_status === 'refunded') {
    mappedStatus = 'cancelled';
  }

  return {
    id: item.id,
    orderNumber,
    customerName: item.customer_name,
    customerEmail: item.customer_email,
    customerPhone: item.customer_phone,
    statusId: mappedStatus,
    status: {
      id: mappedStatus,
      label: mapStatus(mappedStatus).label,
      color: mapStatus(mappedStatus).color,
      order: 0,
      active: true,
    },
    amount: item.total_ht ? Number(item.total_ht) : 0,
    items: mappedItems,
    shippingAddress: item.delivery_address ? {
      street: `${item.delivery_address}${item.delivery_address_2 ? `, ${item.delivery_address_2}` : ''}`,
      city: item.delivery_city || '',
      zipCode: item.delivery_postcode || '',
      country: item.delivery_country || 'FR',
    } : undefined,
    billingAddress: undefined, // Pas dans le schéma
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.created_at), // Pas de updated_at dans le schéma
  };
}

export async function getCommandes(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  // Récupérer les items pour chaque commande
  const ordersWithItems = await Promise.all(
    (data || []).map(async (order: any) => {
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      return mapOrder(order, items || []);
    })
  );

  return ordersWithItems;
}

export async function getCommande(id: string): Promise<Order | null> {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (orderError || !order) {
    console.error('Error fetching order:', orderError);
    return null;
  }

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  return mapOrder(order, items || []);
}

export async function getCommandeRaw(id: string): Promise<any | null> {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (orderError || !order) {
    console.error('Error fetching order:', orderError);
    return null;
  }

  return order;
}

// Pas de table commande_statuses, retourner les statuts possibles
export async function getCommandeStatuses(): Promise<OrderStatus[]> {
  return [
    { id: 'pending', label: 'En attente', color: '#f59e0b', order: 0, active: true },
    { id: 'processing', label: 'En traitement', color: '#3b82f6', order: 1, active: true },
    { id: 'completed', label: 'Terminée', color: '#10b981', order: 2, active: true },
    { id: 'cancelled', label: 'Annulée', color: '#ef4444', order: 3, active: true },
  ];
}

export interface CreateOrderData {
  lang: 'fr' | 'en' | 'ar';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  deliveryAddress: string;
  deliveryAddress2?: string;
  deliveryPostcode: string;
  deliveryCity: string;
  deliveryCountry?: string;
  orderType: 'paid' | 'quote';
  paymentStatus: 'pending' | 'paid' | 'quote' | 'failed' | 'refunded';
  fulfillmentStatus: 'to_confirm' | 'to_ship' | 'shipped' | 'cancelled';
  currency?: 'EUR' | 'USD';
  paymentMethod?: 'card' | 'transfer';
  paidAt?: Date;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPriceHt: number;
    currency?: 'EUR' | 'USD';
    isQuoteOnly?: boolean;
  }>;
}

export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  try {
    // Calculer le total HT et vérifier has_quote_items
    let totalHt = 0;
    let hasQuoteItems = false;
    const cartSnapshot: any[] = [];

    // Préparer les items et calculer le total
    for (const item of orderData.items) {
      const lineTotal = item.unitPriceHt * item.quantity;
      totalHt += lineTotal;
      if (item.isQuoteOnly) {
        hasQuoteItems = true;
      }
      cartSnapshot.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPriceHt: item.unitPriceHt,
        currency: item.currency || orderData.currency || 'EUR',
        isQuoteOnly: item.isQuoteOnly || false,
      });
    }

    // Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        lang: orderData.lang,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        customer_company: orderData.customerCompany || null,
        delivery_address: orderData.deliveryAddress,
        delivery_address_2: orderData.deliveryAddress2 || null,
        delivery_postcode: orderData.deliveryPostcode,
        delivery_city: orderData.deliveryCity,
        delivery_country: orderData.deliveryCountry || 'FR',
        order_type: orderData.orderType,
        payment_status: orderData.paymentStatus,
        fulfillment_status: orderData.fulfillmentStatus,
        has_quote_items: hasQuoteItems,
        currency: orderData.currency || 'EUR',
        total_ht: totalHt,
        payment_method: orderData.paymentMethod || null,
        paid_at: orderData.paidAt ? orderData.paidAt.toISOString() : null,
        notes: orderData.notes || null,
        cart_snapshot: cartSnapshot,
        status: orderData.paymentStatus === 'paid' ? 'completed' : orderData.paymentStatus === 'quote' ? 'pending' : 'processing',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Créer les items de la commande
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price_ht: item.unitPriceHt,
      currency: item.currency || orderData.currency || 'EUR',
      is_quote_only: item.isQuoteOnly || false,
      line_total_ht: item.unitPriceHt * item.quantity,
    }));

    // Récupérer les informations des produits pour le nom et SKU
    const productIds = orderData.items.map((item) => item.productId);
    const { data: products } = await supabase
      .from('products')
      .select('id, sku')
      .in('id', productIds);

    const productMap = new Map((products || []).map((p: any) => [p.id, p]));

    // Ajouter les noms depuis les traductions
    const { data: translations } = await supabase
      .from('product_translations')
      .select('product_id, name')
      .in('product_id', productIds)
      .eq('lang', orderData.lang);

    const translationMap = new Map((translations || []).map((t: any) => [t.product_id, t.name]));

    // Compléter les items avec les noms et SKU
    const itemsWithNames = orderItems.map((item) => {
      const product = productMap.get(item.product_id);
      const productName = translationMap.get(item.product_id) || 'Produit inconnu';
      return {
        ...item,
        name: productName,
        sku: (product as any)?.sku || null,
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithNames);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Supprimer la commande si les items échouent
        await supabase.from('orders').delete().eq('id', order.id);
        throw itemsError;
      }

      // Récupérer la commande complète avec les items
      const createdOrder = await getCommande(order.id);
      
      // Envoyer la notification webhook (ne bloque pas si échec)
      if (createdOrder) {
        try {
          const { notifyNewOrder } = await import('./webhook');
          const orderRaw = await getCommandeRaw(order.id);
          
          // Préparer les items détaillés
          const items = createdOrder.items.map(item => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.price,
            total: item.total,
            isQuoteOnly: false, // À récupérer depuis order_items si nécessaire
          }));

          // Récupérer is_quote_only depuis order_items
          const { data: orderItemsRaw } = await supabase
            .from('order_items')
            .select('id, is_quote_only')
            .eq('order_id', createdOrder.id);

          if (orderItemsRaw) {
            const quoteOnlyMap = new Map(orderItemsRaw.map((oi: any) => [oi.id, oi.is_quote_only]));
            items.forEach(item => {
              item.isQuoteOnly = Boolean(quoteOnlyMap.get(item.id)) || false;
            });
          }

          // Préparer l'adresse de livraison
          const addressParts = createdOrder.shippingAddress?.street?.split(', ') || [];
          const shippingAddress = createdOrder.shippingAddress ? {
            street: addressParts[0] || createdOrder.shippingAddress.street,
            street2: addressParts.slice(1).join(', ') || undefined,
            city: createdOrder.shippingAddress.city,
            zipCode: createdOrder.shippingAddress.zipCode,
            country: createdOrder.shippingAddress.country,
          } : undefined;

          await notifyNewOrder({
            orderId: createdOrder.id,
            orderNumber: createdOrder.orderNumber,
            customerName: createdOrder.customerName,
            customerEmail: createdOrder.customerEmail,
            customerPhone: createdOrder.customerPhone || '',
            customerCompany: orderRaw?.customer_company || orderData.customerCompany,
            amount: createdOrder.amount,
            currency: orderData.currency || 'EUR',
            orderType: orderData.orderType,
            paymentStatus: orderData.paymentStatus,
            fulfillmentStatus: orderData.fulfillmentStatus,
            paymentMethod: orderData.paymentMethod,
            paidAt: orderData.paidAt ? orderData.paidAt.toISOString() : undefined,
            itemCount: createdOrder.items.length,
            items: items,
            shippingAddress: shippingAddress,
            notes: orderData.notes,
            hasQuoteItems: hasQuoteItems,
            createdAt: createdOrder.createdAt.toISOString(),
            dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/admin/commandes/${createdOrder.id}`,
          });
        } catch (webhookError) {
          // Erreur déjà loggée dans sendWebhookNotification, on continue
          console.warn('Webhook notification failed, but order was created successfully');
        }
      }

      return createdOrder || order as any;
  } catch (error) {
    console.error('Exception in createOrder:', error);
    throw error;
  }
}

export interface UpdateOrderData {
  lang?: 'fr' | 'en' | 'ar';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerCompany?: string;
  deliveryAddress?: string;
  deliveryAddress2?: string;
  deliveryPostcode?: string;
  deliveryCity?: string;
  deliveryCountry?: string;
  orderType?: 'paid' | 'quote';
  paymentStatus?: 'pending' | 'paid' | 'quote' | 'failed' | 'refunded';
  fulfillmentStatus?: 'to_confirm' | 'to_ship' | 'shipped' | 'cancelled';
  currency?: 'EUR' | 'USD';
  paymentMethod?: 'card' | 'transfer';
  paidAt?: Date | null;
  notes?: string;
  items?: Array<{
    id?: string; // Si présent, mettre à jour l'item existant
    productId: string;
    quantity: number;
    unitPriceHt: number;
    currency?: 'EUR' | 'USD';
    isQuoteOnly?: boolean;
  }>;
}

export async function updateOrder(id: string, orderData: UpdateOrderData): Promise<Order | null> {
  try {
    // Récupérer la commande existante
    const existingOrder = await getCommande(id);
    if (!existingOrder) {
      throw new Error('Commande introuvable');
    }

    // Si des items sont fournis, recalculer le total
    let totalHt = existingOrder.amount;
    let hasQuoteItems = false;
    let cartSnapshot: any[] = [];

    if (orderData.items !== undefined) {
      totalHt = 0;
      for (const item of orderData.items) {
        const lineTotal = item.unitPriceHt * item.quantity;
        totalHt += lineTotal;
        if (item.isQuoteOnly) {
          hasQuoteItems = true;
        }
        cartSnapshot.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPriceHt: item.unitPriceHt,
          currency: item.currency || orderData.currency || 'EUR',
          isQuoteOnly: item.isQuoteOnly || false,
        });
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (orderData.lang !== undefined) updateData.lang = orderData.lang;
    if (orderData.customerName !== undefined) updateData.customer_name = orderData.customerName;
    if (orderData.customerEmail !== undefined) updateData.customer_email = orderData.customerEmail;
    if (orderData.customerPhone !== undefined) updateData.customer_phone = orderData.customerPhone;
    if (orderData.customerCompany !== undefined) updateData.customer_company = orderData.customerCompany || null;
    if (orderData.deliveryAddress !== undefined) updateData.delivery_address = orderData.deliveryAddress;
    if (orderData.deliveryAddress2 !== undefined) updateData.delivery_address_2 = orderData.deliveryAddress2 || null;
    if (orderData.deliveryPostcode !== undefined) updateData.delivery_postcode = orderData.deliveryPostcode;
    if (orderData.deliveryCity !== undefined) updateData.delivery_city = orderData.deliveryCity;
    if (orderData.deliveryCountry !== undefined) updateData.delivery_country = orderData.deliveryCountry;
    if (orderData.orderType !== undefined) updateData.order_type = orderData.orderType;
    if (orderData.paymentStatus !== undefined) updateData.payment_status = orderData.paymentStatus;
    if (orderData.fulfillmentStatus !== undefined) updateData.fulfillment_status = orderData.fulfillmentStatus;
    if (orderData.currency !== undefined) updateData.currency = orderData.currency;
    if (orderData.paymentMethod !== undefined) updateData.payment_method = orderData.paymentMethod || null;
    if (orderData.paidAt !== undefined) updateData.paid_at = orderData.paidAt ? orderData.paidAt.toISOString() : null;
    if (orderData.notes !== undefined) updateData.notes = orderData.notes || null;

    if (orderData.items !== undefined) {
      updateData.total_ht = totalHt;
      updateData.has_quote_items = hasQuoteItems;
      updateData.cart_snapshot = cartSnapshot;
    }

    // Mettre à jour le statut legacy si nécessaire
    if (orderData.paymentStatus !== undefined) {
      if (orderData.paymentStatus === 'paid') {
        updateData.status = 'completed';
      } else if (orderData.paymentStatus === 'quote') {
        updateData.status = 'pending';
      } else {
        updateData.status = 'processing';
      }
    }

    // Mettre à jour la commande
    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }

    // Si des items sont fournis, mettre à jour les items
    if (orderData.items !== undefined) {
      // Supprimer tous les items existants
      await supabase.from('order_items').delete().eq('order_id', id);

      // Créer les nouveaux items
      const orderItems = orderData.items.map((item) => ({
        order_id: id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price_ht: item.unitPriceHt,
        currency: item.currency || orderData.currency || 'EUR',
        is_quote_only: item.isQuoteOnly || false,
        line_total_ht: item.unitPriceHt * item.quantity,
      }));

      // Récupérer les informations des produits
      const productIds = orderData.items.map((item) => item.productId);
      const lang = orderData.lang || 'fr';
      
      const { data: products } = await supabase
        .from('products')
        .select('id, sku')
        .in('id', productIds);

      const productMap = new Map((products || []).map((p: any) => [p.id, p]));

      const { data: translations } = await supabase
        .from('product_translations')
        .select('product_id, name')
        .in('product_id', productIds)
        .eq('lang', lang);

      const translationMap = new Map((translations || []).map((t: any) => [t.product_id, t.name]));

      const itemsWithNames = orderItems.map((item) => {
        const product = productMap.get(item.product_id);
        const productName = translationMap.get(item.product_id) || 'Produit inconnu';
        return {
          ...item,
          name: productName,
          sku: (product as any)?.sku || null,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsWithNames);

      if (itemsError) {
        console.error('Error updating order items:', itemsError);
        throw itemsError;
      }
    }

    // Récupérer la commande mise à jour
    return getCommande(id);
  } catch (error) {
    console.error('Exception in updateOrder:', error);
    throw error;
  }
}
