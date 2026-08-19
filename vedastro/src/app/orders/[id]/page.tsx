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
      <section className="container mx-auto py-24 text-(--text-primary)">
        Loading order...
      </section>
    );
  }

  if (!order) {
    return (
      <section className="container mx-auto py-10 text-(--text-primary)">
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
    <section className="container mx-auto px-4 py-24 text-(--text-primary) transition-colors duration-200">
      <Button
        size="sm"
        onClick={() => router.push("/orders")}
      >
        ← Back to Orders
      </Button>

      <Card className="mt-6 bg-(--surface-secondary) border border-(--border) p-6 rounded-2xl transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-(--text-primary)">
              Order #{order._id}
            </h1>

            <p className="mt-2 text-sm text-(--text-muted)">
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
              className="flex items-center justify-between border-b border-(--border) pb-4"
            >
              <div>
                <h3 className="font-bold text-(--text-primary)">
                  {item.name}
                </h3>

                <p className="text-sm text-(--text-muted)">
                  Quantity: {item.quantity}
                </p>
              </div>

              {/* FIX: Forced price label contrast state */}
              <p className="font-bold text-(--text-primary)">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-(--border) pt-5 text-xl font-black text-(--text-primary)">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>

        {/* ADDRESS */}
        {order.shippingAddress && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-(--text-secondary)">
              Shipping Address
            </h2>

            <div className="rounded-xl bg-(--surface-secondary) p-4 text-sm text-(--text-muted) border border-(--border) shadow-inner">
              <p className="font-semibold text-(--text-primary) mb-1">
                {order.shippingAddress.fullName}
              </p>

              <p className="text-(--text-muted) mb-1">
                {order.shippingAddress.phone}
              </p>

              <p className="text-(--text-muted)">
                {order.shippingAddress.address}
              </p>

              <p className="text-(--text-muted)">
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </p>

              <p className="text-(--text-muted) font-mono mt-1 text-xs">
                {order.shippingAddress.pincode}
              </p>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
