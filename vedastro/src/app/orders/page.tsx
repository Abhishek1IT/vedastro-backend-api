"use client";

import { useEffect } from "react";

import OrderCard from "../../components/shop/OrderCard";

import { useOrderStore } from "../../store/orderStore";

import type { Order } from "../../types/order";

export default function OrdersPage() {
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <section className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-black">My Orders</h1>

      <div className="space-y-5">
        {orders.map((order: Order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </section>
  );
}
