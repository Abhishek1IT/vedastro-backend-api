"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import CheckoutForm from "../../components/shop/CheckoutForm";
import PaymentMethod from "../../components/shop/PaymentMethod";

import { useCheckout } from "../../hooks/useCheckout";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";

import Button from "@/src/components/common/Button";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { checkout, loading } = useCheckout();

  const {
    isAuthenticated,
    isHydrated,
    openLoginModal,
  } = useAuthStore();

  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "ONLINE">("COD");

  const productId =
    searchParams.get("productId");

  const quantity =
    Number(searchParams.get("quantity")) || 1;

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [
    isHydrated,
    isAuthenticated,
    openLoginModal,
  ]);

  const handleSubmit = async (address: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    try {
      await checkout(
        address,
        paymentMethod,
        productId
          ? {
            productId,
            quantity,
          }
          : undefined
      );
    } catch (error) {
      console.error(
        "CHECKOUT ERROR:",
        error
      );
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold">
            Login required to place your order
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Please login to continue.
          </p>

          <button
            type="button"
            onClick={openLoginModal}
            className="mt-5 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Button
          size="sm"
          onClick={() => router.push("/shop")}
        >
          ← Back to Shop
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <CheckoutForm
          onSubmit={handleSubmit}
        />

        <PaymentMethod
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
      </div>

      {loading && (
        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-center text-sm font-semibold text-amber-400">
          Placing Order...
        </div>
      )}
    </section>
  );
}