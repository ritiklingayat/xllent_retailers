export type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type OrderSummary = {
  subtotal: number;
  shipping: number;
  total: number;
};

export type OrderStatus = "Pending" | "Confirmed" | "Packed" | "Delivered" | "Cancelled";

export type OrderItem = {
  productId: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
};

export type CustomerOrder = {
  id: string;
  customer: CustomerDetails;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  orderDate: string;
};
