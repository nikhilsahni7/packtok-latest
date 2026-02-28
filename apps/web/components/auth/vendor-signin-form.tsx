"use client";

import { useVendorLogin } from "@/hooks/useVendorLogin";
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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const vendorSignInSchema = z.object({
  email: z.string().email("Please enter a valid email address").refine(
    (val) => /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(val) && !/\.([a-zA-Z]{2,})\.\1$/i.test(val),
    { message: "Please enter a valid email address" }
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type VendorSignInFormData = z.infer<typeof vendorSignInSchema>;

export default function VendorSignInForm() {
  const { mutate, isPending } = useVendorLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<VendorSignInFormData>({
    resolver: zodResolver(vendorSignInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: VendorSignInFormData) => mutate(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
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
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="border-0 border-b border-border rounded-none px-0 pr-8 focus-visible:ring-0 focus-visible:border-primary bg-transparent w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-orange-500 hover:text-orange-500/80 underline-offset-4 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
