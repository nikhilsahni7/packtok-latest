import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export type VendorProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  productType?: string;
  quantity: number;
  status: string;
  submissionStatus?: string | null;
  imagesThumbnail?: string | null;
  reviewNotes?: string | null;
  images?: string[];
  videoUrl?: string | null;
  videoThumbnail?: string | null;
  pdfUrl?: string | null;
  machineType?: string | null;
  condition?: string;
  subCategory?: string | null;
  additionalInfo?: string | null;
  specifications?: Record<string, unknown> | null;
  category?: {
    id: string;
    name: string;
  } | null;
  manufacturer?: string | null;
  model?: string | null;
  year?: number | null;
  categoryName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VendorProductFilters = {
  status?: string;
  submissionStatus?: string;
};

export type VendorProductForm = {
  title: string;
  description: string;
  price: number;
  currency?: string;
  productType: string;
  condition: string;
  quantity?: number;
  categoryName: string;
  subCategory?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  specifications?: Record<string, unknown>;
  machineType?: string;
  additionalInfo?: string;
};

export type VendorInventory = {
  id?: string;
  productId?: string;
  stockOnHand: number;
  lowStockThreshold?: number | null;
  warehouseLocation?: string | null;
};

export function useVendorProducts(filters?: VendorProductFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.submissionStatus)
    params.set("submissionStatus", filters.submissionStatus);

  const qs = params.toString();
  const endpoint = qs
    ? `/api/v1/vendors/products?${qs}`
    : "/api/v1/vendors/products";

  return useQuery<VendorProduct[]>({
    queryKey: ["vendor-products", filters?.status, filters?.submissionStatus],
    queryFn: async () => {
      const { data } = await api.get(endpoint);
      return (data.data ?? []) as VendorProduct[];
    },
    staleTime: 60_000,
  });
}

export function useVendorProduct(productId: string) {
  return useQuery<VendorProduct>({
    queryKey: ["vendor-product", productId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/vendors/products/${productId}`);
      return data.data as VendorProduct;
    },
    enabled: Boolean(productId),
  });
}

export function useCreateVendorProductDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VendorProductForm) => {
      const safePayload = {
        ...payload,
        specifications: payload.specifications ?? {},
      };
      const { data } = await api.post(
        "/api/v1/vendors/products/drafts",
        safePayload,
      );
      return data.data as { id: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-subscription-info"] });
      Toast.show({ type: "success", text1: "Draft Created", position: "top" });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Unable to create draft",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}

export function useUpdateVendorProduct(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<VendorProductForm>) => {
      const safePayload = {
        ...payload,
        specifications: payload.specifications ?? {},
      };
      const { data } = await api.patch(
        `/api/v1/vendors/products/${productId}`,
        safePayload,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-product", productId] });
      Toast.show({
        type: "success",
        text1: "Product Updated",
        position: "top",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}

export function useSubmitVendorProduct(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/api/v1/vendors/products/${productId}/submit`,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-product", productId] });
      Toast.show({
        type: "success",
        text1: "Submitted for Review",
        text2: "Your product is now pending admin approval.",
        position: "top",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Submit failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}

export function useDeleteVendorProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete(
        `/api/v1/vendors/products/${productId}`,
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-subscription-info"] });
      Toast.show({
        type: "success",
        text1: "Product Deleted",
        position: "top",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}

export function useUploadVendorProductMedia(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post(
        `/api/v1/vendors/products/${productId}/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-product", productId] });
      Toast.show({ type: "success", text1: "Media Updated", position: "top" });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Media upload failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}

export function useRemoveVendorProductImage(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (url: string) => {
      const { data } = await api.delete(
        `/api/v1/vendors/products/${productId}/media/image`,
        {
          params: { url },
        },
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-product", productId] });
      Toast.show({ type: "success", text1: "Image Removed", position: "top" });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Image remove failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}

export function useVendorInventory(productId: string) {
  return useQuery<VendorInventory | null>({
    queryKey: ["vendor-product-inventory", productId],
    enabled: Boolean(productId),
    queryFn: async () => {
      const { data } = await api.get(
        `/api/v1/vendors/products/${productId}/inventory`,
      );
      return (data.data ?? null) as VendorInventory | null;
    },
    staleTime: 30_000,
  });
}

export function useUpsertVendorInventory(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<VendorInventory, "id" | "productId">) => {
      const { data } = await api.put(
        `/api/v1/vendors/products/${productId}/inventory`,
        payload,
      );
      return data.data as VendorInventory;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["vendor-product-inventory", productId],
      });
      Toast.show({
        type: "success",
        text1: "Inventory Saved",
        position: "top",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Inventory save failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}

export function useAdjustVendorInventory(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      delta: number;
      reason:
        | "ADJUSTMENT"
        | "SALE"
        | "RESTOCK"
        | "RESERVATION"
        | "CANCELLATION";
      meta?: unknown;
    }) => {
      const { data } = await api.post(
        `/api/v1/vendors/products/${productId}/inventory/adjustments`,
        payload,
      );
      return data.data as VendorInventory;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["vendor-product-inventory", productId],
      });
      Toast.show({
        type: "success",
        text1: "Inventory Adjusted",
        position: "top",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Inventory adjustment failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}
