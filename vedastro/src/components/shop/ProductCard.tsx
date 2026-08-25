/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import QuantitySelector from "./QuantitySelector";

import { Product } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

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

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(1);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity, product);
      console.log("PRODUCT ADDED TO CART:", product.name);
      setShowModal(false);
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
      alert("Unable to add product to cart.");
    } finally {
      setAddingToCart(false);
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
    <>
      <Card className="group flex h-full flex-col overflow-hidden p-3 bg-(--surface-secondary) border border-(--border) rounded-xl transition-all duration-200 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5">
        {/* PRODUCT IMAGE */}
        <Link
          href={`/shop/${product._id}`}
          className="relative block h-44 w-full overflow-hidden rounded-lg bg-(--surface-tertiary)"
        >
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
            <div className="absolute right-2 top-2 z-10 text-[11px] bg-emerald-600 text-white font-bold rounded-md px-2 py-0.5 shadow-md ring-1 ring-white/30">
              {discount}% OFF
            </div>
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
              onClick={handleOpenModal}
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

      {/* QUICK ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-(--border) bg-(--background) shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-(--border) px-5 py-4 bg-(--surface-secondary)">
              <h3 className="font-bold text-(--text-primary)">Quick Add</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-(--text-muted) transition-colors hover:bg-(--surface-tertiary) hover:text-(--text-primary)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              <div className="flex gap-4 mb-6">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-(--border) bg-(--surface-secondary)">
                  <img src={image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="line-clamp-2 text-sm font-bold text-(--text-primary)">{product.name}</h4>
                  <div className="mt-1 text-base font-black text-amber-500">₹{sellingPrice}</div>
                  <div className="text-xs text-(--text-muted) mt-1">{product.stock} in stock</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-(--text-secondary)">Quantity</label>
                <QuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                  max={product.stock}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-(--border) bg-(--surface-secondary) p-5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-(--border) bg-(--surface-tertiary) py-3 text-sm font-bold text-(--text-primary) hover:bg-(--surface-secondary) transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddToCart}
                disabled={addingToCart}
                className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
              >
                {addingToCart ? "Adding..." : `Add ${quantity} to Cart`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
