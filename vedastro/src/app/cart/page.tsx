"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
} from "lucide-react";

import CartItem from "../../components/shop/CartItem";
import CartSummary from "../../components/shop/CartSummary";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

export default function CartPage() {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [clearing, setClearing] = useState(false);

  const {
    items,
    loading,
    error,
    subtotal,
    shipping,
    discount,
    total,
    fetchCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    if (!isHydrated) return;
    fetchCart();
  }, [isHydrated, fetchCart]);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleDecrease = async (id: string, quantity: number) => {
    if (quantity <= 1) return;
    await updateQuantity(id, quantity - 1);
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?",
    );
    if (!confirmed) return;

    setClearing(true);
    try {
      await clearCart();
    } finally {
      setClearing(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--background) text-(--text-primary)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="text-sm text-(--text-muted)">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const totalItemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-(--background) py-24 text-(--text-primary) transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* STEP PROGRESS BAR */}
        <div className="mb-10 flex items-center justify-center">
          <div className="flex w-full max-w-xl items-center justify-between">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-black shadow-md shadow-amber-500/20">
                1
              </div>
              <span className="text-xs font-bold text-(--text-primary) sm:text-sm">
                Cart
              </span>
            </div>

            <div className="h-0.5 flex-1 bg-amber-500/30 mx-2 sm:mx-4" />

            {/* Step 2 */}
            <div className="flex items-center gap-2 opacity-60">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border) bg-(--surface-secondary) text-xs font-bold text-(--text-muted)">
                2
              </div>
              <span className="hidden text-xs font-medium text-(--text-muted) sm:inline sm:text-sm">
                Checkout
              </span>
            </div>

            <div className="h-0.5 flex-1 bg-(--border) mx-2 sm:mx-4" />

            {/* Step 3 */}
            <div className="flex items-center gap-2 opacity-60">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border) bg-(--surface-secondary) text-xs font-bold text-(--text-muted)">
                3
              </div>
              <span className="hidden text-xs font-medium text-(--text-muted) sm:inline sm:text-sm">
                Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* TRUST BANNER STRIP */}
        <div className="mb-8 grid grid-cols-2 gap-3 rounded-2xl border border-(--border) bg-(--surface-secondary) p-3 sm:grid-cols-4 sm:gap-4 sm:p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-(--text-primary)">
                100% Authentic
              </p>
              <p className="text-[10px] text-(--text-muted)">Pran Pratishtha</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-(--text-primary)">
                Free Shipping
              </p>
              <p className="text-[10px] text-(--text-muted)">On all orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-(--text-primary)">
                7-Day Returns
              </p>
              <p className="text-[10px] text-(--text-muted)">Hassle-free policy</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-500">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-(--text-primary)">
                Astrologer Certified
              </p>
              <p className="text-[10px] text-(--text-muted)">Vedic Gurus</p>
            </div>
          </div>
        </div>

        {/* PAGE HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 transition-colors hover:text-amber-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Vedic Store</span>
            </Link>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-(--text-primary) sm:text-4xl">
              Shopping Cart
            </h1>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearCart}
                disabled={clearing || loading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-(--border) bg-(--surface-secondary) px-3.5 py-2 text-xs font-semibold text-red-500 transition-colors hover:border-red-500/40 hover:bg-red-500/10 disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{clearing ? "Clearing..." : "Clear Cart"}</span>
              </button>

              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 rounded-xl border border-(--border) bg-(--surface-secondary) px-4 py-2 text-xs font-semibold text-(--text-primary) transition-colors hover:bg-(--surface-tertiary)"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          )}
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* LOADING SKELETON */}
        {loading && !items.length ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl border border-(--border) bg-(--surface-secondary)"
                />
              ))}
            </div>
            <div className="h-80 animate-pulse rounded-3xl border border-(--border) bg-(--surface-secondary)" />
          </div>
        ) : items.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-3xl border border-dashed border-(--border) bg-(--surface-secondary) p-10 text-center sm:p-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/15 text-amber-500 ring-8 ring-amber-500/5">
              <ShoppingBag className="h-10 w-10" />
            </div>

            <h2 className="mt-6 text-2xl font-black text-(--text-primary)">
              Your Cart is Empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-(--text-muted)">
              Explore our spiritually energized Rudraksha, Lab-Certified
              Gemstones, Yantras, and Vedic Puja Samagri to enrich your life.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-black shadow-md shadow-amber-500/20 transition-all hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" />
                <span>Explore Vedic Store</span>
              </Link>
              <Link
                href="/consultations"
                className="inline-flex items-center gap-2 rounded-2xl border border-(--border) bg-(--surface-tertiary) px-6 py-3 text-sm font-bold text-(--text-primary) transition-all hover:bg-(--surface)"
              >
                <span>Consult an Astrologer</span>
              </Link>
            </div>

            {/* QUICK CATEGORY SHORTCUTS */}
<div className="mt-12 border-t border-(--border) pt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                Popular Categories
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  "Rudraksha",
                  "Gemstones",
                  "Yantras",
                  "Bracelets",
                  "Pyramids",
                  "Puja Samagri",
                  "Herbal Remedies",
                ].map((cat) => (
                  <Link
                    key={cat}
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    className="rounded-xl border border-(--border) bg-(--surface-tertiary) px-3 py-1.5 text-xs text-(--text-secondary) transition-colors hover:border-amber-500 hover:text-amber-500"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* CART CONTENT */
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* CART ITEMS LIST */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  Items in Basket ({totalItemsCount})
                </span>
              </div>

              {items.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onIncrease={() =>
                    updateQuantity(item.product._id, item.quantity + 1)
                  }
                  onDecrease={() =>
                    handleDecrease(item.product._id, item.quantity)
                  }
                  onRemove={() => removeItem(item.product._id)}
                />
              ))}
            </div>

            {/* STICKY ORDER SUMMARY */}
            <div className="lg:sticky lg:top-28 lg:self-start space-y-4">
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
