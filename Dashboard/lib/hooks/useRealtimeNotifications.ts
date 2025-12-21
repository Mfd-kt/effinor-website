/**
 * Hook pour détecter les nouvelles commandes et leads en temps réel
 * Utilise Supabase Realtime pour des notifications instantanées
 */

import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/toast';
import { useNotificationsContext } from '@/components/admin/NotificationsProvider';
import { supabase } from '@/lib/supabase/client';
import { getCommande } from '@/lib/services/commandes';
import { getLead } from '@/lib/services/leads';

export function useRealtimeNotifications(enabled: boolean = true) {
  const { addToast } = useToast();
  const { addNotification } = useNotificationsContext();
  const initializedRef = useRef(false);
  const subscriptionsRef = useRef<Array<{ unsubscribe: () => void }>>([]);

  useEffect(() => {
    if (!enabled) return;

    // Initialiser une seule fois
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Fonction pour afficher une notification de commande
    const handleNewOrder = async (orderId: string) => {
      try {
        const order = await getCommande(orderId);
        if (order) {
          // Utiliser setTimeout pour éviter l'erreur React setState pendant le rendu
          setTimeout(() => {
            // Toast pour notification immédiate
            addToast({
              title: '🛒 Nouvelle commande !',
              description: `${order.orderNumber} - ${order.customerName} (${order.amount.toLocaleString('fr-FR')} €)`,
              variant: 'success',
            });

            // Ajouter à la liste des notifications du Dashboard
            addNotification({
              type: 'order',
              title: 'Nouvelle commande',
              description: `${order.orderNumber} - ${order.customerName} (${order.amount.toLocaleString('fr-FR')} €)`,
              link: `/admin/commandes/${order.id}`,
              entityId: order.id,
            });
          }, 0);
        }
      } catch (error) {
        console.error('Error fetching order for notification:', error);
      }
    };

    // Fonction pour afficher une notification de lead
    const handleNewLead = async (leadId: string) => {
      try {
        const lead = await getLead(leadId);
        if (lead) {
          // Utiliser setTimeout pour éviter l'erreur React setState pendant le rendu
          setTimeout(() => {
            // Toast pour notification immédiate
            addToast({
              title: '📧 Nouveau lead !',
              description: `${lead.fullName}${lead.company ? ` - ${lead.company}` : ''} (${lead.email})`,
              variant: 'success',
            });

            // Ajouter à la liste des notifications du Dashboard
            addNotification({
              type: 'lead',
              title: 'Nouveau lead',
              description: `${lead.fullName}${lead.company ? ` - ${lead.company}` : ''} (${lead.email})`,
              link: `/admin/leads/${lead.id}`,
              entityId: lead.id,
            });
          }, 0);
        }
      } catch (error) {
        console.error('Error fetching lead for notification:', error);
      }
    };

    // S'abonner aux nouvelles commandes via Supabase Realtime
    const orderChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('🛒 Nouvelle commande détectée:', payload.new.id);
          handleNewOrder(payload.new.id);
        }
      )
      .subscribe();

    // S'abonner aux nouveaux leads via Supabase Realtime
    const leadChannel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          console.log('📧 Nouveau lead détecté:', payload.new.id);
          handleNewLead(payload.new.id);
        }
      )
      .subscribe();

    subscriptionsRef.current = [
      { unsubscribe: () => supabase.removeChannel(orderChannel) },
      { unsubscribe: () => supabase.removeChannel(leadChannel) },
    ];

    console.log('✅ Notifications en temps réel activées');

    // Cleanup
    return () => {
      console.log('🔌 Désabonnement des notifications en temps réel');
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current = [];
      initializedRef.current = false;
    };
  }, [enabled, addToast, addNotification]);
}

