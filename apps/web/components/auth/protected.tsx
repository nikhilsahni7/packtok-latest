"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthStore, useHasHydrated } from "@/store/auth-store";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Protected({
  children,
  redirectTo = "/auth/signin",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const token = useAuthStore((s) => s.accessToken);
  const hasHydrated = useHasHydrated();
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    // Only redirect after Zustand has hydrated from localStorage
    // to prevent premature redirects before auth state is restored
    if (hasHydrated && !token && !isLoading) {
      const current =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      const url = new URL(
        redirectTo,
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost"
      );
      // Only add callbackUrl if not already present
      if (!url.searchParams.get("callbackUrl")) {
        url.searchParams.set("callbackUrl", current);
      }
      router.replace(url.pathname + (url.search ? url.search : ""));
    }
  }, [
    hasHydrated,
    token,
    isLoading,
    router,
    redirectTo,
    pathname,
    searchParams,
  ]);

  // Wait for hydration before making any auth decisions
  if (!hasHydrated || !token || isLoading)
    return (
      <div className="flex justify-center items-center py-20 h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return <>{children}</>;
}
