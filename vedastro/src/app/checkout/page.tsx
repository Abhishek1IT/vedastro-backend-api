/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CheckoutForm from "../../components/shop/CheckoutForm";
import PaymentMethod from "../../components/shop/PaymentMethod";

import { useCheckout } from "../../hooks/useCheckout";
import { useAuthStore } from "../../store/authStore";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const { checkout, loading } = useCheckout();

  const { isAuthenticated, isHydrated } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  // LOGIN REQUIRED ONLY AT CHECKOUT
  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent("/checkout")}`);
    }
  }, [isAuthenticated, isHydrated, router]);

  // PLACE ORDER
  const handleSubmit = async (address: any) => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    try {
      await checkout(address, paymentMethod);
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);
    }
  };

  // HYDRATION
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  // NOT LOGGED IN
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold">
            Login required to place your order
          </p>

          <p className="mt-2 text-sm text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // CHECKOUT
  return (
    <section className="container mx-auto px-4 py-10">
      {/* BACK TO CART */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          <span>Back To Cart</span>
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <CheckoutForm onSubmit={handleSubmit} />

        <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      {loading && (
        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-center text-sm font-semibold text-amber-400">
          Placing Order...
        </div>
      )}
    </section>
  );
}