"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductForm from "../../../../../components/admin/product/ProductForm";
import { useProductStore } from "../../../../../store/productStore";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const { product, loading, error, fetchProduct, updateProduct } =
    useProductStore();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  const handleSubmit = async (formData: FormData) => {
    const success = await updateProduct(id, formData);

    if (success) {
      alert("Product Updated Successfully");
      router.push("/admin/products");
    }
  };

  if (loading && !product) {
    return (
      <div className="container mx-auto py-20 text-center">
        Loading Product...
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <div className="container mx-auto py-20 text-center">
        Product Not Found
      </div>
    );
  }

  return (
    <section className="container mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>

        <p className="mt-2 text-slate-400">Update product details.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {product && (
        <ProductForm
          initialData={product}
          loading={loading}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
