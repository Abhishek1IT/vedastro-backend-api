/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useOrderStore } from "../store/orderStore";

export function useOrder() {
  const store = useOrderStore();

  useEffect(() => {
    store.fetchOrders();
  }, []);

  return store;
}
