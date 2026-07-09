export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  adminPrice?: number;
  superStockiestPrice?: number;
  distributorsPrice?: number;
  wholesalerPrice?: number;
  stock: number;
  shortDescription: string;
  description: string;
  imageUrl: string;
  colorClass: string;
  highlights: string[];
  bestFor: string[];
};

export type CartLine = {
  productId: string;
  quantity: number;
};
