"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import orderService from "../services/order.service";

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface BuyNowItem {
  productId?: string;
  quantity?: number;
}

export function useCheckout() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const checkout = async (
    shippingAddress: ShippingAddress,
    paymentMethod: "COD" | "ONLINE",
    buyNow?: BuyNowItem,
  ) => {
    try {
      setLoading(true);

      const orderData = {
        shippingAddress,
        paymentMethod,

        ...(buyNow?.productId
          ? {
              productId: buyNow.productId,
              quantity: buyNow.quantity || 1,
            }
          : {}),
      };

      console.log("ORDER DATA:", orderData);

      await orderService.placeOrder(orderData);

      router.push("/orders");
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);
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
