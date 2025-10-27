"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { Category } from "../types/product";
import { QK } from "../utils/queryKeys";

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: QK.categories,
    queryFn: async (): Promise<Category[]> => {
      const { data } = await api.get("/api/v1/categories");
      return data.data || data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (categories don't change often)
  });
}

// Create category mutation
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: { name: string }): Promise<Category> => {
      const { data } = await api.post("/api/v1/categories", categoryData);
      return data.data || data;
    },
    onSuccess: () => {
      // Invalidate categories query to refetch
      queryClient.invalidateQueries({ queryKey: QK.categories });
    },
  });
}

// Update category mutation
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...categoryData
    }: {
      id: string;
      name?: string;
      subcategories?: string[];
    }): Promise<Category> => {
      const { data } = await api.patch(
        `/api/v1/categories/${id}`,
        categoryData
      );
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.categories });
    },
  });
}

// Delete category mutation
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string): Promise<void> => {
      await api.delete(`/api/v1/categories/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.categories });
    },
  });
}

// Add subcategory mutation
export function useAddSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      subcategory,
    }: {
      categoryId: string;
      subcategory: string;
    }): Promise<Category> => {
      const { data } = await api.post(
        `/api/v1/categories/${categoryId}/subcategories`,
        { subcategory }
      );
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.categories });
    },
  });
}

// Remove subcategory mutation
export function useRemoveSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      subcategory,
    }: {
      categoryId: string;
      subcategory: string;
    }): Promise<Category> => {
      const { data } = await api.delete(
        `/api/v1/categories/${categoryId}/subcategories`,
        { data: { subcategory } }
      );
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.categories });
    },
  });
}

// Update subcategories mutation
export function useUpdateSubcategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      subcategories,
    }: {
      categoryId: string;
      subcategories: string[];
    }): Promise<Category> => {
      const { data } = await api.put(
        `/api/v1/categories/${categoryId}/subcategories`,
        { subcategories }
      );
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.categories });
    },
  });
}
