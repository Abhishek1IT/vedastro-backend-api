/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useOrderStore } from "../store/orderStore";

export default function useOrder() {
  const {
    orders,
    order,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    placeOrder,
    cancelOrder,
  } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    order,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    placeOrder,
    cancelOrder,
  };
}
