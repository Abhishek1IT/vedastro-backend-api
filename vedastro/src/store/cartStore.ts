/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { create } from "zustand";
import CartService from "../services/cart.service";
import { useAuthStore } from "./authStore";
import { useGuestCartStore, GuestCartProduct } from "./guestCartStore";

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

  addToCart: (
    productId: string,
    quantity?: number,
    product?: GuestCartProduct,
  ) => Promise<void>;

  syncGuestCart: () => Promise<void>;

  updateQuantity: (productId: string, quantity: number) => Promise<void>;

  removeItem: (productId: string) => Promise<void>;

  clearCart: () => Promise<void>;
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.salePrice ?? item.product?.price ?? 0;

    return sum + Number(price) * Number(item.quantity || 0);
  }, 0);

  const shipping = subtotal === 0 || subtotal > 999 ? 0 : 99;

  const discount = 0;

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  const total = subtotal + shipping - discount;

  return {
    subtotal,
    shipping,
    discount,
    total,
    totalItems,
  };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  totalItems: 0,
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,

  // FETCH CART
  fetchCart: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    // GUEST CART
    if (!isAuthenticated) {
      const guestItems = useGuestCartStore.getState().items;

      const items: CartItem[] = guestItems.map((item) => ({
        _id: `guest-${item.productId}`,
        product: item.product,
        quantity: item.quantity,
      }));

      const totals = calculateTotals(items);

      set({
        items,
        loading: false,
        error: null,
        ...totals,
      });

      return;
    }

    // LOGGED-IN CART
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await CartService.getCart();

      const cart = res?.data;

      if (!cart) {
        set({
          items: [],
          subtotal: 0,
          shipping: 0,
          discount: 0,
          total: 0,
          totalItems: 0,
        });

        return;
      }

      const items: CartItem[] = cart.items || [];

      const totals = calculateTotals(items);

      set({
        items,
        ...totals,
      });
    } catch (err: any) {
      console.error("FETCH CART ERROR:", err);

      set({
        items: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        totalItems: 0,
        error: err?.response?.data?.message || "Unable to load cart",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ADD TO CART
  addToCart: async (productId, quantity = 1, product) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    // GUEST
    if (!isAuthenticated) {
      if (!product) {
        throw new Error("Product information is required");
      }

      useGuestCartStore.getState().addItem(productId, quantity, product);

      await get().fetchCart();

      return;
    }

    try {
      await CartService.addToCart(productId, quantity);

      await get().fetchCart();
    } catch (err: any) {
      console.error("ADD TO CART ERROR:", err);

      set({
        error: err?.response?.data?.message || "Unable to add product to cart",
      });

      throw err;
    }
  },

  syncGuestCart: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    // User login nahi hai
    if (!isAuthenticated) {
      return;
    }

    const guestItems = useGuestCartStore.getState().items;

    console.log("GUEST CART TO SYNC:", guestItems);

    if (!guestItems.length) {
      await get().fetchCart();
      return;
    }

    try {
      set({
        loading: true,
        error: null,
      });

      for (const item of guestItems) {
        await CartService.addToCart(item.productId, item.quantity);
      }

      useGuestCartStore.getState().clearCart();

      console.log("GUEST CART SYNC COMPLETE");

      await get().fetchCart();
    } catch (err: any) {
      console.error("GUEST CART SYNC ERROR:", err);

      set({
        error: err?.response?.data?.message || "Unable to restore guest cart",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // UPDATE QUANTITY
  updateQuantity: async (productId, quantity) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    // GUEST
    if (!isAuthenticated) {
      useGuestCartStore.getState().updateQuantity(productId, quantity);

      await get().fetchCart();

      return;
    }

    // LOGGED-IN
    try {
      await CartService.updateQuantity(productId, quantity);

      await get().fetchCart();
    } catch (err: any) {
      console.error("UPDATE CART ERROR:", err);

      set({
        error: err?.response?.data?.message || "Unable to update cart",
      });

      throw err;
    }
  },

  // REMOVE ITEM
  removeItem: async (productId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    // GUEST
    if (!isAuthenticated) {
      useGuestCartStore.getState().removeItem(productId);

      await get().fetchCart();

      return;
    }

    // LOGGED-IN
    try {
      await CartService.removeItem(productId);

      await get().fetchCart();
    } catch (err: any) {
      console.error("REMOVE CART ITEM ERROR:", err);

      set({
        error: err?.response?.data?.message || "Unable to remove item",
      });

      throw err;
    }
  },

  // CLEAR CART
  clearCart: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    // GUEST
    if (!isAuthenticated) {
      useGuestCartStore.getState().clearCart();

      set({
        items: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        totalItems: 0,
        error: null,
      });

      return;
    }

    // LOGGED-IN
    try {
      await CartService.clearCart();

      set({
        items: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        totalItems: 0,
        error: null,
      });
    } catch (err: any) {
      console.error("CLEAR CART ERROR:", err);

      set({
        error: err?.response?.data?.message || "Unable to clear cart",
      });

      throw err;
    }
  },
}));
