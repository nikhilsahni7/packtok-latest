"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { MarketplaceProduct } from "../types/product";
import { QK } from "../utils/queryKeys";

// Interface for submissions with user data
export interface Submission extends MarketplaceProduct {
  submittedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

// Fetch all submissions (pending user products)
export function useSubmissions() {
  return useQuery({
    queryKey: QK.submissions,
    queryFn: async (): Promise<Submission[]> => {
      const { data } = await api.get("/api/v1/admins/submissions");
      return data.data || data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes (more frequent updates for pending items)
  });
}

// Approve submission mutation
export function useApproveSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: string): Promise<Submission> => {
      const { data } = await api.put(
        `/api/v1/admins/submissions/${submissionId}/approve`,
        {},
      );
      return data.data || data;
    },
    onSuccess: () => {
      // Invalidate both submissions and products queries
      queryClient.invalidateQueries({ queryKey: QK.submissions });
      queryClient.invalidateQueries({ queryKey: QK.products });
    },
  });
}

// Reject submission mutation
export function useRejectSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: string): Promise<Submission> => {
      const { data } = await api.put(
        `/api/v1/admins/submissions/${submissionId}/reject`,
        {},
      );
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.submissions });
    },
  });
}
