/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

import { Product } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const rawImage = product.images?.[0]?.url;

  const image = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BACKEND_URL.replace(/\/$/, "")}/${rawImage.replace(/^\//, "")}`
    : "/images/product-placeholder.png";

  const sellingPrice = product.salePrice ?? product.price;

  const discount =
    product.salePrice && product.price > 0
      ? Math.round(
        ((product.price - product.salePrice) / product.price) * 100,
      )
      : 0;

  const handleAddCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(product._id, 1, product);
      console.log("PRODUCT ADDED TO CART:", product.name);
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
    }
  };

  const handleBuyNow = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    window.location.href = `/checkout?mode=buy-now&productId=${product._id}`;
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden p-3 bg-(--surface-secondary) border border-(--border) rounded-xl transition-all duration-200">
      {/* PRODUCT IMAGE */}
      <Link
        href={`/shop/${product._id}`}
        className="relative block h-44 w-full overflow-hidden rounded-lg bg-(--surface-tertiary)"
      >
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;

            if (
              !target.src.includes(
                "/images/product-placeholder.png",
              )
            ) {
              target.src = "/images/product-placeholder.png";
            }
          }}
        />

        {discount > 0 && (
          <Badge
            variant="success"
            className="absolute right-2 top-2 z-10 text-[10px]"
          >
            {discount}% OFF
          </Badge>
        )}
      </Link>

      {/* PRODUCT CONTENT */}
      <div className="flex flex-1 flex-col justify-between pt-3">
        <div>
          {/* CATEGORY + STOCK */}
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[10px] uppercase font-semibold text-(--text-muted)">
              {product.category}
            </span>

            {product.stock > 0 ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="error">Out Of Stock</Badge>
            )}
          </div>

          {/* PRODUCT NAME */}
          <Link href={`/shop/${product._id}`}>
            <h3 className="mt-1 line-clamp-2 text-sm font-bold text-(--text-primary) transition-colors hover:text-(--accent)">
              {product.name}
            </h3>
          </Link>

          {/* PRICE */}
          <div className="mt-2">
            <span className="text-base font-bold text-(--text-primary)">
              ₹{sellingPrice}
            </span>

            {product.salePrice != null && (
              <span className="ml-2 text-xs text-(--text-muted) line-through">
                ₹{product.price}
              </span>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {/* ADD TO CART BUTTON */}
          <button
            type="button"
            onClick={handleAddCart}
            disabled={product.stock <= 0}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-(--surface-tertiary) border border-(--border) px-2 text-xs font-semibold text-(--text-primary) transition hover:bg-(--border-strong) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add To Cart
          </button>

          {/* BUY NOW BUTTON */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-(--accent) px-2 text-xs font-bold text-slate-950 transition hover:bg-(--accent-hover) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>
      </div>
    </Card>
  );
}
