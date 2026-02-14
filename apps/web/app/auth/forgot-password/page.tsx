import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
