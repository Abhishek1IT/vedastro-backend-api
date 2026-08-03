/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import ProductService from "../services/product.service";

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;

  price: number;
  salePrice?: number;
  stock: number;

  images: ProductImage[];

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

type SortType =
  | "latest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc"
  | "";

interface ProductState {
  products: Product[];
  product: Product | null;

  loading: boolean;
  error: string | null;

  page: number;
  totalPages: number;
  totalProducts: number;

  filters: {
    search: string;
    minPrice: number;
    maxPrice: number;
    sort: SortType;
  };

  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;

  createProduct: (data: FormData) => Promise<boolean>;
  updateProduct: (id: string, data: FormData) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;

  setSearch: (value: string) => void;
  setPrice: (min: number, max: number) => void;
  setSort: (sort: SortType) => void;

  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],

  product: null,

  loading: false,

  error: null,

  page: 1,

  totalPages: 1,

  totalProducts: 0,

  filters: {
    search: "",
    minPrice: 0,
    maxPrice: 0,
    sort: "",
  },

  // Get Products
  fetchProducts: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const { filters, page } = get();

      const res = await ProductService.getProducts({
        page,
        limit: 12,

        search: filters.search || undefined,

        minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,

        maxPrice: filters.maxPrice > 0 ? filters.maxPrice : undefined,

        sort: filters.sort || undefined,
      });

      set({
        products: res.data || [],

        totalPages: res.pagination?.totalPages || 1,

        totalProducts: res.pagination?.total || res.data?.length || 0,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch products",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  // Get Single Product
  fetchProduct: async (id: string) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await ProductService.getProduct(id);

      set({
        product: res.data,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch product",
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  // Search
  setSearch: (value: string) =>
    set((state) => ({
      page: 1,

      filters: {
        ...state.filters,
        search: value,
      },
    })),

  // Price Filter
  setPrice: (min: number, max: number) =>
    set((state) => ({
      page: 1,

      filters: {
        ...state.filters,
        minPrice: min,
        maxPrice: max,
      },
    })),

  // Sort
  setSort: (sort: SortType) =>
    set((state) => ({
      page: 1,

      filters: {
        ...state.filters,
        sort,
      },
    })),

  // Pagination
  setPage: (page: number) =>
    set({
      page,
    }),

  // Reset
  resetFilters: () =>
    set({
      page: 1,

      filters: {
        search: "",
        minPrice: 0,
        maxPrice: 0,
        sort: "",
      },
    }),

  createProduct: async (data: FormData) => {
    try {
      set({ loading: true, error: null });

      await ProductService.createProduct(data);

      await get().fetchProducts();

      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create product",
      });

      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id: string, data: FormData) => {
    try {
      set({ loading: true, error: null });
      console.log(id);
      await ProductService.updateProduct(id, data);

      await get().fetchProducts();

      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update product",
      });

      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ loading: true, error: null });

      await ProductService.deleteProduct(id);

      set((state) => ({
        products: state.products.filter((item) => item._id !== id),
      }));

      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete product",
      });

      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
