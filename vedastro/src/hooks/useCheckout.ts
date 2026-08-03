/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";

export function useCheckout() {
  const [loading, setLoading] = useState(false);

  const cart = useCartStore();

  const orderStore = useOrderStore();

  const checkout = async (address: any, paymentMethod: string) => {
    try {
      setLoading(true);

      const order = await orderStore.placeOrder({
        address,
        paymentMethod,
      });

      await cart.clearCart();

      return order;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkout,
    loading,
  };
}
