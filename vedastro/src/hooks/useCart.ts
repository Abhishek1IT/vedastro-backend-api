/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";

import { useCartStore } from "../store/cartStore";

export function useCart() {
  const cart = useCartStore();

  useEffect(() => {
    cart.fetchCart();
  }, []);

  return cart;
}
