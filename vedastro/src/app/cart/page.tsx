"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2 } from "lucide-react";

import CartItem from "../../components/shop/CartItem";
import CartSummary from "../../components/shop/CartSummary";
import Button from "../../components/common/Button";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

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
      <div className="flex min-h-screen items-center justify-center text-(--text-primary)">
        Loading...
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-22 text-(--text-primary) transition-colors duration-200">
      {/* BACK TO SHOP */}
      <div className="mb-4">
        <Button
          size="sm"
          onClick={() => router.push("/shop")}
        >
          ← Back to Shop
        </Button>
      </div>

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--accent-hover)">
            Cart
          </p>

          <h1 className="mt-3 text-4xl font-black text-(--text-primary)">Shopping Cart</h1>
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
        <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-200">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && !items.length ? (
        <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-8 text-center text-(--text-secondary)">
          Loading cart...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-(--border) bg-(--surface-secondary) p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/10 text-2xl">
            🛒
          </div>

          <h2 className="text-2xl font-bold text-(--text-primary)">Your cart is empty</h2>

          <Button className="mt-6" onClick={() => router.push("/shop")}>
            Browse Products
          </Button>
        </div>
      ) : (
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

          {/* SUMMARY PANELS */}
          <div className="space-y-4">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              onCheckout={handleCheckout}
            />

            <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--text-muted)">
                Quick Actions
              </p>

              <div className="mt-4 grid gap-3">
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
