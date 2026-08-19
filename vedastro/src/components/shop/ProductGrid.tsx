"use client";

import ProductCard from "./ProductCard";
import Skeleton from "../ui/Skeleton";
import { Product } from "../../store/productStore";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({
  products,
  loading = false,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-96 rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-xl border border-dashed border-(--border) p-10 text-center bg-(--surface-secondary)">
        <div className="mb-4 text-4xl">📦</div>

        <h3 className="text-lg font-bold text-(--text-primary)">
          No Products Found
        </h3>

        <p className="mt-2 text-sm text-(--text-muted)">
          Products will appear here once the admin adds them.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
}
