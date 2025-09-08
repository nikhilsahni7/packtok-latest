"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type VendorProduct = {
  id: string;
  title: string;
  status: string;
  submissionStatus?: string | null;
  imagesThumbnail?: string | null;
  createdAt: string;
};

export function useVendorProducts() {
  return useQuery<VendorProduct[], Error>({
    queryKey: ["vendor-products"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/vendors/products");
      return data.data as VendorProduct[];
    },
    staleTime: 60_000,
  });
}
