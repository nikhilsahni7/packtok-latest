"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const VendorSignInForm = dynamic(
  () => import("@/components/auth/vendor-signin-form"),
  { ssr: false }
);

export default function Page() {
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
