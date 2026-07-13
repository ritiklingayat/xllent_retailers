import { httpClient } from "@/services/httpClient";
import type { Category, CategoryRequest } from "@/models/category";

export async function getAllCategories() {
  const response = await httpClient.get<Category[]>("/categories");
  return response.data;
}

export async function createCategory(payload: CategoryRequest) {
  try {
    const response = await httpClient.post<Category>("/categories", payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Category create failed");
  }
}

export async function updateCategory(id: number, payload: CategoryRequest) {
  const response = await httpClient.put<Category>(`/categories/${id}`, payload);
  return response.data;
}

export async function deleteCategory(id: number) {
  const response = await httpClient.delete<string>(`/categories/${id}`);
  return response.data;
}
