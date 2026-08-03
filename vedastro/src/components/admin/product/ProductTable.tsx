"use client";

import ProductRow from "./ProductRow";
import { Product } from "../../../store/productStore";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductTable({
  products,
  onDelete,
}: ProductTableProps) {
  if (!products.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
        <h2 className="text-xl font-semibold text-white">
          No Products Found
        </h2>

        <p className="mt-2 text-slate-400">
          Create your first product.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full">
        <thead className="bg-slate-900">
          <tr>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}