"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { QK } from "../utils/queryKeys";

export type EmailSubscriptionType = "PODCAST" | "NEWSLETTER";

export interface EmailSubscriptionItem {
  id: string;
  email: string;
  type: EmailSubscriptionType;
  createdAt: string;
  updatedAt: string;
}

interface EmailSubscriptionResponse {
  data: EmailSubscriptionItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
  summary: {
    totalAll: number;
    podcast: number;
    newsletter: number;
  };
}

export const useEmailSubscriptions = (params?: {
  page?: number;
  limit?: number;
  type?: EmailSubscriptionType;
}) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 30;
  const type = params?.type;

  return useQuery({
    queryKey: [...QK.emailSubscriptions, page, limit, type || "ALL"],
    queryFn: async (): Promise<EmailSubscriptionResponse> => {
      const { data } = await api.get("/api/v1/admins/email-subscriptions", {
        params: {
          page,
          limit,
          ...(type ? { type } : {}),
        },
      });
      return data.data;
    },
    staleTime: 1000 * 30,
  });
};
