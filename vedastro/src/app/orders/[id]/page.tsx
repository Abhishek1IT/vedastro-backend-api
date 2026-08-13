/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/common/Button";

import orderService from "../../../services/order.service";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await orderService.getOrder(
          params.id as string
        );

        setOrder(data?.data || data);
      } catch (error) {
        console.error("GET ORDER ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadOrder();
    }
  }, [params.id]);

  if (loading) {
    return (
      <section className="container mx-auto py-10 text-white">
        Loading order...
      </section>
    );
  }

  if (!order) {
    return (
      <section className="container mx-auto py-10 text-white">
        <p>Order not found.</p>

        <Button
          size="sm"
          className="mt-4"
          onClick={() => router.push("/orders")}
        >
          Back to Orders
        </Button>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 text-white">
      <Button
        size="sm"
        onClick={() => router.push("/orders")}
      >
        ← Back to Orders
      </Button>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">
              Order #{order._id}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <Badge variant="warning">
            {order.orderStatus}
          </Badge>
        </div>

        {/* ITEMS */}
        <div className="mt-8 space-y-4">
          {order.items?.map((item: any, index: number) => (
            <div
              key={`${item.product}-${index}`}
              className="flex items-center justify-between border-b border-slate-800 pb-4"
            >
              <div>
                <h3 className="font-bold">
                  {item.name}
                </h3>

                <p className="text-sm text-slate-400">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-bold">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-6 flex justify-between border-t border-slate-700 pt-5 text-xl font-black">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>

        {/* ADDRESS */}
        {order.shippingAddress && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold">
              Shipping Address
            </h2>

            <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-300">
              <p>
                {order.shippingAddress.fullName}
              </p>

              <p>
                {order.shippingAddress.phone}
              </p>

              <p>
                {order.shippingAddress.address}
              </p>

              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </p>

              <p>
                {order.shippingAddress.pincode}
              </p>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}