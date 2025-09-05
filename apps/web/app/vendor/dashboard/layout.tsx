"use client";

import { useAuthStore, useHasHydrated } from "@/store/auth-store";

import React, { useState } from "react";
import { VendorSidebar } from "./components/vendor-sidebar";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useHasHydrated();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleSidebarHidden = () => setSidebarHidden((v) => !v);

  // Don't render anything until hydration is complete
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // If not authenticated yet, show a loader while bootstrap/middleware establishes session
  if (!accessToken) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const sidebarWidth = sidebarHidden
    ? "ml-12"
    : sidebarCollapsed
      ? "ml-16"
      : "ml-64";

  return (
    <div className="bg-gray-100 pt-20">
      <VendorSidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        hidden={sidebarHidden}
        onHideToggle={toggleSidebarHidden}
        user={user}
      />
      <main
        className={`min-h-[calc(100vh-5rem)] overflow-y-auto pt-4 px-6 ${sidebarWidth}`}
      >
        {children}
      </main>
    </div>
  );
}
