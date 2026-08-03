"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "../../common/Button";
import { Product } from "../../../store/productStore";

interface ProductRowProps {
  product: Product;
  onDelete: (id: string) => void;
}

export default function ProductRow({ product, onDelete }: ProductRowProps) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const imageUrl = product.images?.[0]?.url
    ? `${BACKEND_URL}${product.images[0].url}`
    : "/images/product-placeholder.png";

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-900/40">
      <td className="p-3">
        <Image
          src={imageUrl}
          alt={product.name}
          width={60}
          height={60}
          className="rounded-lg object-cover"
        />
      </td>

      <td className="p-3 font-medium text-white">{product.name}</td>

      <td className="p-3 text-slate-300">{product.category}</td>

      <td className="p-3">₹{product.salePrice ?? product.price}</td>

      <td className="p-3">{product.stock}</td>

      <td className="p-3">
        {product.isActive ? (
          <span className="rounded bg-green-600 px-2 py-1 text-xs">Active</span>
        ) : (
          <span className="rounded bg-red-600 px-2 py-1 text-xs">Inactive</span>
        )}
      </td>

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
