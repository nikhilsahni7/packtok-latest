"use client";

import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@packtok/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@packtok/ui/components/form";
import { Input } from "@packtok/ui/components/input";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const confirmSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RequestForm = z.infer<typeof requestSchema>;
type ConfirmForm = z.infer<typeof confirmSchema>;

export default function ForgotPasswordForm() {
  const params = useSearchParams();
  const presetEmail = params.get("email") || "";
  const router = useRouter();

  const [step, setStep] = useState<"request" | "confirm">(
    presetEmail ? "confirm" : "request"
  );

  const requestForm = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: presetEmail || "" },
  });

  const confirmForm = useForm<ConfirmForm>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      email: presetEmail || "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (presetEmail) {
      requestForm.setValue("email", presetEmail);
      confirmForm.setValue("email", presetEmail);
    }
  }, [presetEmail, requestForm, confirmForm]);

  const requestMutation = useMutation({
    mutationFn: async (payload: RequestForm) => {
      await api.post("/api/v1/auth/forgot-password/request", payload);
    },
    onSuccess: () => {
      toast.success("OTP sent to your email");
      setStep("confirm");
      confirmForm.setValue("email", requestForm.getValues("email"));
    },
    onError: (err: Error) => {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError?.response?.data?.message || "Request failed";
      toast.error(message);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (payload: ConfirmForm) => {
      await api.post("/api/v1/auth/forgot-password/confirm", {
        email: payload.email,
        otp: payload.otp,
        newPassword: payload.newPassword,
      });
    },
    onSuccess: () => {
      toast.success("Password reset successful. Please sign in.");
      router.push("/auth/signin");
    },
    onError: (err: Error) => {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message =
        axiosError?.response?.data?.message || "Password reset failed";
      toast.error(message);
    },
  });

  return (
    <div className="space-y-8">
      {step === "request" ? (
        <Form {...requestForm}>
          <form
            onSubmit={requestForm.handleSubmit((data) =>
              requestMutation.mutate(data)
            )}
            className="space-y-6"
          >
            <FormField
              control={requestForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={requestMutation.isPending}
            >
              {requestMutation.isPending ? "Sending…" : "Send OTP"}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              Remembered your password?{" "}
              <Link
                href="/auth/signin"
                className="text-primary hover:underline"
              >
                Sign In
              </Link>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...confirmForm}>
          <form
            onSubmit={confirmForm.handleSubmit((data) =>
              confirmMutation.mutate(data)
            )}
            className="space-y-6"
          >
            <FormField
              control={confirmForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={confirmForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter 6-digit OTP"
                      className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={confirmForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter new password"
                      className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={confirmForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm new password"
                      className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={confirmMutation.isPending}
            >
              {confirmMutation.isPending ? "Resetting…" : "Reset Password"}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              Didn’t receive OTP?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() =>
                  requestMutation.mutate({
                    email: confirmForm.getValues("email"),
                  })
                }
                disabled={requestMutation.isPending}
              >
                Resend
              </button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
