"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import OrderCard from "../../components/shop/OrderCard";
import { useOrderStore } from "../../store/orderStore";
import { useAuthStore } from "../../store/authStore";

import type { Order } from "../../types/order";
import Button from "@/src/components/common/Button";

export default function OrdersPage() {
  const router = useRouter();

  const { orders, fetchOrders } = useOrderStore();

  const {
    isAuthenticated,
    isHydrated,
    openLoginModal,
  } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    fetchOrders();
  }, [
    isAuthenticated,
    isHydrated,
    fetchOrders,
    router,
    openLoginModal,
  ]);

  if (!isHydrated) {
    return (
      <section className="container mx-auto py-10">
        <div className="text-center text-slate-400">
          Loading orders...
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="container mx-auto py-10">
        <div className="text-center text-slate-400">
          Redirecting to login...
        </div>
      </section>
    );
  }

  const handleCancelOrder = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      await useOrderStore.getState().cancelOrder(id);

      await fetchOrders();
    } catch (error) {
      console.error("CANCEL ORDER ERROR:", error);
      alert("Unable to cancel order");
    }
  };

  return (
    <section className="container mx-auto py-24">
      <Button
              size="sm"
              onClick={() => router.push("/cart")}
            >
              ← Back to Cart
            </Button>

        <h1 className="mb-8 text-4xl font-black">
          My Orders
        </h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          <p className="text-lg text-slate-300">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order: Order) => (
            <OrderCard
              key={order._id}
              order={order}
              onView={(id) => router.push(`/orders/${id}`)}
              onCancel={handleCancelOrder}
            />
          ))}
        </div>
      )}
    </section>
  );
}