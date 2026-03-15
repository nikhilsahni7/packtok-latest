import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import api from "../lib/api";

export type QuoteStatus = "PENDING" | "REVIEWED" | "COMPLETED" | "CANCELLED";
export type ProductType =
  | "MACHINERY"
  | "SPARE_PARTS"
  | "CONSUMABLES"
  | "RAW_MATERIALS";

export interface QuoteRequest {
  id: string;
  userId: string;
  productId: string;
  companyName: string;
  phone?: string;
  email?: string;
  address: string;
  message: string;
  additionalInfo?: string;
  status: QuoteStatus;
  response?: string;
  respondedAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    title: string;
    description?: string;
    images?: string[];
    imagesThumbnail?: string;
    price?: number;
    manufacturer?: string;
    productType?: ProductType;
    category?: {
      name: string;
    };
  };
}

export function useMyQuoteRequests() {
  return useQuery<QuoteRequest[]>({
    queryKey: ["my-quote-requests"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/api/v1/quotes/my");
        return data.data as QuoteRequest[];
      } catch (error: any) {
        console.error("Fetch my quote requests error:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh longer since we use socket updates
  });
}

export function useQuoteRequestDetails(quoteId: string) {
  return useQuery<QuoteRequest>({
    queryKey: ["quote-request", quoteId],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/v1/quotes/${quoteId}`);
        return data.data as QuoteRequest;
      } catch (error: any) {
        console.error("Fetch quote request details error:", error);
        throw error;
      }
    },
    enabled: !!quoteId,
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh longer since we use socket updates
  });
}

export function useCancelQuoteRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.put(`/api/v1/quotes/${id}/cancel`, { reason });
      return data;
    },
    onSuccess: (_, variables) => {
      Toast.show({
        type: "success",
        text1: "Request Withdrawn",
        text2: "Your quote request was successfully cancelled.",
      });
      // Invalidate both lists and detail
      queryClient.invalidateQueries({ queryKey: ["my-quote-requests"] });
      queryClient.invalidateQueries({ queryKey: ["quote-request", variables.id] });
    },
    onError: (error: any) => {
      console.error("Cancel quote error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          "Failed to withdraw request. Please try again.",
      });
    },
  });
}
