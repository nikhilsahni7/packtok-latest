"use client";

import api from "@/lib/axios";
import { ProductFilters, ProductsResponse } from "@/types/marketplace";
import { useQuery } from "@tanstack/react-query";

export function useProducts(filters: ProductFilters = {}) {
  const queryKey = ["products", filters];

  return useQuery<ProductsResponse, Error>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add filters to query params
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      // Handle single or multiple category IDs
      if (filters.categoryId) {
        if (Array.isArray(filters.categoryId)) {
          filters.categoryId.forEach((id) => params.append("categoryId", id));
        } else {
          params.append("categoryId", filters.categoryId);
        }
      }

      // Handle single or multiple product types
      if (filters.productType) {
        if (Array.isArray(filters.productType)) {
          filters.productType.forEach((type) =>
            params.append("productType", type)
          );
        } else {
          params.append("productType", filters.productType);
        }
      }

      // Handle single or multiple machine types
      if (filters.machineType) {
        if (Array.isArray(filters.machineType)) {
          filters.machineType.forEach((type) =>
            params.append("machineType", type)
          );
        } else {
          params.append("machineType", filters.machineType);
        }
      }

      // Handle single or multiple conditions
      if (filters.condition) {
        if (Array.isArray(filters.condition)) {
          filters.condition.forEach((cond) => params.append("condition", cond));
        } else {
          params.append("condition", filters.condition);
        }
      }

      if (filters.priceMin)
        params.append("priceMin", filters.priceMin.toString());
      if (filters.priceMax)
        params.append("priceMax", filters.priceMax.toString());
      if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);

      const { data } = await api.get(`/api/v1/products?${params.toString()}`);
      return data.data as ProductsResponse;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - products don't change frequently
    gcTime: 15 * 60 * 1000, // 15 minutes cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch if data is already fresh
  });
}
