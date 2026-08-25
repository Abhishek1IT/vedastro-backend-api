/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductGrid from "../../components/shop/ProductGrid";
import SearchBar from "../../components/shop/SearchBar";
import CategoryFilter from "../../components/shop/CategoryFilter";
import PriceFilter from "../../components/shop/PriceFilter";

import ProductService from "../../services/product.service";
import type { Product } from "../../store/productStore";

const categories = [
  "Gemstones",
  "Rudraksha",
  "Bracelets",
  "Yantras",
  "Pyramids",
  "Puja Samagri",
  "Herbal Remedies",
];

type SortType =
  | "latest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc"
  | "";

function sortProducts(products: Product[], sort: SortType) {
  const sorted = [...products];

  switch (sort) {
    case "price_asc":
      return sorted.sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
      );

    case "price_desc":
      return sorted.sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
      );

    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case "latest":
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateB - dateA;
      });

    default:
      return sorted;
  }
}

function applyFilters(
  products: Product[],
  category: string,
  minPrice: number,
  maxPrice: number,
  sort: SortType,
) {
  const filtered = products.filter((product) => {
    const price = product.salePrice ?? product.price;

    const categoryMatch = !category || product.category === category;

    const minMatch = !minPrice || price >= minPrice;

    const maxMatch = !maxPrice || price <= maxPrice;

    return categoryMatch && minMatch && maxMatch;
  });

  return sortProducts(filtered, sort);
}

export default function ShopPage() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryKey = searchParams.toString();

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const keyword = searchParams.get("search")?.trim() || "";

        const category = searchParams.get("category")?.trim() || "";

        const minPrice = Number(searchParams.get("minPrice")) || 0;

        const maxPrice = Number(searchParams.get("maxPrice")) || 0;

        const sort = (searchParams.get("sort") || "") as SortType;

        let fetchedProducts: Product[] = [];

        if (keyword) {
          const response = await ProductService.search(keyword);

          fetchedProducts = response.data || [];
        } else {
          const response = await ProductService.getProducts();

          fetchedProducts = response.data || [];
        }

        const filteredProducts = applyFilters(
          fetchedProducts,
          category,
          minPrice,
          maxPrice,
          sort,
        );

        if (mounted) {
          setProducts(filteredProducts);
        }
      } catch (error) {
        if (mounted) {
          setError(
            error instanceof Error ? error.message : "Failed to load products",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [queryKey]);

  return (
    <section className="container mx-auto px-4 py-10 bg-(--background) transition-colors duration-200">
      <div className="mb-8 pt-20">
        <h1 className="text-4xl font-black text-(--text-primary)">Cosmic Shop</h1>

        {/* FIX: Swapped text-slate-400 for structural text token */}
        <p className="mt-2 text-(--text-secondary)">
          Discover authentic gemstones, Rudraksha, bracelets and spiritual
          products.
        </p>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <CategoryFilter categories={categories} />

        <PriceFilter />
      </div>

      {loading && (
        <div className="py-20 text-center text-(--text-primary)">Loading Products...</div>
      )}

      {!loading && error && (
        <div className="py-20 text-center text-red-500">{error}</div>
      )}

      {!loading && !error && products.length > 0 && (
        <ProductGrid products={products} />
      )}

      {!loading && !error && products.length === 0 && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-(--border) bg-(--surface-secondary)">
          <div className="text-center">
            {/* FIX: Dynamic title text colors */}
            <h2 className="text-2xl font-semibold text-(--text-primary)">
              No Products Available
            </h2>

            <p className="mt-2 text-(--text-muted)">
              Products will appear here once the admin adds them.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
