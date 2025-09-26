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
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

export default function VerifyOtpForm() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const callbackUrl = params.get("callbackUrl") || "";
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      await api.post("/api/v1/auth/verify-otp", { email, otp: data.otp });
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

  const onSubmit = (data: FormData) => mutate(data);

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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Verifying…" : "Verify"}
        </Button>
      </form>
    </Form>
  );
}
