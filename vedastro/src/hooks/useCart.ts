/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";

import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export function useCart() {
  const cart = useCartStore();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    const loadCart = async () => {
      if (isAuthenticated) {
        await cart.syncGuestCart();
      } else {
        await cart.fetchCart();
      }
    };

    loadCart();
  }, [isAuthenticated, isHydrated]);

  return cart;
}
