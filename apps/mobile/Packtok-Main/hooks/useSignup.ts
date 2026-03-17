import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import api from "../lib/api";

interface SignupPayload {
  name: string;
  email: string;
  phone_number?: string;
  country: string;
  password: string;
}

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const normalizedPayload = {
        ...payload,
        email: payload.email.toLowerCase().trim(),
      };
      const { data } = await api.post("/api/v1/auth/signup", normalizedPayload);
      return data;
    },
    onSuccess: (_, variables) => {
      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Check your email for OTP verification code.",
        position: "top",
        visibilityTime: 4000,
      });
      router.push({
        pathname: "/verify-otp" as any,
        params: {
          email: variables.email.toLowerCase().trim(),
          type: "user",
        },
      });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Signup failed. Please try again.";
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: message,
        position: "top",
        visibilityTime: 4000,
      });
    },
  });
}
