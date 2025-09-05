"use client";

import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/auth";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface VendorSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user: User | null;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/vendor/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart,
  },
  {
    name: "Analytics",
    href: "/vendor/analytics",
    icon: BarChart3,
  },
  {
    name: "Customers",
    href: "/vendor/customers",
    icon: Users,
  },
  {
    name: "Reports",
    href: "/vendor/reports",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/vendor/settings",
    icon: Settings,
  },
];

export function VendorSidebar({
  collapsed,
  onToggle,
  user,
}: VendorSidebarProps) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/vendor/signin");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <Image
              src="/navbar-logo.png"
              alt="Packtok Vendor"
              width={100}
              height={32}
              className="object-contain"
            />
            <p className="ml-2 text-xs text-orange-600 font-medium">Vendor</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative group ${
                isActive
                  ? "bg-orange-50 text-orange-700 border-r-2 border-orange-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-3"} ${
                  isActive ? "text-orange-600" : "text-gray-500"
                }`}
              />
              {!collapsed && (
                <>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && user && (
          <div className="mb-3 px-3 py-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors group ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut
            className={`h-5 w-5 text-gray-500 ${collapsed ? "" : "mr-3"}`}
          />
          {!collapsed && <span>Logout</span>}

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
