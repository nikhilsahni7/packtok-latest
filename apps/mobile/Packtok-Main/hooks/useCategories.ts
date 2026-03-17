// hooks/useCategories.ts
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface Category {
  id: string;
  name: string;
  subcategories?: string[];
  slug?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/api/v1/categories");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
  });
};

export const useCategory = (categoryId: string) => {
  return useQuery<Category>({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/categories/${categoryId}`);
      return response.data.data;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 30,
  });
};
