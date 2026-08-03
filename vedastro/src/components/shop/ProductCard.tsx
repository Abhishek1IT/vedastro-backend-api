"use client";

import Link from "next/link";
import Image from "next/image";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../common/Button";

import { Product } from "../../store/productStore";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const image = product.images?.[0]?.url
    ? `${BACKEND_URL}${product.images[0].url}`
    : "/images/product-placeholder.png";

  const sellingPrice = product.salePrice ?? product.price;

  const discount = product.salePrice
    ? Math.round(
        ((product.price - product.salePrice) / product.price) * 100
      )
    : 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30 transition hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5">
      <Link href={`/shop/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-slate-950">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width:640px)100vw,(max-width:1024px)33vw,20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {discount > 0 && (
            <Badge
              variant="success"
              className="absolute right-2 top-2"
            >
              {discount}% OFF
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-slate-400">
              {product.category}
            </span>

            {product.stock > 0 ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="error">Out of Stock</Badge>
            )}
          </div>

          <Link href={`/shop/${product._id}`}>
            <h3 className="mt-2 line-clamp-2 font-bold text-white hover:text-amber-400">
              {product.name}
            </h3>
          </Link>

          <div className="mt-3">
            <span className="text-lg font-bold text-white">
              ₹{sellingPrice}
            </span>

            {product.salePrice && (
              <span className="ml-2 text-sm line-through text-slate-500">
                ₹{product.price}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            disabled={product.stock === 0}
            onClick={() => onAddToCart?.(product)}
          >
            Add To Cart
          </Button>

          <Button
            className="flex-1"
            disabled={product.stock === 0}
            onClick={() => onBuyNow?.(product)}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </Card>
  );
}