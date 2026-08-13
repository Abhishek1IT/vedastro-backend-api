import api from "../lib/axios";

const orderService = {
  getOrders: async () => {
    const response = await api.get("/order");
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/order/${id}`);
    return response.data;
  },

  placeOrder: async (data: {
    shippingAddress: {
      fullName: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    };
    paymentMethod: "COD" | "ONLINE";
    productId?: string;
    quantity?: number;
  }) => {
    const response = await api.post("/order", data);

    return response.data;
  },

  cancelOrder: async (id: string) => {
    const response = await api.patch(`/order/${id}/cancel`);

    return response.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.patch(`/order/${id}/status`, {
      status,
    });

    return response.data;
  },
};

export default orderService;
