"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";

import CartItem from "../../components/shop/CartItem";
import CartSummary from "../../components/shop/CartSummary";
import Button from "../../components/common/Button";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();

  const isHydrated = useAuthStore((state) => state.isHydrated);

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

  // IMPORTANT:
  // Guest user ko bhi cart dikhana hai.
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
    await clearCart();
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 text-white">
      {/* BACK TO SHOP */}
      <div className="mb-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          <span>Back To Shop</span>
        </Link>
      </div>

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">
            Cart
          </p>

          <h1 className="mt-3 text-4xl font-black">Shopping Cart</h1>

          <p className="mt-2 text-slate-400">
            Review items, adjust quantities, remove products, and proceed to
            checkout.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => router.push("/shop")}>
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </span>
          </Button>

          <Button
            variant="danger"
            onClick={handleClearCart}
            disabled={!items.length || loading}
          >
            <span className="inline-flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </span>
          </Button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && !items.length ? (
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-center text-slate-400">
          Loading cart...
        </div>
      ) : items.length === 0 ? (
        /* EMPTY CART */
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/10 text-2xl">
            🛒
          </div>

          <h2 className="text-2xl font-bold">Your cart is empty</h2>

          <p className="mt-2 text-slate-400">
            Add products from the shop to see them here.
          </p>

          <Button className="mt-6" onClick={() => router.push("/shop")}>
            Browse Products
          </Button>
        </div>
      ) : (
        /* CART */
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* ITEMS */}
          <div className="space-y-5">
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

          {/* SUMMARY */}
          <div className="space-y-4">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              onCheckout={handleCheckout}
            />

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Quick Actions
              </p>

              <div className="mt-4 grid gap-3">
                <Button variant="secondary" onClick={handleCheckout}>
                  <span className="inline-flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Go to Checkout
                  </span>
                </Button>

                <Button variant="ghost" onClick={() => router.push("/shop")}>
                  Continue Browsing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
