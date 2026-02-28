"use client";

import { useAuthStore, useHasHydrated } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { VendorMobileMenuButton, VendorSidebar } from "./dashboard/components/vendor-sidebar";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Give AuthBootstrap a short window to refresh the token after hydration
  const [bootstrapDone, setBootstrapDone] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // After hydration, wait briefly for AuthBootstrap to potentially refresh the
  // token (from the refresh cookie via the API). If the token is already
  // present from Zustand persistence we skip the wait entirely.
  useEffect(() => {
    if (!hasHydrated) return;
    if (accessToken) {
      setBootstrapDone(true);
      return;
    }
    // Wait up to 2 seconds for AuthBootstrap to finish refreshing
    const timer = setTimeout(() => setBootstrapDone(true), 2000);
    return () => clearTimeout(timer);
  }, [hasHydrated, accessToken]);

  // Redirect logic — only runs once bootstrap is done
  useEffect(() => {
    if (!bootstrapDone) return;
    if (!accessToken) {
      router.replace("/auth/vendor/signin");
      return;
    }
    // If user is loaded but is NOT a vendor, send them to the homepage
    if (user && user.role !== "VENDOR") {
      router.replace("/");
    }
  }, [bootstrapDone, accessToken, user, router]);

  // Don't render anything until hydration is complete
  if (!hasHydrated || !bootstrapDone) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // If no token after bootstrap, show spinner while redirect fires
  if (!accessToken) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <VendorSidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        user={user}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      {/* Main content: no margin on mobile, sidebar margin on desktop */}
      <main
        className={`min-h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {children}
      </main>

      {/* Floating menu button for mobile */}
      {!mobileOpen && (
        <VendorMobileMenuButton onClick={() => setMobileOpen(true)} />
      )}
    </div>
  );
}
