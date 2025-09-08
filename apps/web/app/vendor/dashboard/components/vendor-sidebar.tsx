"use client";

import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/auth";
import {
  BarChart3,
  Boxes,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface VendorSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user: User | null;
}

type LinkItem = {
  type: "link";
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number | string;
};

type SectionItem = {
  type: "section";
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: LinkItem[];
  badge?: number | string;
};

type SidebarNode = LinkItem | SectionItem;

const sidebarStructure: SidebarNode[] = [
  {
    type: "link",
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    type: "section",
    name: "Product",
    icon: Package,
    badge: 6,
    children: [
      {
        type: "link",
        name: "Create New",
        href: "/vendor/products/new",
        icon: FileText,
      },
      {
        type: "link",
        name: "Analytics",
        href: "/vendor/products/analytics",
        icon: BarChart3,
      },
      {
        type: "link",
        name: "Drafts",
        href: "/vendor/products/drafts",
        icon: FileText,
        badge: 3,
      },
      {
        type: "link",
        name: "Released",
        href: "/vendor/products/released",
        icon: CheckCircle2,
      },
      {
        type: "link",
        name: "All Products",
        href: "/vendor/products",
        icon: Boxes,
      },
      {
        type: "link",
        name: "Scheduled",
        href: "/vendor/products/scheduled",
        icon: CalendarClock,
      },
    ],
  },
  { type: "link", name: "Revenue", href: "/vendor/revenue", icon: Wallet },
  { type: "link", name: "Settings", href: "/vendor/settings", icon: Settings },
];

export function VendorSidebar({
  collapsed,
  onToggle,
  user,
}: VendorSidebarProps) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({ Product: true });

  const handleLogout = async () => {
    await logout();
    router.push("/auth/vendor/signin");
  };

  const toggleSection = (name: string) =>
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <aside
      className={`fixed left-0 top-20 h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white border-r border-gray-200 pointer-events-auto ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo */}
        <div className="flex items-center h-16 px-2 sm:px-3 border-b border-gray-200 justify-between">
          {!collapsed && (
            <p className="text-sm font-semibold text-gray-800">Vendor</p>
          )}
          <div className="ml-auto">
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronsRight className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronsLeft className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarStructure.map((node) => {
            if (node.type === "link") {
              const Icon = node.icon;
              const isActive = pathname === node.href;
              return (
                <Link
                  key={node.name}
                  href={node.href}
                  className={`group relative flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-700 border-r-2 border-orange-600"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  {Icon && (
                    <Icon
                      className={`h-5 w-5 ${
                        collapsed ? "" : "mr-3"
                      } ${isActive ? "text-orange-600" : "text-gray-500"}`}
                    />
                  )}
                  {!collapsed && <span>{node.name}</span>}
                  {!collapsed && node.badge && (
                    <span className="ml-auto bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {node.badge}
                    </span>
                  )}

                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {node.name}
                    </div>
                  )}
                </Link>
              );
            }

            // section
            const SectionIcon = node.icon;
            const open = openSections[node.name] ?? true;
            const someChildActive = node.children.some((c) =>
              pathname.startsWith(c.href)
            );
            return (
              <div key={node.name} className="">
                <button
                  onClick={() => toggleSection(node.name)}
                  className={`group relative w-full flex items-center rounded-md px-2 py-2 text-sm font-semibold transition-colors ${
                    someChildActive
                      ? "bg-orange-50 text-orange-700 border-r-2 border-orange-600"
                      : "text-gray-800 hover:bg-gray-50"
                  } ${collapsed ? "justify-center" : ""}`}
                  aria-expanded={open}
                >
                  {SectionIcon && (
                    <SectionIcon
                      className={`h-5 w-5 ${collapsed ? "" : "mr-3"} ${
                        someChildActive ? "text-orange-600" : "text-gray-500"
                      }`}
                    />
                  )}
                  {!collapsed && <span>{node.name}</span>}
                  {!collapsed && node.badge && (
                    <span className="ml-2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {node.badge}
                    </span>
                  )}
                  {!collapsed && (
                    <span className="ml-auto text-gray-500">
                      {open ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}

                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {node.name}
                    </div>
                  )}
                </button>

                {/* children */}
                {!collapsed && open && (
                  <div className="mt-1 mb-2 ml-9 space-y-1">
                    {node.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`group flex items-center rounded-md px-2 py-1.5 text-sm transition-colors ${
                            isActive
                              ? "bg-orange-50 text-orange-700"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {ChildIcon && (
                            <ChildIcon
                              className={`h-4 w-4 mr-2 ${
                                isActive ? "text-orange-600" : "text-gray-400"
                              }`}
                            />
                          )}
                          <span>{child.name}</span>
                          {child.badge && (
                            <span className="ml-auto bg-orange-100 text-orange-800 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
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
    </aside>
  );
}
