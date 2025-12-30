"use client";

import { useEffect } from 'react';

/**
 * Hook pour activer les notifications en temps réel
 * Pour l'instant, c'est une implémentation vide car la table notifications n'existe pas
 */
export function useRealtimeNotifications(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    // TODO: Implémenter la connexion Supabase Realtime quand la table notifications sera créée
    // Pour l'instant, on ne fait rien
    console.log('Realtime notifications enabled (not implemented yet)');

    return () => {
      // Cleanup si nécessaire
    };
  }, [enabled]);
}

