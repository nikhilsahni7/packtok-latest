"use client";

import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const toast = {
  success: (msg: string) => {
    if (typeof window !== "undefined") {
      // Replace with your existing toast solution if available
      // eslint-disable-next-line no-alert
      alert(msg);
    }
  },
};

export type VendorProductForm = {
  title: string;
  description: string;
  price: number;
  productType: string;
  machineType?: string | null;
  condition: string;
  quantity?: number;
  categoryName: string;
  currency?: string;
  subCategory?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  specifications?: Record<string, unknown>;
  additionalInfo?: string;
};

export function useCreateVendorProductDraft() {
  const qc = useQueryClient();
  return useMutation<{ id: string }, Error, VendorProductForm>({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        "/api/v1/vendors/products/drafts",
        payload
      );
      return data.data as { id: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      toast.success("Draft created. You can add media and submit for review.");
    },
  });
}

export function useUpdateVendorProduct(productId: string) {
  const qc = useQueryClient();
  return useMutation<unknown, Error, Partial<VendorProductForm>>({
    mutationFn: async (updates) => {
      const { data } = await api.patch(
        `/api/v1/vendors/products/${productId}`,
        updates
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      toast.success("Product saved");
    },
  });
}

export function useSubmitVendorProduct(productId: string) {
  const qc = useQueryClient();
  return useMutation<unknown, Error, void>({
    mutationFn: async () => {
      const { data } = await api.post(
        `/api/v1/vendors/products/${productId}/submit`
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      toast.success("Submitted for review");
    },
  });
}

export function useUploadVendorProductMedia(productId: string) {
  const qc = useQueryClient();
  return useMutation<unknown, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post(
        `/api/v1/vendors/products/${productId}/media`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      toast.success("Media updated");
    },
  });
}

export function useRemoveVendorProductImage(productId: string) {
  const qc = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: async (imageUrl: string) => {
      const { data } = await api.delete(
        `/api/v1/vendors/products/${productId}/media/image`,
        { params: { url: imageUrl } }
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      toast.success("Image removed");
    },
  });
}

export function useDeleteVendorProduct() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete(
        `/api/v1/vendors/products/${productId}`
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-product-limit"] });
      qc.invalidateQueries({ queryKey: ["vendor-subscription-info"] });
    },
  });
}
