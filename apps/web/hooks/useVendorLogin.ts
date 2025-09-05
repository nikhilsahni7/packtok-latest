"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface VendorLoginPayload {
  email: string;
  password: string;
}

export function useVendorLogin() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: VendorLoginPayload) => {
      const { data } = await api.post("/api/v1/auth/login-vendor", payload);
      return data.data as { accessToken: string; user: User };
    },
    onSuccess: ({ accessToken, user }) => {
      setAccessToken(accessToken);
      setUser(user);
      toast.success("Logged in successfully");
      router.push("/vendor/dashboard");
    },
    onError: (err: Error) => {
      const axiosError = err as any;
      const message = axiosError?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });
}
