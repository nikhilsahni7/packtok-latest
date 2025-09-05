"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export interface VendorUser {
  id: string;
  name: string | null;
  email: string;
  phone_number?: string | null;
  country?: string | null;
  role: string;
}

export interface VendorApplication {
  id: string;
  userId: string;
  companyName?: string | null;
  notes?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: VendorUser;
}

export function useVendorApplications() {
  return useQuery<{ data: VendorApplication[] }>({
    queryKey: ["admin", "vendor-applications"],
    queryFn: async () => (await api.get("/api/v1/admins/vendors")).data,
  });
}

export function useApproveVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/api/v1/admins/vendors/${id}/approve`);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "vendor-applications"] }),
  });
}

export function useRejectVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      await api.put(`/api/v1/admins/vendors/${id}/reject`, { reason });
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "vendor-applications"] }),
  });
}
