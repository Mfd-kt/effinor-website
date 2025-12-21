'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PriceCurrency } from './pricing';

export type CartItem = {
  productId: string;
  sku: string | null;
  name: string;
  slug?: string;
  priceHt: number | null;
  priceCurrency: PriceCurrency;
  isQuoteOnly: boolean;
  quantity: number;
  imageUrl?: string | null;
};

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotals: () => {
    totalHt: number | null;
    currency: PriceCurrency | null;
    hasMixedCurrencies: boolean;
    hasQuoteOnly: boolean;
  };
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.productId === item.productId
          );

          if (existingItem) {
            // Incrémenter la quantité (min 1, max 999)
            const newQuantity = Math.min(999, existingItem.quantity + quantity);
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId
                  ? { ...cartItem, quantity: newQuantity }
                  : cartItem
              ),
            };
          }

          // Ajouter un nouvel item
          const newItem: CartItem = {
            ...item,
            quantity,
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        // Min 1, max 999
        const clampedQuantity = Math.max(1, Math.min(999, quantity));
        
        if (clampedQuantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: clampedQuantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotals: () => {
        const state = get();
        
        if (state.items.length === 0) {
          return {
            totalHt: null,
            currency: null,
            hasMixedCurrencies: false,
            hasQuoteOnly: false,
          };
        }

        // Vérifier hasQuoteOnly : true si au moins un item isQuoteOnly ou priceHt null
        const hasQuoteOnly = state.items.some(
          (item) => item.isQuoteOnly || item.priceHt === null
        );

        // Filtrer les items avec prix valide (pour vérifier devises mixtes)
        const itemsWithPrice = state.items.filter(
          (item) => item.priceHt !== null
        );

        // Vérifier les devises mixtes (ignorer les items avec priceHt null)
        const currencies = new Set(
          itemsWithPrice.map((item) => item.priceCurrency)
        );
        const hasMixedCurrencies = currencies.size > 1;

        // Calculer totalHt : null si hasMixedCurrencies ou hasQuoteOnly
        let totalHt: number | null = null;
        let currency: PriceCurrency | null = null;

        if (!hasMixedCurrencies && !hasQuoteOnly && itemsWithPrice.length > 0) {
          // On peut calculer le total
          totalHt = itemsWithPrice.reduce(
            (sum, item) => sum + (item.priceHt || 0) * item.quantity,
            0
          );
          currency = itemsWithPrice[0].priceCurrency;
        } else if (!hasMixedCurrencies && itemsWithPrice.length > 0) {
          // Pas de devises mixtes mais hasQuoteOnly, on garde quand même la devise
          currency = itemsWithPrice[0].priceCurrency;
        }

        return {
          totalHt,
          currency,
          hasMixedCurrencies,
          hasQuoteOnly,
        };
      },
    }),
    {
      name: 'effinor_cart_v1',
    }
  )
);

