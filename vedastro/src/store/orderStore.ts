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
  placeOrder: (data: any) => Promise<Order>;
  cancelOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  order: null,
  loading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });

      const res = await OrderService.getOrders();

      set({
        orders: res.data,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch orders",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  fetchOrder: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const res = await OrderService.getOrder(id);

      set({
        order: res.data,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch order",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  placeOrder: async (data: any) => {
    try {
      set({ loading: true, error: null });

      const res = await OrderService.placeOrder(data);

      return res.data;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to place order",
      });
      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  cancelOrder: async (id: string) => {
    try {
      set({ loading: true, error: null });

      await OrderService.cancelOrder(id);

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, orderStatus: "CANCELLED" } : order,
        ),
        order:
          state.order?._id === id
            ? { ...state.order, orderStatus: "CANCELLED" }
            : state.order,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to cancel order",
      });
      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
