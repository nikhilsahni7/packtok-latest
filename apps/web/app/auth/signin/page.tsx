"use client";

import SignInForm from "@/components/auth/signin-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignupCta() {
  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl");
  const signupHref = callbackUrl
    ? `/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/auth/signup";

  return (
    <p className="text-muted-foreground">
      Don&lsquo;t have an account yet?{" "}
      <Link
        href={signupHref}
        className="text-orange-500 hover:text-orange-500/80 font-medium underline-offset-4 hover:underline"
      >
        Sign Up
      </Link>
    </p>
  );
}

export default function Page() {
  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Sign In</h1>
      <Suspense fallback={null}>
        <SignupCta />
      </Suspense>
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            Loading...
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </main>
  );
}
