"use client";

import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@packtok/ui/components/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@packtok/ui/components/form";
import { Input } from "@packtok/ui/components/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpForm() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const callbackUrl = params.get("callbackUrl") || "";
  const router = useRouter();

  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });

  // Verify OTP mutation
  const { mutate: verifyMutate, isPending: isVerifying } = useMutation({
    mutationFn: async (data: FormData) => {
      await api.post("/api/v1/auth/verify-otp", {
        email: email.toLowerCase().trim(),
        otp: data.otp,
      });
    },
    onSuccess: () => {
      toast.success("Email verified. You can now login.");
      const signinPath = "/auth/signin";
      const href = callbackUrl
        ? `${signinPath}?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : signinPath;
      router.push(href);
    },
    onError: (err: Error) => {
      const axiosError = err as { response?: { data?: { message?: string } } };
      toast.error(axiosError?.response?.data?.message || "Verification failed");
    },
  });

  // Resend OTP mutation
  const { mutate: resendMutate, isPending: isResending } = useMutation({
    mutationFn: async () => {
      await api.post("/api/v1/auth/resend-otp", {
        email: email.toLowerCase().trim(),
      });
    },
    onSuccess: () => {
      toast.success("A new OTP has been sent to your email.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      form.reset(); // Clear the OTP input
    },
    onError: (err: Error) => {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError?.response?.data?.message || "Failed to resend OTP";
      toast.error(message);

      // If user not found, don't set cooldown
      if (!message.toLowerCase().includes("not found")) {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      }
    },
  });

  const onSubmit = (data: FormData) => verifyMutate(data);

  const handleResendOtp = () => {
    if (resendCooldown > 0 || isResending || !email) return;
    resendMutate();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
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

        <Button type="submit" className="w-full" disabled={isVerifying}>
          {isVerifying ? "Verifying…" : "Verify"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn&apos;t receive the OTP?
          </p>
          <Button
            type="button"
            variant="link"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isResending || !email}
            className="text-primary hover:underline p-0 h-auto"
          >
            {isResending
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
