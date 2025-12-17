"use client";

import dynamic from "next/dynamic";

const VendorSignUpForm = dynamic(
  () => import("@/components/auth/vendor-signup-form"),
  { ssr: false }
);

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Sign up as Vendor</h1>
      <VendorSignUpForm />
    </div>
  );
}
