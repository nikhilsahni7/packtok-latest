"use client";

import api from "@/lib/axios";
import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordForm() {
  const params = useSearchParams();
  const presetEmail = params.get("email") || "";
  const fromAccount = params.get("from") === "account";
  const router = useRouter();

  const [step, setStep] = useState<Step>(presetEmail ? "otp" : "email");
  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-send OTP if email is preset (from account page)
  useEffect(() => {
    if (presetEmail && step === "otp") {
      // OTP was already requested before redirect
    }
  }, [presetEmail, step]);

  const requestMutation = useMutation({
    mutationFn: async (emailVal: string) => {
      await api.post("/api/v1/auth/forgot-password/request", {
        email: emailVal.toLowerCase().trim(),
      });
    },
    onSuccess: () => {
      toast.success("OTP sent to your email");
      setStep("otp");
    },
    onError: (err: Error) => {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError?.response?.data?.message || "Request failed";
      toast.error(message);
    },
  });

  const verifyResetOtpMutation = useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      await api.post("/api/v1/auth/forgot-password/verify", {
        email: payload.email.toLowerCase().trim(),
        otp: payload.otp,
      });
    },
    onSuccess: () => {
      setStep("password");
    },
    onError: (err: Error) => {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message =
        axiosError?.response?.data?.message || "Invalid or expired OTP";
      toast.error(message);
    },
  });

  const confirmMutation = useMutation({
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
      toast.success("Password reset successful!");
      if (fromAccount) {
        router.push("/account");
      } else {
        router.push("/auth/signin");
      }
    },
    onError: (err: Error) => {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message =
        axiosError?.response?.data?.message || "Password reset failed";
      toast.error(message);
      // If OTP is invalid/expired, go back to OTP step
      if (
        message.toLowerCase().includes("otp") ||
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("expired")
      ) {
        setOtp(["", "", "", "", "", ""]);
        setStep("otp");
      }
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    requestMutation.mutate(email);
  };

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
        // Handle paste
        const digits = value.replaceAll(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < digits.length && index + i < 6; i++) {
          newOtp[index + i] = digits[i];
        }
        setOtp(newOtp);
        const nextIdx = Math.min(index + digits.length, 5);
        otpRefs.current[nextIdx]?.focus();
        return;
      }

      if (value && !/^\d$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    verifyResetOtpMutation.mutate({ email, otp: otpValue });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    confirmMutation.mutate({
      email,
      otp: otp.join(""),
      newPassword,
    });
  };

  const maskedEmail =
    email.length > 5
      ? `${email.slice(0, 3)}...${email.slice(email.indexOf("@"))}`
      : email;

  // Step 1: Email
  if (step === "email") {
    return (
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Forgot password
        </h1>
        <p className="text-gray-500 mb-10">
          Please enter your email to reset the password
        </p>

        <form onSubmit={handleEmailSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full h-12 bg-white border-gray-200 rounded-full px-5 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          <Button
            type="submit"
            disabled={requestMutation.isPending}
            className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white text-lg font-medium rounded-full"
          >
            {requestMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Next"
            )}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Remembered your password?{" "}
            <Link
              href="/auth/signin"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    );
  }

  // Step 2: OTP Verification
  if (step === "otp") {
    return (
      <div>
        <button
          onClick={() => setStep("email")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Check your email
        </h1>
        <p className="text-gray-500 mb-2">
          We sent a reset link to {maskedEmail}
        </p>
        <p className="text-gray-400 text-sm mb-10">
          Enter the 6-digit code mentioned in the email
        </p>

        <form onSubmit={handleOtpSubmit} className="space-y-8">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData("text");
                  handleOtpChange(index, pasted);
                }}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white"
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={verifyResetOtpMutation.isPending}
            className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white text-lg font-medium rounded-full"
          >
            {verifyResetOtpMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Next"
            )}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              className="text-orange-500 hover:text-orange-600 font-medium"
              onClick={() => requestMutation.mutate(email)}
              disabled={requestMutation.isPending}
            >
              {requestMutation.isPending ? "Sending..." : "Resend"}
            </button>
          </p>
        </form>
      </div>
    );
  }

  // Step 3: Set New Password
  return (
    <div>
      <button
        onClick={() => setStep("otp")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Set a new password
      </h1>
      <p className="text-gray-500 mb-10">
        Create a new password. Ensure it differs from previous ones for security
      </p>

      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full h-12 bg-white border-gray-200 rounded-full px-5 pr-12 focus:border-orange-400 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full h-12 bg-white border-gray-200 rounded-full px-5 pr-12 focus:border-orange-400 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={confirmMutation.isPending}
          className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white text-lg font-medium rounded-full"
        >
          {confirmMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
}
