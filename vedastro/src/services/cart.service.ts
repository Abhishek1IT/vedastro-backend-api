import lib from "../lib/axios";
import { API_ENDPOINTS } from "../constants/api";

const CartService = {
  async getCart() {
    const res = await lib.get(API_ENDPOINTS.SHOP.CART);

    return res.data;
  },

  async addToCart(productId: string, quantity = 1) {
    const res = await lib.post(API_ENDPOINTS.SHOP.ADD_TO_CART, {
      productId,
      quantity,
    });

    return res.data;
  },

  async updateQuantity(productId: string, quantity: number) {
    const res = await lib.put(API_ENDPOINTS.SHOP.UPDATE_CART_ITEM(productId), {
      quantity,
    });

    return res.data;
  },

  async removeItem(productId: string) {
    const res = await lib.delete(API_ENDPOINTS.SHOP.REMOVE_CART_ITEM(productId));
    return res.data;
  },

  async clearCart() {
    const res = await lib.delete(API_ENDPOINTS.SHOP.CLEAR_CART);
    return res.data;
  },
};

export default CartService;