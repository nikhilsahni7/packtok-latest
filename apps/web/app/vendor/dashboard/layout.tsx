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

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

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

  return (
    <div className="flex h-screen bg-gray-100">
      <VendorSidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        user={user}
      />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
