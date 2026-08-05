/* eslint-disable @typescript-eslint/no-explicit-any */

import lib from "../lib/axios";

const OrderService = {
  async getOrders() {
    const res = await lib.get("/orders");
    return res.data;
  },

  async getOrder(id: string) {
    const res = await lib.get(`/orders/${id}`);
    return res.data;
  },

  async placeOrder(data: any) {
    const res = await lib.post("/orders", data);
    return res.data;
  },

  async cancelOrder(id: string) {
    const res = await lib.patch(`/orders/${id}/cancel`);
    return res.data;
  },

  async updateOrderStatus(id: string, status: string) {
    const res = await lib.put(`/orders/${id}/status`, {
      status,
    });

    return res.data;
  },
};

export default OrderService;
