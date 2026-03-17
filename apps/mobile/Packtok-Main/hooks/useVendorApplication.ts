import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export type VendorApplication = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  companyName?: string | null;
  notes?: string | null;
} | null;

export function useVendorApplication() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role);

  return useQuery<VendorApplication>({
    queryKey: ["vendor-application"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/vendors/me/application");
      return data.data as VendorApplication;
    },
    enabled: isAuthenticated && role === "VENDOR",
    retry: false,
    staleTime: 60_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
  });
}

export function useApplyVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload?: { companyName?: string; notes?: string }) => {
      const { data } = await api.post("/api/v1/vendors/apply", payload ?? {});
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-application"] });
      Toast.show({
        type: "success",
        text1: "Application Submitted",
        text2: "Your vendor application was submitted for review.",
        position: "top",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Unable to Apply",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}
