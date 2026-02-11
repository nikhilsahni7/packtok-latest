"use client";

import SignUpForm from "@/components/auth/signup-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SigninCta() {
  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl");
  const signinHref = callbackUrl
    ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/auth/signin";

  return (
    <p className="text-muted-foreground">
      Already have an account?{" "}
      <Link
        href={signinHref}
        className="text-orange-400 hover:text-orange-500 font-medium underline-offset-4 hover:underline"
      >
        Sign In
      </Link>
    </p>
  );
}

export default function Page() {
  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Sign Up as User</h1>
      <Suspense fallback={null}>
        <SigninCta />
      </Suspense>
      <SignUpForm />
    </main>
  );
}
