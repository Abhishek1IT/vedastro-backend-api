/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import CheckoutForm from "../../components/shop/CheckoutForm";
import PaymentMethod from "../../components/shop/PaymentMethod";

import { useCheckout } from "../../hooks/useCheckout";

export default function CheckoutPage() {
  const { checkout, loading } = useCheckout();

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  const handleSubmit = async (address: any) => {
    await checkout(address, paymentMethod);
  };

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
