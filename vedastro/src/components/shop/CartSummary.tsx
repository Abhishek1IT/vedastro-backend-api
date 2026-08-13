"use client";

import Card from "../ui/Card";
import Button from "../common/Button";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onCheckout: () => void;
}

export default function CartSummary({
  subtotal,
  shipping,
  discount,
  total,
  onCheckout,
}: CartSummaryProps) {
  return (
    <Card>
      <h2 className="mb-6 text-xl font-black">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>

          <span>₹{shipping}</span>
        </div>

        <div className="flex justify-between text-emerald-400">
          <span>Discount</span>

          <span>-₹{discount}</span>
        </div>

        <hr className="border-slate-800" />

        <div className="flex justify-between text-2xl font-black">
          <span>Total</span>

          <span>₹{total}</span>
        </div>
      </div>

      <Button className="mt-8 w-full" size="lg" onClick={onCheckout}>
        Proceed To Checkout
      </Button>
    </Card>
  );
}