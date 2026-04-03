"use client";

import { useVendorProducts } from "@/hooks";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/auth";
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";

interface VendorSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user: User | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
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

function useSidebarStructure(): SidebarNode[] {
  const { data: products } = useVendorProducts();

  return useMemo(() => {
    const all = products ?? [];
    const totalCount = all.length;
    const draftCount = all.filter((p) => p.status === "DRAFT").length;

    return [
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
        badge: totalCount || undefined,
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
            badge: draftCount || undefined,
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
        ],
      },
      {
        type: "link",
        name: "Subscription",
        href: "/vendor/subscription",
        icon: CreditCard,
      },
    ];
  }, [products]);
}

export function VendorSidebar({
  collapsed,
  onToggle,
  user,
  mobileOpen,
  onMobileClose,
}: VendorSidebarProps) {
  const sidebarStructure = useSidebarStructure();
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

  const handleNavClick = () => {
    // Close mobile drawer on navigation
    if (mobileOpen) onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center h-16 px-3 border-b border-gray-200 justify-between">
        {(!collapsed || mobileOpen) && (
          <p className="text-sm font-semibold text-gray-800">Vendor</p>
        )}
        <div className="ml-auto flex items-center gap-1">
          {/* Desktop collapse toggle */}
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft
              className={`h-5 w-5 text-gray-600 transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarStructure.map((node) => {
          // For mobile drawer, always show expanded (not collapsed)
          const isCollapsedView = collapsed && !mobileOpen;

          if (node.type === "link") {
            const Icon = node.icon;
            const isActive = pathname === node.href;
            return (
              <Link
                key={node.name}
                href={node.href}
                onClick={handleNavClick}
                className={`group relative flex items-center rounded-md px-2 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-700 border-r-2 border-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                } ${isCollapsedView ? "justify-center" : ""}`}
              >
                {Icon && (
                  <Icon
                    className={`h-5 w-5 ${
                      isCollapsedView ? "" : "mr-3"
                    } ${isActive ? "text-orange-600" : "text-gray-500"}`}
                  />
                )}
                {!isCollapsedView && <span>{node.name}</span>}
                {!isCollapsedView && node.badge && (
                  <span className="ml-auto bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {node.badge}
                  </span>
                )}

                {isCollapsedView && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded hidden group-hover:block z-50 whitespace-nowrap pointer-events-none">
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
                className={`group relative w-full flex items-center rounded-md px-2 py-2.5 text-sm font-semibold transition-colors ${
                  someChildActive
                    ? "bg-orange-50 text-orange-700 border-r-2 border-orange-600"
                    : "text-gray-800 hover:bg-gray-50"
                } ${isCollapsedView ? "justify-center" : ""}`}
                aria-expanded={open}
              >
                {SectionIcon && (
                  <SectionIcon
                    className={`h-5 w-5 ${isCollapsedView ? "" : "mr-3"} ${
                      someChildActive ? "text-orange-600" : "text-gray-500"
                    }`}
                  />
                )}
                {!isCollapsedView && <span>{node.name}</span>}
                {!isCollapsedView && node.badge && (
                  <span className="ml-2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {node.badge}
                  </span>
                )}
                {!isCollapsedView && (
                  <span className="ml-auto text-gray-500">
                    {open ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                )}

                {isCollapsedView && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded hidden group-hover:block z-50 whitespace-nowrap pointer-events-none">
                    {node.name}
                  </div>
                )}
              </button>

              {/* children */}
              {!isCollapsedView && open && (
                <div className="mt-1 mb-2 ml-9 space-y-1">
                  {node.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={handleNavClick}
                        className={`group flex items-center rounded-md px-2 py-2 text-sm transition-colors ${
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
      <div className="p-4 border-t border-gray-200">
        {(!collapsed || mobileOpen) && user && (
          <div className="mb-3 px-3 py-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`relative flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors group ${
            collapsed && !mobileOpen ? "justify-center" : ""
          }`}
        >
          <LogOut
            className={`h-5 w-5 text-gray-500 ${collapsed && !mobileOpen ? "" : "mr-3"}`}
          />
          {(!collapsed || mobileOpen) && <span>Logout</span>}

          {/* Tooltip for collapsed state */}
          {collapsed && !mobileOpen && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded hidden group-hover:block z-50 whitespace-nowrap pointer-events-none">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar — fixed on desktop, slide-out drawer on mobile */}
      <aside
        className={`
          fixed top-20 h-[calc(100vh-5rem)] z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out

          /* Mobile: full-width drawer, off-screen by default */
          ${mobileOpen ? "left-0" : "-left-full"}
          w-[86vw] max-w-xs shadow-xl lg:shadow-none

          /* Desktop: always visible, respects collapsed state */
          lg:left-0
          lg:max-w-none
          ${collapsed ? "lg:w-16" : "lg:w-64"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

/** Mobile hamburger button for the vendor layout */
export function VendorMobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-4 z-30 lg:hidden w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-200 flex items-center justify-center transition-all active:scale-95"
      aria-label="Open navigation"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
