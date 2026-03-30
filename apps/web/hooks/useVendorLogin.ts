"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface VendorLoginPayload {
  email: string;
  password: string;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function useVendorLogin() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setRefreshToken = useAuthStore((s) => s.setRefreshToken);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: VendorLoginPayload) => {
      const normalizedPayload = {
        ...payload,
        email: payload.email.toLowerCase().trim(),
      };
      const { data } = await api.post(
        "/api/v1/auth/login-vendor",
        normalizedPayload
      );
      return data.data as {
        accessToken: string;
        refreshToken: string;
        user: User;
      };
    },
    onSuccess: ({ accessToken, refreshToken, user }) => {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
      // Invalidate the cached "me" query so navbar picks up the new user immediately
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Logged in successfully");
      router.push("/vendor/dashboard");
    },
    onError: (err: Error, variables) => {
      const axiosError = err as ApiErrorResponse;
      const message = axiosError?.response?.data?.message || "Login failed";

      if (message.toLowerCase().includes("account not verified")) {
        const email = encodeURIComponent(variables.email.toLowerCase().trim());
        const callbackUrl = searchParams?.get("callbackUrl");
        const href = callbackUrl
          ? `/auth/verify-otp?email=${email}&type=vendor&callbackUrl=${encodeURIComponent(callbackUrl)}`
          : `/auth/verify-otp?email=${email}&type=vendor`;
        router.push(href);
      }

      toast.error(message);
    },
  });
}
