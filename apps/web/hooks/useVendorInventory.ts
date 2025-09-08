"use client";

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type VendorInventory = {
  id?: string;
  productId?: string;
  stockOnHand: number;
  lowStockThreshold?: number | null;
  warehouseLocation?: string | null;
};

export function useVendorInventory(productId: string | undefined) {
  return useQuery<VendorInventory | null, Error>({
    queryKey: ["vendor-product-inventory", productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data } = await api.get(
        `/api/v1/vendors/products/${productId}/inventory`
      );
      return data.data as VendorInventory | null;
    },
    staleTime: 30_000,
  });
}

export function useUpsertVendorInventory(productId: string) {
  const qc = useQueryClient();
  return useMutation<
    VendorInventory,
    Error,
    Omit<VendorInventory, "id" | "productId">
  >({
    mutationFn: async (payload) => {
      const { data } = await api.put(
        `/api/v1/vendors/products/${productId}/inventory`,
        payload
      );
      return data.data as VendorInventory;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["vendor-product-inventory", productId],
      });
    },
  });
}

export function useAdjustVendorInventory(productId: string) {
  const qc = useQueryClient();
  return useMutation<
    VendorInventory,
    Error,
    {
      delta: number;
      reason:
        | "ADJUSTMENT"
        | "SALE"
        | "RESTOCK"
        | "RESERVATION"
        | "CANCELLATION";
      meta?: unknown;
    }
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        `/api/v1/vendors/products/${productId}/inventory/adjustments`,
        payload
      );
      return data.data as VendorInventory;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["vendor-product-inventory", productId],
      });
    },
  });
}
