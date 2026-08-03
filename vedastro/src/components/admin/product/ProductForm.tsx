/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Button from "../../common/Button";
import { Product } from "../../../store/productStore";
import ImageUpload from "./ImageUpload";

interface ProductFormProps {
  initialData?: Product | null;
  loading?: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProductForm({
  initialData,
  loading = false,
  onSubmit,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");

  const [stock, setStock] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name);
    setDescription(initialData.description);
    setCategory(initialData.category);

    setPrice(String(initialData.price));

    setSalePrice(initialData.salePrice ? String(initialData.salePrice) : "");

    setStock(String(initialData.stock));

    setIsActive(initialData.isActive);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);

    formData.append("description", description);

    formData.append("category", category);

    formData.append("price", price);

    if (salePrice) {
      formData.append("salePrice", salePrice);
    }

    formData.append("stock", stock);

    formData.append("isActive", String(isActive));

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
      space-y-6 
      rounded-xl 
      border 
      border-slate-800 
      bg-slate-900 
      p-6
      "
    >
      <div>
        <label>Product Name</label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
          w-full
          rounded-lg
          bg-slate-950
          border
          p-3
          "
          required
        />
      </div>

      <div>
        <label>Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="
          w-full
          rounded-lg
          bg-slate-950
          border
          p-3
          "
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="
          rounded-lg
          bg-slate-950
          border
          p-3
          "
          required
        >
          <option value="">Select Category</option>

          <option value="Gemstones">Gemstones</option>

          <option value="Rudraksha">Rudraksha</option>

          <option value="Bracelets">Bracelets</option>

          <option value="Yantras">Yantras</option>

          <option value="Pyramids">Pyramids</option>
        </select>

        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          className="
          rounded-lg
          bg-slate-950
          border
          p-3
          "
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="
          rounded-lg
          bg-slate-950
          border
          p-3
          "
          required
        />

        <input
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder="Sale Price"
          className="
          rounded-lg
          bg-slate-950
          border
          p-3
          "
        />
      </div>

      <ImageUpload
        existingImages={initialData?.images || []}
        onChange={setSelectedFiles}
      />

      <label className="flex gap-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active Product
      </label>

      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? "Saving..."
          : initialData
            ? "Update Product"
            : "Create Product"}
      </Button>
    </form>
  );
}
