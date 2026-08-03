"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductImage from "../../../components/shop/ProductImage";
import QuantitySelector from "../../../components/shop/QuantitySelector";
import Button from "../../../components/common/Button";
import Badge from "../../../components/ui/Badge";

import { useProductStore } from "../../../store/productStore";
import { useCartStore } from "../../../store/cartStore";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string; // agar folder [id] hai

  const [quantity, setQuantity] = useState(1);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { product, loading, fetchProduct } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        Product Not Found
      </div>
    );
  }

  const finalPrice = product.salePrice ?? product.price;

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImage
          images={
            product.images?.map((image) => `${BACKEND_URL}${image.url}`) ?? []
          }
          title={product.name}
        />
        <div>
          <h1 className="text-4xl font-black text-white">{product.name}</h1>

          <p className="mt-2 text-slate-400">{product.category}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-black text-amber-400">
              ₹{finalPrice}
            </span>

            {product.salePrice && (
              <span className="text-xl text-slate-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <div className="mt-4">
            {product.stock > 0 ? (
              <Badge variant="success">In Stock ({product.stock})</Badge>
            ) : (
              <Badge variant="error">Out of Stock</Badge>
            )}
          </div>

          <div className="mt-8">
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              max={product.stock}
            />
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              variant="secondary"
              className="flex-1"
              disabled={product.stock === 0}
              onClick={async () => {
                await addToCart(product._id, quantity);
                router.push("/cart");
              }}
            >
              Add To Cart
            </Button>

            <Button
              className="flex-1"
              disabled={product.stock === 0}
              onClick={async () => {
                await addToCart(product._id, quantity);
                router.push("/cart");
              }}
            >
              Buy Now
            </Button>
          </div>

          <div className="mt-10 rounded-xl border border-slate-800 p-5">
            <h2 className="mb-4 text-xl font-black">Description</h2>

            <p className="leading-7 text-slate-400">{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
