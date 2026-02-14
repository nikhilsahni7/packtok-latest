"use client";

import { useAuthStore, useHasHydrated } from "@/store/auth-store";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VendorSignInForm = dynamic(
  () => import("@/components/auth/vendor-signin-form"),
  { ssr: false }
);

export default function Page() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useHasHydrated();
  const router = useRouter();

  // If already logged in as vendor, redirect to dashboard
  useEffect(() => {
    if (hasHydrated && accessToken && user?.role === "VENDOR") {
      router.replace("/vendor/dashboard");
    }
  }, [hasHydrated, accessToken, user, router]);

  // Show nothing while redirecting
  if (hasHydrated && accessToken && user?.role === "VENDOR") {
    return null;
  }

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Sign In as Vendor
      </h1>
      <p className="text-muted-foreground">
        Don&lsquo;t have an account yet?{" "}
        <Link
          href="/auth/vendor/signup"
          className="text-orange-500 hover:text-orange-500/80 font-medium underline-offset-4 hover:underline"
        >
          Sign Up
        </Link>
      </p>
      <VendorSignInForm />
    </main>
  );
}
