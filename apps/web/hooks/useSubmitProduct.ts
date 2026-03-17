"use client";

import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Product } from "@/types/marketplace";

interface SubmitProductPayload {
  title: string;
  description: string;
  price: string;
  currency: string;
  productType: string;
  condition: string;
  categoryName: string;
  manufacturer?: string;
  model?: string;
  year?: string;
  specifications?: string;
  additionalInfo?: string;
  thumbnail: File;
  images: File[];
  video?: File;
  videoThumbnail?: File;
  pdf?: File;
}

export function useSubmitProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, SubmitProductPayload>({
    mutationFn: async (payload: SubmitProductPayload) => {
      const formData = new FormData();

      // Add text fields
      Object.entries(payload).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          !(value instanceof File) &&
          !Array.isArray(value)
        ) {
          formData.append(key, value.toString());
        }
      });

      // Add thumbnail
      if (payload.thumbnail) {
        formData.append("thumbnail", payload.thumbnail);
      }

      // Add images (can repeat up to 5x)
      payload.images.forEach((image) => {
        formData.append("images", image);
      });

      // Add optional files
      if (payload.video) {
        formData.append("video", payload.video);
      }
      if (payload.videoThumbnail) {
        formData.append("videoThumbnail", payload.videoThumbnail);
      }
      if (payload.pdf) {
        formData.append("pdf", payload.pdf);
      }

      const { data } = await api.post("/api/v1/products/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data as Product;
    },
    onSuccess: (_data) => {
      toast.success(
        "Product submitted successfully! It will be reviewed by our team."
      );
      // Invalidate products queries to refresh listings
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      const axiosError = error as any;
      const message =
        axiosError?.response?.data?.message || "Failed to submit product";
      toast.error(message);
    },
  });
}
