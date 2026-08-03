/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Button from "../../../components/common/Button";
import ProductTable from "../../../components/admin/product/ProductTable";
import DeleteModal from "../../../components/admin/product/DeleteModal";

import { useProductStore } from "../../../store/productStore";

export default function AdminProductsPage() {
  const {
    products,
    loading,
    fetchProducts,
    deleteProduct,
  } = useProductStore();

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    const success = await deleteProduct(deleteId);

    if (success) {
      setOpen(false);
      setDeleteId("");
    }
  };

  return (
    <section className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Product Management
          </h1>

          <p className="mt-2 text-slate-400">
            Create, update and delete shop products.
          </p>
        </div>

        <Link href="/admin/products/create">
          <Button>
            + Create Product
          </Button>
        </Link>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="py-20 text-center">
          Loading Products...
        </div>
      ) : (
        <ProductTable
          products={products}
          onDelete={handleDelete}
        />
      )}

      <DeleteModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}