export interface Order {
  status: string;
  _id: string;

  user: string;

  items: OrderItem[];

  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  subtotal: number;
  shipping: number;
  total: number;

  paymentMethod: "COD" | "ONLINE";

  paymentStatus: "PENDING" | "PAID" | "FAILED";

  orderStatus: "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: {
      url: string;
      publicId?: string;
    }[];
  };

  name: string;
  image?: string;
  price: number;
  quantity: number;
}
