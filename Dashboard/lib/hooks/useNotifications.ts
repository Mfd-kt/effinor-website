/**
 * Hook pour gérer les notifications en temps réel
 * Stocke les notifications dans le state et localStorage
 */

import { useState, useEffect, useCallback } from 'react';

export interface DashboardNotification {
  id: string;
  type: 'order' | 'lead';
  title: string;
  description: string;
  link: string;
  read: boolean;
  createdAt: Date;
  entityId: string; // ID de la commande ou du lead
}

const STORAGE_KEY = 'effinor-dashboard-notifications';
const MAX_NOTIFICATIONS = 50; // Limiter à 50 notifications

export function useNotifications() {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);

  // Charger les notifications depuis localStorage au démarrage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
        setNotifications(notificationsWithDates);
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      const toStore = notifications.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);

  // Ajouter une notification
  const addNotification = useCallback((notification: Omit<DashboardNotification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: DashboardNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      read: false,
      createdAt: new Date(),
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      // Limiter à MAX_NOTIFICATIONS et garder les plus récentes
      return updated.slice(0, MAX_NOTIFICATIONS);
    });
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Marquer toutes comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Supprimer toutes les notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Compter les notifications non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    unreadCount,
  };
}

