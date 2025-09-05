"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Protected({
  children,
  redirectTo = "/auth/signin",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    if (!token && !isLoading) {
      router.replace(redirectTo);
    }
  }, [token, isLoading, router, redirectTo]);

  if (!token || isLoading)
    return (
      <div className="flex justify-center items-center py-20 h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return <>{children}</>;
}
