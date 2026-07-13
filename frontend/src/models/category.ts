export type Category = {
  id: number;
  categoryName: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt?: string | null;
};

export type CategoryRequest = {
  categoryName: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
};
