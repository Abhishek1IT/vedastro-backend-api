export interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
}

export interface OrderItem {
  _id: string;
  quantity: number;
  price: number;
  product: {
    _id: string;
    title: string;
  };
}