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
    <Card className="bg-(--surface-secondary) border border-(--border) p-6 rounded-xl text-(--text-primary) transition-colors duration-200">
      <h2 className="mb-6 text-xl font-black text-(--text-primary)">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between text-(--text-secondary)">
          <span>Subtotal</span>
          <span className="font-semibold text-(--text-primary)">₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-(--text-secondary)">
          <span>Delivery charges</span>
          <span className="font-semibold text-(--text-primary)">₹{shipping}</span>
        </div>

        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
          <span>Discount</span>
          <span>-₹{discount}</span>
        </div>

        <hr className="border-(--border)" />

        <div className="flex justify-between text-2xl font-black text-(--text-primary)">
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
