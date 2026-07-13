import type { LayoutDashboard } from "lucide-react";

export type SuperAdminPageKey = "Dashboard" | "Users" | "Products" | "Orders" | "Categories";

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
  imageFile?: File | null;
  description: string;
};

export const emptyProductForm: ProductForm = {
  name: "",
  category: "",
  mrp: "",
  adminPrice: "",
  superStockiestPrice: "",
  distributorsPrice: "",
  wholesalerPrice: "",
  imageUrl: "",
  imageFile: null,
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
