"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Tag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Truck,
} from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 0;

export default function CartSummary({
  subtotal,
  shipping,
  discount,
  total,
  onCheckout,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const amountNeededForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );
  const freeShippingProgress = 100;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);

    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === "VEDIC10" || cleanCode === "DIVINE" || cleanCode === "WELCOME") {
      setAppliedCoupon(cleanCode);
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code. Try 'VEDIC10'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const finalShipping = 0;
  const couponDiscount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, total - couponDiscount);

  return (
    <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-6 text-(--text-primary) shadow-sm transition-colors duration-200">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-(--border) pb-4">
        <h2 className="text-xl font-black text-(--text-primary)">
          Order Summary
        </h2>
        <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-500">
          <Sparkles className="h-3 w-3" />
          Vedic Store
        </span>
      </div>

      {/* FREE SHIPPING PROGRESS */}
      <div className="mt-5 rounded-2xl border border-(--border) bg-(--surface-tertiary) p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-(--text-primary)">
            <Truck className="h-4 w-4 text-amber-500" />
            You unlocked Free Express Delivery!
          </span>
          <span className="font-bold text-amber-500">{freeShippingProgress}%</span>
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-(--border)">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* COUPON SECTION */}
      <div className="mt-5">
        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Coupon <strong>{appliedCoupon}</strong> applied (10% OFF)
            </span>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-xs text-red-500 hover:text-red-600 underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-(--text-muted)" />
              <input
                type="text"
                placeholder="Promo Code (e.g. VEDIC10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full rounded-xl border border-(--border) bg-(--surface) py-2 pl-8 pr-3 text-xs uppercase text-(--text-primary) placeholder:normal-case placeholder:text-(--text-muted) focus:border-amber-500 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl border border-(--border) bg-(--surface-tertiary) px-4 py-2 text-xs font-bold text-(--text-primary) transition-colors hover:border-amber-500 hover:bg-amber-500 hover:text-black cursor-pointer"
            >
              Apply
            </button>
          </form>
        )}
        {couponError && (
          <p className="mt-1.5 text-[11px] text-red-500">{couponError}</p>
        )}
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="mt-6 space-y-3 border-t border-(--border) pt-4 text-sm">
        <div className="flex justify-between text-(--text-secondary)">
          <span>Items Subtotal</span>
          <span className="font-semibold text-(--text-primary)">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between text-(--text-secondary)">
          <span className="flex items-center gap-1">
            <span>Vedic Energization Pooja</span>
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
              FREE
            </span>
          </span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Included</span>
        </div>

        <div className="flex justify-between text-(--text-secondary)">
          <span>Delivery Charges</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            FREE
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Catalog Savings</span>
            <span>-₹{discount.toLocaleString("en-IN")}</span>
          </div>
        )}

        {appliedCoupon && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Coupon Discount</span>
            <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="border-t border-(--border) pt-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-base font-bold text-(--text-primary)">
                Grand Total
              </span>
              <p className="text-[11px] text-(--text-muted)">
                Inclusive of all taxes & rituals
              </p>
            </div>
            <span className="text-2xl font-black text-amber-500 sm:text-3xl">
              ₹{finalTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* CHECKOUT BUTTON */}
      <button
        type="button"
        onClick={onCheckout}
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 py-3.5 text-sm font-black text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:opacity-95 hover:shadow-amber-500/35 active:scale-[0.99] cursor-pointer"
      >
        <Lock className="h-4 w-4" />
        <span>Proceed To Secure Checkout</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      {/* TRUST & SECURITY BADGES */}
      <div className="mt-5 flex items-center justify-center gap-4 text-center text-[11px] text-(--text-muted)">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          100% Buyer Protection
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Lock className="h-3.5 w-3.5 text-amber-500" />
          256-Bit SSL Encrypted
        </span>
      </div>
    </div>
  );
}
