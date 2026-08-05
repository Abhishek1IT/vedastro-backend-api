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
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-105 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
        <div className="mb-4 text-5xl">📦</div>

        <h3 className="text-xl font-bold text-white">No Products Found</h3>

        <p className="mt-2 text-slate-400">
          Products will appear here once the admin adds them.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
