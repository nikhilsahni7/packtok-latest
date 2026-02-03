"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { MarketplaceProduct, MarketplaceProductStatus } from "../types/product";
import { QK } from "../utils/queryKeys";

// Fetch all products (admin)
export function useProducts() {
  return useQuery({
    queryKey: QK.products,
    queryFn: async (): Promise<MarketplaceProduct[]> => {
      const { data } = await api.get("/api/v1/admins/products");
      return data.data || data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single product (using public endpoint for admin)
export function useGetProduct(productId: string) {
  return useQuery({
    queryKey: [...QK.products, productId],
    queryFn: async (): Promise<MarketplaceProduct> => {
      const { data } = await api.get(`/api/v1/admins/products/${productId}`);
      return data.data || data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: FormData): Promise<MarketplaceProduct> => {
      const { data } = await api.post("/api/v1/admins/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data || data;
    },
    onSuccess: () => {
      // Invalidate products query to refetch
      queryClient.invalidateQueries({ queryKey: QK.products });
    },
  });
}

// Update product status mutation
export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      status,
    }: {
      productId: string;
      status: MarketplaceProductStatus;
    }): Promise<MarketplaceProduct> => {
      const { data } = await api.put(
        `/api/v1/admins/products/${productId}/status`,
        { status },
      );
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.products });
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string): Promise<void> => {
      await api.delete(`/api/v1/admins/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.products });
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      productData,
    }: {
      productId: string;
      productData: FormData;
    }): Promise<MarketplaceProduct> => {
      const { data } = await api.put(
        `/api/v1/admins/products/${productId}`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data.data || data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QK.products });
      queryClient.invalidateQueries({
        queryKey: [...QK.products, variables.productId],
      });
    },
  });
}
