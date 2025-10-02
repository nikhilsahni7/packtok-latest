import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import api from "../lib/api";

export interface CreateQuotePayload {
  productId: string;
  companyName: string;
  address: string;
  message: string;
  additionalInfo?: string;
}

export interface QuoteRequest {
  id: string;
  userId: string;
  productId: string;
  companyName: string;
  address: string;
  message: string;
  additionalInfo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation<QuoteRequest, Error, CreateQuotePayload>({
    mutationFn: async (payload: CreateQuotePayload) => {
      try {
        const { data } = await api.post("/api/v1/quotes", payload);
        return data.data as QuoteRequest;
      } catch (error: any) {
        console.error("Create quote error:", error);
        throw error;
      }
    },
    onSuccess: (_data) => {
      Toast.show({
        type: "success",
        text1: "Quote Request Sent!",
        text2: "We'll get back to you soon.",
        position: "top",
        visibilityTime: 3000,
      });
      // Invalidate and refetch any related queries
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to submit quote request";
      Toast.show({
        type: "error",
        text1: "Quote Request Failed",
        text2: message,
        position: "top",
        visibilityTime: 3000,
      });
    },
  });
}
