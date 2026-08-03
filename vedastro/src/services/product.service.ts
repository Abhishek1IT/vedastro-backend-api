import lib from "../lib/axios";
import { API_ENDPOINTS } from "../constants/api";

const ProductService = {

  // User APIs
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) {
    const { data } = await lib.get(API_ENDPOINTS.SHOP.PRODUCTS, {
      params,
    });

    return data;
  },

  async getProduct(id: string) {
    const { data } = await lib.get(API_ENDPOINTS.SHOP.PRODUCT_DETAILS(id));

    return data;
  },

  async search(keyword: string) {
    const { data } = await lib.get(API_ENDPOINTS.SHOP.SEARCH_PRODUCTS(keyword));

    return data;
  },

  // Admin APIs
  async createProduct(formData: FormData) {
    const { data } = await lib.post(API_ENDPOINTS.SHOP.PRODUCTS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  async updateProduct(id:string, data:FormData){
    const response = await lib.put(API_ENDPOINTS.SHOP.UPDATE_PRODUCT(id), data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
},

  async deleteProduct(id: string) {
    const { data } = await lib.delete(API_ENDPOINTS.SHOP.DELETE_PRODUCT(id));

    return data;
  },
};

export default ProductService;
