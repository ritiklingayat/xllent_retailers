import { httpClient } from "@/services/httpClient";
import type { Product } from "@/models/product";

export async function getAllProducts() {
  const res = await httpClient.get<Product[]>("/products");
  return res.data;
}

export async function createProduct(formData: FormData) {
  const res = await httpClient.post<Product>("/products", formData);
  return res.data;
}

export async function updateProduct(id: number, formData: FormData) {
  const res = await httpClient.put<Product>(`/products/${id}`, formData);
  return res.data;
}

export async function deleteProduct(id: number) {
  const res = await httpClient.delete(`/products/${id}`);
  return res.data;
}
