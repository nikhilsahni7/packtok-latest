"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export type VendorApplication = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  companyName?: string | null;
  notes?: string | null;
} | null;

export function useVendorApplication() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["vendor-application"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/vendors/me/application");
      return data.data as VendorApplication;
    },
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 60_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
