/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";

import CartService from "../services/cart.service";

interface CartItem {
  _id: string;

  product: any;

  quantity: number;
}

interface CartState {
  items: CartItem[];

  loading: boolean;

  error: string | null;

  totalItems: number;

  subtotal: number;

  shipping: number;

  discount: number;

  total: number;

  fetchCart: () => Promise<void>;

  addToCart: (productId: string, quantity?: number) => Promise<void>;

  updateQuantity: (id: string, quantity: number) => Promise<void>;

  removeItem: (id: string) => Promise<void>;

  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  loading: false,

  error: null,

  totalItems: 0,

  subtotal: 0,

  shipping: 99,

  discount: 0,

  total: 0,

  fetchCart: async () => {
    try {
      set({ loading: true });

      const res = await CartService.getCart();

      console.log("GET CART RESPONSE:", res);
      console.log("GET CART DATA:", res.data);

      const cart = res.data.data;

      const items = cart.items || [];

      const subtotal = items.reduce(
        (sum: number, item: any) =>
          sum + (item.product.salePrice || item.product.price) * item.quantity,
        0,
      );

      const shipping = subtotal > 999 ? 0 : 99;

      const discount = 0;

      set({
        items,
        subtotal,
        shipping,
        discount,
        total: subtotal + shipping - discount,
        totalItems: items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0,
        ),
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Unable to load cart",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    console.log("ADDING PRODUCT:", productId);

    await CartService.addToCart(productId, quantity);

    await get().fetchCart();

    console.log("CART STATE:", get().items);
  },

  updateQuantity: async (id, quantity) => {
    await CartService.updateQuantity(id, quantity);

    await get().fetchCart();
  },

  removeItem: async (id) => {
    await CartService.removeItem(id);

    await get().fetchCart();
  },

  clearCart: async () => {
    await CartService.clearCart();

    set({
      items: [],

      subtotal: 0,

      total: 0,

      totalItems: 0,
    });
  },
}));
