/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import OrderService from "../services/order.service";
import { Order } from "../types/order";

interface OrderState {
  orders: Order[];
  order: Order | null;

  loading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;

  fetchOrder: (id: string) => Promise<void>;

  placeOrder: (data: any) => Promise<any>;

  cancelOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  order: null,

  loading: false,

  error: null,

  fetchOrders: async () => {
    try {
      set({ loading: true });

      const res = await OrderService.getOrders();

      set({
        orders: res.data,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  fetchOrder: async (id) => {
    try {
      set({ loading: true });

      const res = await OrderService.getOrder(id);

      set({
        order: res.data,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  placeOrder: async (data) => {
    const res = await OrderService.placeOrder(data);

    return res.data;
  },

  cancelOrder: async (id) => {
    await OrderService.cancelOrder(id);
  },
}));
