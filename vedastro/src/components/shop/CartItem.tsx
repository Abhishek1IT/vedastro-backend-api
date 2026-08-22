/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Zap, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

export interface CartProductImage {
  url: string;
  publicId?: string;
}

export interface CartProduct {
  _id: string;
  quantity: number;

  product: {
    _id: string;
    slug?: string;
    name: string;
    category: string;
    images?: CartProductImage[];
    price: number;
    salePrice?: number;
    stock: number;
    energyTag?: string;
  };
}

interface CartItemProps {
  item: CartProduct;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onBuyNow?: () => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const product = item.product;

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const rawImage = product.images?.[0]?.url;

  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BACKEND_URL.replace(/\/$/, "")}/${rawImage.replace(/^\//, "")}`
    : "/images/product-placeholder.png";

  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const savingsPerItem = hasDiscount ? product.price - product.salePrice! : 0;
  const totalSavings = savingsPerItem * item.quantity;

  const handleBuyNow = () => {
    if (!product?._id) return;
    if (item.quantity <= 0) return;

    router.push(
      `/checkout?productId=${encodeURIComponent(
        product._id,
      )}&quantity=${item.quantity}`,
    );
  };

  const handleRemoveClick = async () => {
    setIsRemoving(true);
    await onRemove();
    setIsRemoving(false);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-(--border) bg-(--surface-secondary) p-4 sm:p-6 shadow-sm transition-all duration-300 hover:border-amber-500/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* PRODUCT IMAGE */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-(--border) bg-(--surface-tertiary) sm:h-32 sm:w-32">
          <img
            src={imageUrl}
            alt={product.name || "Product"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              if (
                !e.currentTarget.src.endsWith("/images/product-placeholder.png")
              ) {
                e.currentTarget.src = "/images/product-placeholder.png";
              }
            }}
          />

          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-amber-300 backdrop-blur-xs">
            <Sparkles className="h-2.5 w-2.5" />
            <span>Vedic</span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {product.category || "Vedic Sacred Item"}
            </span>

            {product.energyTag && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Zap className="h-3 w-3" />
                {product.energyTag}
              </span>
            )}
          </div>

          <h3 className="mt-2 text-base font-bold text-(--text-primary) line-clamp-1 sm:text-lg">
            {product.name}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-(--text-muted)">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>100% Pran Pratishtha Energized</span>
          </div>

          {/* PRICE & SAVINGS */}
          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-xl font-black text-(--text-primary)">
              ₹{price.toLocaleString("en-IN")}
            </span>

            {hasDiscount && (
              <>
                <span className="text-xs text-(--text-muted) line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Save ₹{savingsPerItem}
                </span>
              </>
            )}
          </div>

          {/* QUANTITY & ACTIONS (MOBILE) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:hidden border-t border-(--border) pt-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-(--text-muted)">Qty:</span>
              <QuantitySelector
                quantity={item.quantity}
                setQuantity={(qty) => {
                  if (qty > item.quantity) onIncrease();
                  else if (qty < item.quantity) onDecrease();
                }}
                max={product.stock || 10}
              />
            </div>

            <div className="text-right">
              <span className="text-xs text-(--text-muted)">Item Total: </span>
              <span className="font-bold text-(--text-primary)">
                ₹{(price * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* DESKTOP CONTROLS & TOTAL */}
        <div className="hidden sm:flex sm:flex-col sm:items-end sm:justify-between sm:gap-4">
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-(--text-muted)">
              Total
            </p>
            <p className="text-xl font-black text-(--text-primary)">
              ₹{(price * item.quantity).toLocaleString("en-IN")}
            </p>
            {totalSavings > 0 && (
              <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Total Saved ₹{totalSavings}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <QuantitySelector
              quantity={item.quantity}
              setQuantity={(qty) => {
                if (qty > item.quantity) onIncrease();
                else if (qty < item.quantity) onDecrease();
              }}
              max={product.stock || 10}
            />

            <button
              type="button"
              onClick={handleRemoveClick}
              disabled={isRemoving}
              title="Remove item"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border) bg-(--surface-tertiary) text-(--text-muted) transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!product.stock || item.quantity <= 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3.5 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 transition-all hover:bg-amber-500 hover:text-black cursor-pointer"
          >
            <span>Instant Buy</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* MOBILE REMOVE & BUY NOW ROW */}
        <div className="flex items-center justify-between gap-2 border-t border-(--border) pt-3 sm:hidden">
          <button
            type="button"
            onClick={handleRemoveClick}
            disabled={isRemoving}
            className="flex items-center gap-1 text-xs font-medium text-red-500 transition-colors hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Remove</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!product.stock || item.quantity <= 0}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black cursor-pointer"
          >
            <span>Instant Buy</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
