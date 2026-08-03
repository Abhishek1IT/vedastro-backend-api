/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useProductStore } from "../store/productStore";

export function useProduct() {
  const {
    products,
    product,
    loading,
    error,

    filters,
    page,
    totalPages,
    totalProducts,

    fetchProducts,
    fetchProduct,

    createProduct,
    updateProduct,
    deleteProduct,

    setSearch,
    setPrice,
    setSort,
    setPage,

    resetFilters,
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    page,
  ]);

  return {
    products,
    product,

    loading,
    error,

    filters,
    page,
    totalPages,
    totalProducts,

    fetchProducts,
    fetchProduct,

    createProduct,
    updateProduct,
    deleteProduct,

    setSearch,
    setPrice,
    setSort,
    setPage,

    resetFilters,
  };
}