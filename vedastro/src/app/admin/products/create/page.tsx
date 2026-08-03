"use client";

import { useRouter } from "next/navigation";
import ProductForm from "../../../../components/admin/product/ProductForm";
import { useProductStore } from "../../../../store/productStore";

export default function CreateProductPage() {
  const router = useRouter();

  const { createProduct, loading, error } = useProductStore();

  const handleSubmit = async (formData: FormData) => {
    const success = await createProduct(formData);

    if (success) {
      alert("Product Created Successfully");

      router.push("/admin/products");
    }
  };

  return (
    <section className="container mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Product</h1>

        <p className="mt-2 text-slate-400">Add a new product to your shop.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-600/20 border border-red-500 p-4 text-red-300">
          {error}
        </div>
      )}

      <ProductForm loading={loading} onSubmit={handleSubmit} />
    </section>
  );
}
