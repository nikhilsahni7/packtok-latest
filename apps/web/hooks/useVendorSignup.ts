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

export function useVendorSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: VendorSignupPayload) => {
      const { data } = await api.post("/api/v1/auth/signup-vendor", payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Registration successful. Check your email for OTP.");
      router.push(
        `/auth/verify-otp?email=${encodeURIComponent(variables.email)}`
      );
    },
    onError: (err: Error) => {
      const axiosError = err as any;
      const message = axiosError?.response?.data?.message || "Signup failed";
      toast.error(message);
    },
  });
}
