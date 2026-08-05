"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useOrderStore } from "../store/orderStore";
import { useCartStore } from "../store/cartStore";

export function useCheckout() {
  const router = useRouter();

  const { placeOrder } = useOrderStore();
  const { fetchCart } = useCartStore();

  const [loading, setLoading] = useState(false);

  const checkout = async (
    shippingAddress: {
      fullName: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    },
    paymentMethod: "COD" | "ONLINE",
  ) => {
    try {
      setLoading(true);

      const order = await placeOrder({
        shippingAddress,
        paymentMethod,
      });

      await fetchCart();

      router.push(`/orders/${order._id}`);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkout,
    loading,
  };
}
