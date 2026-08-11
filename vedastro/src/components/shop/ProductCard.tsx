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
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const handleAddCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
   
      await addToCart(product._id, 1, product);

      console.log("PRODUCT ADDED TO CART:", product.name);
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(product._id, 1, product);

      window.location.href = "/checkout";
    } catch (err) {
      console.error("BUY NOW ERROR:", err);
    }
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      {/* PRODUCT IMAGE */}
      <Link
        href={`/shop/${product._id}`}
        className="relative block h-64 w-full overflow-hidden"
      >
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.error("IMAGE LOAD FAILED:", image);

            if (
              !e.currentTarget.src.endsWith("/images/product-placeholder.png")
            ) {
              e.currentTarget.src = "/images/product-placeholder.png";
            }
          }}
        />

        {discount > 0 && (
          <Badge variant="success" className="absolute right-2 top-2 z-10">
            {discount}% OFF
          </Badge>
        )}
      </Link>

      {/* PRODUCT CONTENT */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* CATEGORY + STOCK */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs uppercase text-slate-400">
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
            <h3 className="mt-2 line-clamp-2 font-bold text-white transition-colors hover:text-orange-400">
              {product.name}
            </h3>
          </Link>

          {/* PRICE */}
          <div className="mt-3">
            <span className="text-lg font-bold text-white">
              ₹{sellingPrice}
            </span>

            {product.salePrice != null && (
              <span className="ml-2 text-sm text-slate-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* ADD TO CART */}
          <button
            type="button"
            onClick={handleAddCart}
            disabled={product.stock <= 0}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-slate-800 px-2 text-center text-sm font-semibold leading-tight text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add To Cart
          </button>

          {/* BUY NOW */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-orange-500 px-2 text-center text-sm font-semibold leading-tight text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>
      </div>
    </Card>
  );
}
