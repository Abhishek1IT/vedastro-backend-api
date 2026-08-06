/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useOrderStore } from "../../../store/orderStore";
import Badge from "../../../components/ui/Badge";

export default function OrderDetailsPage() {
  const { id } = useParams();

  const { order, fetchOrder } = useOrderStore();

  useEffect(() => {
    if (id) {
      fetchOrder(id as string);
    }
  }, [id]);

  if (!order) {
    return <div className="container mx-auto py-20">Loading...</div>;
  }

  return (
    <section className="container mx-auto py-10">
      <h1 className="text-4xl font-black">
        Order #{order._id.slice(-6).toUpperCase()}
      </h1>

      <Badge
        variant={order.orderStatus === "DELIVERED" ? "success" : "warning"}
        className="mt-4"
      >
        {order.orderStatus}
      </Badge>

      <div className="mt-8 rounded-xl border border-slate-800 p-5">
        <h2 className="mb-4 text-xl font-bold">Ordered Items</h2>

        {order.items.map((item: any) => (
          <div
            key={item.product._id}
            className="mb-3 flex items-center justify-between"
          >
            <span>{item.product?.name}</span>

            <span>
              {item.quantity} × ₹{item.price}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-2xl font-black">Total : ₹{order.total}</div>
    </section>
  );
}
