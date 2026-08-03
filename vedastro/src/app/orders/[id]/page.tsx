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
    fetchOrder(id as string);
  }, [id]);

  if (!order) return <div className="container mx-auto py-20">Loading...</div>;

  return (
    <section className="container mx-auto py-10">
      <h1 className="text-4xl font-black">Order #{order.orderNumber}</h1>

      <Badge
        variant={order.status === "Delivered" ? "success" : "warning"}
        className="mt-4"
      >
        {order.status}
      </Badge>

      <div className="mt-8 rounded-xl border border-slate-800 p-5">
        <h2 className="mb-4 text-xl font-bold">Ordered Items</h2>

        {/* <pre>{JSON.stringify(order, null, 2)}</pre> */}

        {Array.isArray(order?.items) &&
          order.items.map((item: any) => (
            <div key={item._id}>
              <span>{item.product?.title}</span>
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
