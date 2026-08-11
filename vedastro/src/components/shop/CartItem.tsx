/* eslint-disable @next/next/no-img-element */
"use client";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../common/Button";
import QuantitySelector from "./QuantitySelector";
import { useRouter } from "next/navigation";

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
  onBuyNow,
}: CartItemProps) {
  const router = useRouter();
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

  const handleBuyNow = () => {
    if (!product?._id) {
      console.error("Product ID missing");
      return;
    }

    if (item.quantity <= 0) {
      return;
    }

    router.push(
      `/checkout?productId=${encodeURIComponent(
        product._id,
      )}&quantity=${item.quantity}`,
    );
  };

  return (
    <Card className="flex flex-col gap-5 p-5 sm:flex-row">
      {/* PRODUCT IMAGE */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-900 sm:h-32 sm:w-32">
        <img
          src={imageUrl}
          alt={product.name || "Product"}
          className="h-full w-full object-cover"
          onError={(e) => {
            console.error("CART IMAGE LOAD FAILED:", imageUrl);

            if (
              !e.currentTarget.src.endsWith("/images/product-placeholder.png")
            ) {
              e.currentTarget.src = "/images/product-placeholder.png";
            }
          }}
        />
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex-1">
        {product.energyTag && (
          <Badge variant="amber" className="mb-2">
            ✨ {product.energyTag}
          </Badge>
        )}

        <h3 className="text-xl font-bold text-white">{product.name}</h3>

        <p className="mt-1 text-slate-400">{product.category}</p>

        {/* PRICE */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-2xl font-black text-amber-400">₹{price}</span>

          {product.salePrice && product.salePrice < product.price && (
            <span className="text-sm text-slate-500 line-through">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* QUANTITY */}
        <div className="mt-5">
          <QuantitySelector
            quantity={item.quantity}
            setQuantity={(qty) => {
              if (qty > item.quantity) {
                onIncrease();
              } else if (qty < item.quantity) {
                onDecrease();
              }
            }}
            max={product.stock}
          />
        </div>
      </div>

      {/* TOTAL / ACTIONS */}
      <div className="flex flex-col justify-between sm:min-w-40">
        {/* TOTAL */}
        <div className="text-left sm:text-right">
          <p className="text-sm text-slate-400">Total</p>

          <p className="text-2xl font-black text-white">
            ₹{price * item.quantity}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-4 flex gap-3 sm:flex-col">
          <Button variant="danger" onClick={onRemove} className="flex-1">
            Remove
          </Button>

          <Button
            type="button"
            onClick={handleBuyNow}
            disabled={!product.stock || item.quantity <= 0}
            className="flex-1 bg-linear-to-r! from-amber-400! to-orange-500! font-bold! text-black! hover:from-amber-300! hover:to-orange-400!"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
