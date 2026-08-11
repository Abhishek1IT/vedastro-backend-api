/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GuestCartProduct {
  _id: string;
  name: string;
  slug?: string;
  category?: string;
  price: number;
  salePrice?: number;
  stock: number;
  energyTag?: string;
  images?: any[];
}

export interface GuestCartItem {
  productId: string;
  quantity: number;
  product: GuestCartProduct;
}

interface GuestCartState {
  items: GuestCartItem[];

  addItem: (
    productId: string,
    quantity?: number,
    product?: GuestCartProduct,
  ) => void;

  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useGuestCartStore = create<GuestCartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (productId, quantity = 1, product) =>
        set((state) => {
          const existing = state.items.find(
            (item) => String(item.productId) === String(productId),
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                String(item.productId) === String(productId)
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                    }
                  : item,
              ),
            };
          }

          if (!product) {
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                productId,
                quantity,
                product,
              },
            ],
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item) => String(item.productId) !== String(productId),
                )
              : state.items.map((item) =>
                  String(item.productId) === String(productId)
                    ? {
                        ...item,
                        quantity,
                      }
                    : item,
                ),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => String(item.productId) !== String(productId),
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "vedastro-guest-cart",
    },
  ),
);
