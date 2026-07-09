import type { LayoutDashboard } from "lucide-react";

export type SuperAdminPageKey = "Dashboard" | "Products" | "Orders" | "Customers";

export type SuperAdminModule = {
  label: SuperAdminPageKey;
  icon: typeof LayoutDashboard;
};

export type ProductForm = {
  name: string;
  category: string;
  brand: string;
  adminPrice: string;
  superStockiestPrice: string;
  distributorsPrice: string;
  wholesalerPrice: string;
  imageUrl: string;
  description: string;
};

export const emptyProductForm: ProductForm = {
  name: "",
  category: "",
  brand: "",
  adminPrice: "",
  superStockiestPrice: "",
  distributorsPrice: "",
  wholesalerPrice: "",
  imageUrl: "",
  description: ""
};
