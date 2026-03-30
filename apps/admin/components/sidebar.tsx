"use client";

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navigation } from "../constants/navigation";
import { useAuthStore } from "../store/auth-store";
import { useUiStore } from "../store/ui-store";
import { Tooltip } from "./tooltip";

export function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };

  return (
    <div
      className={`h-full flex flex-col overflow-hidden bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center">
            <Image
              src="/navbar-logo.png"
              alt="Packtok Admin"
              width={100}
              height={32}
              className="object-contain"
            />
            <p className="ml-2 text-xs text-gray-500">Admin</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip
              key={item.name}
              content={item.name}
              disabled={!sidebarCollapsed}
            >
              <Link
                href={item.href}
                className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 "
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`${sidebarCollapsed ? "" : "mr-3"} h-5 w-5 ${
                      isActive ? "text-blue-700" : "text-gray-400"
                    }`}
                  />
                  {!sidebarCollapsed && item.name}
                </div>
                {item.badge && !sidebarCollapsed && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 px-4 py-1">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        )}

        <Tooltip content="Logout" disabled={!sidebarCollapsed}>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-1 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className={`${sidebarCollapsed ? "" : "mr-3"} h-4 w-4`} />
            {!sidebarCollapsed && "Logout"}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
