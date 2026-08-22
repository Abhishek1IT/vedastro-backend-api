/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import CheckoutForm, { CheckoutData } from "../../components/shop/CheckoutForm";
import PaymentMethod from "../../components/shop/PaymentMethod";
import { useCheckout } from "../../hooks/useCheckout";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import ProductService from "../../services/product.service";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { checkout, loading } = useCheckout();
  const { isAuthenticated, isHydrated, openLoginModal } = useAuthStore();
  const { items: cartItems, subtotal: cartSubtotal, total: cartTotal, shipping: cartShipping, fetchCart } =
    useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("ONLINE");
  const [buyNowProduct, setBuyNowProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const productId = searchParams.get("productId");
  const quantity = Math.max(1, Number(searchParams.get("quantity")) || 1);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isHydrated, isAuthenticated, openLoginModal]);

  useEffect(() => {
    if (productId) {
      setLoadingProduct(true);
      ProductService.getProduct(productId)
        .then((res) => {
          setBuyNowProduct(res?.data || res);
        })
        .catch((err) => {
          console.error("Failed to load Buy Now product:", err);
        })
        .finally(() => {
          setLoadingProduct(false);
        });
    } else {
      if (isHydrated && isAuthenticated) {
        fetchCart();
      }
    }
  }, [productId, isHydrated, isAuthenticated, fetchCart]);

  const handleSubmit = async (address: CheckoutData) => {
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
          : undefined,
      );
    } catch (error) {
      console.error("CHECKOUT SUBMIT ERROR:", error);
    }
  };

  // Calculations
  const isBuyNow = Boolean(productId && buyNowProduct);
  const singlePrice = isBuyNow
    ? (buyNowProduct.salePrice ?? buyNowProduct.price ?? 0)
    : 0;
  const singleSubtotal = singlePrice * quantity;
  const singleShipping = singleSubtotal >= 0 ? 0 : 0;
  const singleTotal = singleSubtotal + singleShipping;

  const displaySubtotal = isBuyNow ? singleSubtotal : cartSubtotal;
  const displayShipping = isBuyNow
    ? singleShipping
    : cartSubtotal >= 0
      ? 0
      : cartShipping;
  const displayTotal = isBuyNow ? singleTotal : (cartSubtotal + displayShipping);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--background) text-(--text-primary)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="text-sm text-(--text-muted)">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--background) px-4 py-24 text-(--text-primary)">
        <div className="max-w-md rounded-3xl border border-(--border) bg-(--surface-secondary) p-8 text-center shadow-xl dark:border-[#26201a] dark:bg-[#14100c]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Lock className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-black text-(--text-primary)">
            Login Required
          </h2>

          <p className="mt-2 text-xs text-(--text-muted)">
            Please sign in to your VedAstro account to link your energized
            orders, track shipping, and receive astrology consultation benefits.
          </p>

          <button
            type="button"
            onClick={openLoginModal}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition-all hover:opacity-95 cursor-pointer"
          >
            <span>Login to Continue</span>
          </button>

          <Link
            href="/shop"
            className="mt-4 inline-block text-xs font-semibold text-(--text-muted) hover:text-amber-500"
          >
            ← Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background) py-24 text-(--text-primary) transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* STEP PROGRESS BAR */}
        <div className="mb-10 flex items-center justify-center">
          <div className="flex w-full max-w-xl items-center justify-between">
            {/* Step 1 */}
            <Link href="/cart" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-emerald-500 sm:text-sm">
                Cart
              </span>
            </Link>

            <div className="h-0.5 flex-1 bg-amber-500 mx-2 sm:mx-4" />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-black shadow-md shadow-amber-500/20">
                2
              </div>
              <span className="text-xs font-bold text-(--text-primary) sm:text-sm">
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

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 transition-colors hover:text-amber-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Shopping Cart</span>
          </Link>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-(--text-primary) sm:text-4xl">
            Secure Checkout
          </h1>
          <p className="mt-1 text-sm text-(--text-muted)">
            Complete your shipping address and select your payment mode.
          </p>
        </div>

        {/* CHECKOUT GRID */}
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* LEFT: ADDRESS & PAYMENT FORM */}
          <div className="space-y-6">
            <PaymentMethod
              value={paymentMethod}
              onChange={setPaymentMethod}
            />

            <CheckoutForm
              onSubmit={handleSubmit}
              loading={loading}
              totalAmount={displayTotal}
            />
          </div>

          {/* RIGHT: STICKY ORDER SUMMARY & REVIEW */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
            <div className="rounded-3xl border border-(--border) bg-white p-6 text-(--text-primary) shadow-sm dark:border-[#26201a]">
              <div className="flex items-center justify-between border-b border-(--border) pb-4 dark:border-[#26201a]">
                <h2 className="text-lg font-black text-(--text-primary)">
                  Order Review
                </h2>
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
                  <Package className="h-3 w-3" />
                  {isBuyNow ? `1 Item (${quantity} Qty)` : `${cartItems.length} Item(s)`}
                </span>
              </div>

              {/* PRODUCTS PREVIEW LIST */}
              <div className="mt-4 max-h-72 overflow-y-auto space-y-3 pr-1">
                {isBuyNow && buyNowProduct ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-(--border) bg-white p-3 dark:border-[#2d241c]">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-(--surface-tertiary)">
                      {buyNowProduct.images?.[0]?.url ? (
                        <img
                          src={
                            buyNowProduct.images[0].url.startsWith("http")
                              ? buyNowProduct.images[0].url
                              : `${BACKEND_URL.replace(/\/$/, "")}/${buyNowProduct.images[0].url.replace(/^\//, "")}`
                          }
                          alt={buyNowProduct.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-(--text-muted)">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-(--text-primary) line-clamp-1">
                        {buyNowProduct.name}
                      </p>
                      <p className="text-[11px] text-(--text-muted)">
                        Qty: {quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-(--text-primary)">
                        ₹{(singlePrice * quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const rawImg = item.product?.images?.[0]?.url;
                    const imgUrl = rawImg
                      ? rawImg.startsWith("http")
                        ? rawImg
                        : `${BACKEND_URL.replace(/\/$/, "")}/${rawImg.replace(/^\//, "")}`
                      : "/images/product-placeholder.png";

                    const itemPrice = item.product?.salePrice ?? item.product?.price ?? 0;

                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 rounded-2xl border border-(--border) bg-white p-3 dark:border-[#2d241c]"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-(--surface-tertiary)">
                          <img
                            src={imgUrl}
                            alt={item.product?.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-(--text-primary) line-clamp-1">
                            {item.product?.name}
                          </p>
                          <p className="text-[11px] text-(--text-muted)">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-(--text-primary)">
                            ₹{(itemPrice * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="mt-5 space-y-3 border-t border-(--border) pt-4 text-xs dark:border-[#26201a]">
                <div className="flex justify-between text-(--text-secondary)">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-(--text-primary)">
                    ₹{displaySubtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-(--text-secondary)">
                  <span className="flex items-center gap-1">
                    <span>Pran Pratishtha Energization</span>
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  </span>
                  <span className="font-medium text-emerald-500">FREE</span>
                </div>

                <div className="flex justify-between text-(--text-secondary)">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-(--text-primary)">
                    {displayShipping === 0 ? (
                      <span className="text-emerald-500 font-bold">FREE</span>
                    ) : (
                      `₹${displayShipping}`
                    )}
                  </span>
                </div>

                <div className="border-t border-(--border) pt-3 dark:border-[#26201a]">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-(--text-primary)">
                        Total Amount
                      </span>
                      <p className="text-[10px] text-(--text-muted)">
                        Taxes & Puja Rituals included
                      </p>
                    </div>
                    <span className="text-2xl font-black text-amber-500">
                      ₹{displayTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}