"use client";

import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface VendorSignupPayload {
  name: string;
  email: string;
  phone_number?: string;
  country: string;
  password: string;
  companyName?: string;
  notes?: string;
}

const sanitizeSignupErrorMessage = (message?: string) => {
  const fallback = "Signup failed";
  if (!message) return fallback;

  const normalized = message.trim();
  const lower = normalized.toLowerCase();

  if (lower.startsWith("supabase")) {
    return "Unable to create account right now. Please try again shortly.";
  }

  return normalized;
};

export function useVendorSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: VendorSignupPayload) => {
      const normalizedPayload = {
        ...payload,
        email: payload.email.toLowerCase().trim(),
      };
      const { data } = await api.post(
        "/api/v1/auth/signup-vendor",
        normalizedPayload
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Registration successful. Check your email for OTP.");
      router.push(
        `/auth/verify-otp?email=${encodeURIComponent(variables.email)}&type=vendor`
      );
    },
    onError: (err: Error) => {
      const axiosError = err as any;
      const message = sanitizeSignupErrorMessage(
        axiosError?.response?.data?.message
      );
      toast.error(message);
    },
  });
}
