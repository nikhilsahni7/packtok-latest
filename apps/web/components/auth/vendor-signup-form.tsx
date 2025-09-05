"use client";

import { useVendorSignup } from "@/hooks/useVendorSignup";
import {
  VendorSignUpFormData,
  vendorSignUpSchema,
} from "@/schemas/vendor-signup-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@packtok/ui/components/button";
import { Checkbox } from "@packtok/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@packtok/ui/components/form";
import { Input } from "@packtok/ui/components/input";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import ReactSelect from "react-select";

const PhoneInput = dynamic(() => import("react-phone-input-2"), {
  ssr: false,
}) as React.ComponentType<{
  country: string;
  value: string;
  onChange: (value: string) => void;
  autoFormat?: boolean;
  enableLongNumbers?: boolean;
  enableSearch?: boolean;
  placeholder?: string;
  containerClass?: string;
  inputClass?: string;
  buttonClass?: string;
  inputProps?: Record<string, unknown>;
}>;

const COUNTRY_OPTIONS = (() => {
  countries.registerLocale(enLocale as unknown as countries.LocaleData);
  const names = countries.getNames("en", { select: "official" });
  return Object.entries(names).map(([code, name]) => ({
    value: code,
    label: `${name} (${code})`,
  }));
})();

export default function VendorSignUpForm() {
  const { mutate, isPending } = useVendorSignup();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<VendorSignUpFormData>({
    resolver: zodResolver(vendorSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: undefined,
      country: "",
      password: "",
      companyName: "",
      notes: "",
      agreeToTerms: false,
    },
  });

  // Country options for react-select
  const countryOptions = COUNTRY_OPTIONS;

  const onSubmit = useCallback(
    (data: VendorSignUpFormData) => {
      mutate(data);
    },
    [mutate]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter your full name"
                  name="name"
                  autoComplete="name"
                  className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  name="email"
                  autoComplete="email"
                  className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PhoneInput
                  country="in"
                  value={field.value ?? ""}
                  onChange={(value: string) =>
                    field.onChange(value ? `+${value}` : undefined)
                  }
                  autoFormat={false}
                  enableLongNumbers
                  enableSearch
                  placeholder="Enter phone number"
                  containerClass="relative w-full"
                  inputClass="!w-full !bg-transparent !border-0 !border-b !border-border !px-0 !pl-12 sm:!pl-14 focus:!border-primary focus:!outline-none"
                  buttonClass="!absolute !left-0 !top-1/2 -translate-y-1/2 !bg-transparent !border-0 !pl-0 !w-10 sm:!w-12 !min-w-0 !max-w-10 sm:!max-w-12"
                  inputProps={{
                    ref: undefined,
                    name: "phone_number",
                    autoComplete: "tel",
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ReactSelect
                  classNamePrefix="react-select"
                  options={countryOptions}
                  value={
                    countryOptions.find((opt) => opt.value === field.value) ||
                    null
                  }
                  onChange={(opt: { value: string } | null) =>
                    field.onChange(opt ? opt.value : "")
                  }
                  isSearchable
                  maxMenuHeight={250}
                  placeholder="Select country"
                  name="country"
                  inputId="vendor-country-select"
                  aria-label="Select country"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: 0,
                      borderColor: "#e5e7eb",
                    }),
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Company name (optional)"
                  className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Notes (optional)"
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
                    placeholder="Create a password"
                    name="password"
                    autoComplete="new-password"
                    spellCheck={false}
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

        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start sm:items-center justify-center space-x-0 sm:space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm inline font-normal">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
