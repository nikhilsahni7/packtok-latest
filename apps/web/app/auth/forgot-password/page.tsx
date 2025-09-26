import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function Page() {
  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Forgot Password
      </h1>
      <p className="text-muted-foreground">
        Enter your email to receive an OTP, then set a new password.
      </p>
      <ForgotPasswordForm />
    </main>
  );
}
