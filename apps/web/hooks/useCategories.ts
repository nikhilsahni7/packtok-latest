"use client";

import api from "@/lib/axios";
import { Category } from "@/types/marketplace";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/categories");
      return data.data as Category[];
    },
    staleTime: 60 * 60 * 1000, // 1 hour (categories don't change often)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
