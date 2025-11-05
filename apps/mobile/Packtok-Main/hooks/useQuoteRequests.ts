import { useQuery } from "@tanstack/react-query";
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
  address: string;
  message: string;
  additionalInfo?: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    title: string;
    description?: string;
    images?: string[];
    price?: number;
    manufacturer?: string;
    productType?: ProductType;
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
  });
}
