import type { LayoutDashboard } from "lucide-react";

export type SuperAdminPageKey = "Dashboard" | "Users" | "Products" | "Orders";

export type SuperAdminModule = {
  label: SuperAdminPageKey;
  icon: typeof LayoutDashboard;
};

export type ProductForm = {
  name: string;
  category: string;
  mrp: string;
  adminPrice: string;
  superStockiestPrice: string;
  distributorsPrice: string;
  wholesalerPrice: string;
  imageUrl: string;
  description: string;
};

export const emptyProductForm: ProductForm = {
  name: "",
  category: "Chocolate",
  mrp: "",
  adminPrice: "",
  superStockiestPrice: "",
  distributorsPrice: "",
  wholesalerPrice: "",
  imageUrl: "",
  description: ""
};

export const productCategories = [
  "Chocolate",
  "Candy",
  "Lollipop",
  "Chikki",
  "Spices",
  "Snacks"
];
