/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CheckoutForm from "../../components/shop/CheckoutForm";
import PaymentMethod from "../../components/shop/PaymentMethod";

import { useCheckout } from "../../hooks/useCheckout";
import { useAuthStore } from "../../store/authStore";

export default function CheckoutPage() {
  const router = useRouter();

  const { checkout, loading } = useCheckout();

  const { isAuthenticated, isHydrated } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace(
        `/complete-profile?redirect=${encodeURIComponent("/cart")}`
      );
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleSubmit = async (address: any) => {
    if (!isAuthenticated) {
      router.replace(
        `/complete-profile?redirect=${encodeURIComponent("/cart")}`
      );
      return;
    }

    await checkout(address, paymentMethod);
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="container mx-auto py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <CheckoutForm onSubmit={handleSubmit} />

        <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      {loading && <p className="mt-5">Placing Order...</p>}
    </section>
  );
}
