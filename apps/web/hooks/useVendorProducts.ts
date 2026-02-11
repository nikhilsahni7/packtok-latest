"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type VendorProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  quantity: number;
  productType: string;
  condition: string;
  status: string;
  submissionStatus?: string | null;
  imagesThumbnail?: string | null;
  images: string[];
  manufacturer?: string | null;
  model?: string | null;
  year?: number | null;
  cartEnabled: boolean;
  displayPrice: boolean;
  categoryId: string;
  subCategory?: string | null;
  reviewNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface VendorProductFilters {
  status?: string;
  submissionStatus?: string;
}

export function useVendorProducts(filters?: VendorProductFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.submissionStatus)
    params.set("submissionStatus", filters.submissionStatus);
  const qs = params.toString();

  return useQuery<VendorProduct[], Error>({
    queryKey: ["vendor-products", filters?.status, filters?.submissionStatus],
    queryFn: async () => {
      const url = qs
        ? "/api/v1/vendors/products?" + qs
        : "/api/v1/vendors/products";
      const { data } = await api.get(url);
      return data.data as VendorProduct[];
    },
    staleTime: 60_000,
  });
}
