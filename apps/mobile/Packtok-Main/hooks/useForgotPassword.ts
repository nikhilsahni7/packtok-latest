import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import api from "../lib/api";

// Request password reset OTP
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (email: string) => {
      await api.post("/api/v1/auth/forgot-password/request", {
        email: email.toLowerCase().trim(),
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "Check your email for the reset code.",
        position: "top",
        visibilityTime: 3000,
      });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to send OTP.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
        visibilityTime: 4000,
      });
    },
  });
}

// Verify password reset OTP
export function useVerifyPasswordResetOtp() {
  return useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      await api.post("/api/v1/auth/forgot-password/verify", {
        email: payload.email.toLowerCase().trim(),
        otp: payload.otp,
      });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Invalid or expired OTP.";
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: message,
        position: "top",
        visibilityTime: 4000,
      });
    },
  });
}

// Confirm password reset (set new password)
export function useConfirmPasswordReset() {
  return useMutation({
    mutationFn: async (payload: {
      email: string;
      otp: string;
      newPassword: string;
    }) => {
      await api.post("/api/v1/auth/forgot-password/confirm", {
        ...payload,
        email: payload.email.toLowerCase().trim(),
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Password Reset Successful",
        text2: "You can now login with your new password.",
        position: "top",
        visibilityTime: 4000,
      });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Password reset failed.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
        visibilityTime: 4000,
      });
    },
  });
}
