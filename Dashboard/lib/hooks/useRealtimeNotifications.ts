/**
 * Hook pour détecter les nouvelles commandes et leads en temps réel
 * Utilise Supabase Realtime pour des notifications instantanées
 */

import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/toast';
import { useNotificationsContext } from '@/components/admin/NotificationsProvider';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getCommande } from '@/lib/services/commandes';
import { getLead } from '@/lib/services/leads';

export function useRealtimeNotifications(enabled: boolean = true) {
  const { addToast } = useToast();
  let addNotification: any;
  try {
    const context = useNotificationsContext();
    addNotification = context.addNotification;
  } catch (error) {
    console.warn('⚠️ NotificationsContext non disponible, notifications désactivées');
    addNotification = () => {};
  }

  const initializedRef = useRef(false);
  const subscriptionsRef = useRef<Array<{ unsubscribe: () => void }>>([]);

  useEffect(() => {
    if (!enabled) {
      console.log('⚠️ Notifications Realtime désactivées');
      return;
    }

    // Vérifier que Supabase est configuré
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase non configuré - Notifications Realtime désactivées');
      console.error('💡 Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY');
      return;
    }

    // Vérifier que supabase supporte Realtime
    if (!supabase || typeof supabase.channel !== 'function') {
      console.error('❌ Supabase Realtime non disponible - channel() non disponible');
      return;
    }

    // Initialiser une seule fois
    if (initializedRef.current) {
      console.log('ℹ️ Notifications Realtime déjà initialisées');
      return;
    }
    initializedRef.current = true;
    console.log('🔔 Initialisation des notifications Realtime...');

    // Fonction pour afficher une notification de commande
    const handleNewOrder = async (orderId: string) => {
      if (!orderId) {
        console.warn('⚠️ handleNewOrder appelé sans orderId');
        return;
      }
      try {
        const order = await getCommande(orderId);
        if (order) {
          // Utiliser setTimeout pour éviter l'erreur React setState pendant le rendu
          setTimeout(() => {
            try {
              // Toast pour notification immédiate
              addToast({
                title: '🛒 Nouvelle commande !',
                description: `${order.orderNumber} - ${order.customerName} (${order.amount.toLocaleString('fr-FR')} €)`,
                variant: 'success',
              });

              // Ajouter à la liste des notifications du Dashboard
              if (addNotification && typeof addNotification === 'function') {
                addNotification({
                  type: 'order',
                  title: 'Nouvelle commande',
                  description: `${order.orderNumber} - ${order.customerName} (${order.amount.toLocaleString('fr-FR')} €)`,
                  link: `/admin/commandes/${order.id}`,
                  entityId: order.id,
                });
              }
            } catch (error) {
              console.error('❌ Erreur lors de l\'affichage de la notification de commande:', error);
            }
          }, 0);
        }
      } catch (error) {
        console.error('❌ Error fetching order for notification:', error);
      }
    };

    // Fonction pour afficher une notification de lead
    const handleNewLead = async (leadId: string) => {
      if (!leadId) {
        console.warn('⚠️ handleNewLead appelé sans leadId');
        return;
      }
      try {
        const lead = await getLead(leadId);
        if (lead) {
          // Utiliser setTimeout pour éviter l'erreur React setState pendant le rendu
          setTimeout(() => {
            try {
              // Toast pour notification immédiate
              addToast({
                title: '📧 Nouveau lead !',
                description: `${lead.fullName}${lead.company ? ` - ${lead.company}` : ''} (${lead.email})`,
                variant: 'success',
              });

              // Ajouter à la liste des notifications du Dashboard
              if (addNotification && typeof addNotification === 'function') {
                addNotification({
                  type: 'lead',
                  title: 'Nouveau lead',
                  description: `${lead.fullName}${lead.company ? ` - ${lead.company}` : ''} (${lead.email})`,
                  link: `/admin/leads/${lead.id}`,
                  entityId: lead.id,
                });
              }
            } catch (error) {
              console.error('❌ Erreur lors de l\'affichage de la notification de lead:', error);
            }
          }, 0);
        }
      } catch (error) {
        console.error('❌ Error fetching lead for notification:', error);
      }
    };

    // S'abonner aux nouvelles commandes via Supabase Realtime
    console.log('📡 Création du channel pour les commandes...');
    let orderChannel: any = null;
    try {
      orderChannel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'orders',
          },
          (payload: any) => {
            try {
              console.log('🛒 Nouvelle commande détectée:', payload.new?.id);
              if (payload.new?.id) {
                handleNewOrder(payload.new.id);
              }
            } catch (error) {
              console.error('❌ Erreur dans handleNewOrder:', error);
            }
          }
        )
        .subscribe((status: string) => {
          console.log('📡 Statut abonnement commandes:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Abonnement aux commandes activé');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Erreur d\'abonnement aux commandes - Vérifiez que Realtime est activé pour la table orders');
          } else if (status === 'TIMED_OUT') {
            console.error('❌ Timeout lors de l\'abonnement aux commandes - Vérifiez que Realtime est activé dans Supabase');
          } else if (status === 'CLOSED') {
            console.warn('⚠️ Channel commandes fermé');
          }
        });
    } catch (error) {
      console.error('❌ Erreur lors de la création du channel commandes:', error);
    }

    // S'abonner aux nouveaux leads via Supabase Realtime
    console.log('📡 Création du channel pour les leads...');
    let leadChannel: any = null;
    try {
      leadChannel = supabase
        .channel('leads-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'leads',
          },
          (payload: any) => {
            try {
              console.log('📧 Nouveau lead détecté via Realtime:', payload.new?.id);
              console.log('📧 Données du lead:', payload.new);
              if (payload.new?.id) {
                handleNewLead(payload.new.id);
              }
            } catch (error) {
              console.error('❌ Erreur dans handleNewLead:', error);
            }
          }
        )
        .subscribe((status: string) => {
          console.log('📡 Statut abonnement leads:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Abonnement aux leads activé');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Erreur d\'abonnement aux leads - Vérifiez que Realtime est activé pour la table leads');
          } else if (status === 'TIMED_OUT') {
            console.error('❌ Timeout lors de l\'abonnement aux leads - Vérifiez que Realtime est activé dans Supabase');
          } else if (status === 'CLOSED') {
            console.warn('⚠️ Channel leads fermé');
          }
        });
    } catch (error) {
      console.error('❌ Erreur lors de la création du channel leads:', error);
    }

    subscriptionsRef.current = [
      { unsubscribe: () => {
        if (orderChannel) {
          console.log('🔌 Désabonnement du channel commandes');
          try {
            supabase.removeChannel(orderChannel);
          } catch (error) {
            console.error('❌ Erreur lors de la désinscription du channel commandes:', error);
          }
        }
      }},
      { unsubscribe: () => {
        if (leadChannel) {
          console.log('🔌 Désabonnement du channel leads');
          try {
            supabase.removeChannel(leadChannel);
          } catch (error) {
            console.error('❌ Erreur lors de la désinscription du channel leads:', error);
          }
        }
      }},
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

