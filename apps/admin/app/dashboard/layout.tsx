"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Sidebar } from "../../components/sidebar";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAuthStore, useHasHydrated } from "../../store/auth-store";
import { useUiStore } from "../../store/ui-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const hasHydrated = useHasHydrated();

  // Fetch current user if we have a token
  useCurrentUser();

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.push("/auth/signin");
    }
  }, [hasHydrated, accessToken, router]);

  // Don't render anything until hydration is complete
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no token, don't render dashboard
  if (!accessToken) {
    return null;
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-gray-100">
      <Sidebar />
      <main
        className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden transition-all duration-300 ${sidebarCollapsed ? "ml-0" : "ml-0"}`}
      >
        {children}
      </main>
    </div>
  );
}
