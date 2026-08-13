/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import Button from "../../common/Button";
import { Product } from "../../../store/productStore";

interface ProductRowProps {
  product: Product;
  onDelete: (id: string) => void;
}

export default function ProductRow({ product, onDelete }: ProductRowProps) {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const rawImage = product.images?.[0]?.url;

  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BACKEND_URL.replace(/\/$/, "")}/${rawImage.replace(/^\//, "")}`
    : "/images/product-placeholder.png";

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-900/40">
      {/* IMAGE */}
      <td className="p-3">
        <img
          src={imageUrl}
          alt={product.name}
          width={60}
          height={60}
          className="h-15 w-15 rounded-lg object-cover"
          onError={(e) => {
            console.error("PRODUCT ROW IMAGE LOAD FAILED:", imageUrl);

            if (!e.currentTarget.src.includes("product-placeholder.png")) {
              e.currentTarget.src = "/images/product-placeholder.png";
            }
          }}
        />
      </td>

      {/* NAME */}
      <td className="p-3 font-medium text-white">{product.name}</td>

      {/* CATEGORY */}
      <td className="p-3 text-slate-300">{product.category}</td>

      {/* PRICE */}
      <td className="p-3">₹{product.salePrice ?? product.price}</td>

      {/* STOCK */}
      <td className="p-3">{product.stock}</td>

      {/* STATUS */}
      <td className="p-3">
        {product.isActive ? (
          <span className="rounded bg-green-600 px-2 py-1 text-xs">Active</span>
        ) : (
          <span className="rounded bg-red-600 px-2 py-1 text-xs">Inactive</span>
        )}
      </td>

      {/* ACTIONS */}
      <td className="p-3">
        <div className="flex gap-2">
          <Link href={`/admin/products/${product._id}/edit`}>
            <Button size="sm">Edit</Button>
          </Link>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(product._id)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
