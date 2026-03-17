"use client";

import Protected from "@/components/auth/protected";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUnreadNotificationsCount } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@packtok/ui/components/button";
import {
  Bell,
  ClipboardList,
  FileText,
  Gavel,
  Heart,
  LogOut,
  MapPin,
  Package,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

const navItems = [
  { href: "/account", label: "Account", icon: User, exact: true },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/addresses", label: "Address", icon: MapPin },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  {
    href: "/account/form-tracking",
    label: "Form Tracking",
    icon: ClipboardList,
  },
  { href: "/account/quotes", label: "Quote Requests", icon: FileText },
  {
    href: "/account/sell-items-history",
    label: "Sell Old Items Status",
    icon: Truck,
  },
  { href: "/account/bidding-history", label: "Bidding History", icon: Gavel },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const logout = useAuthStore((s) => s.logout);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  const profileImage = (user?.profile_image as string) || null;

  return (
    <Protected>
      <div className="max-w-5xl mx-auto pb-20 pt-24 px-4">
        <h1 className="text-3xl font-bold mb-10 text-center">My Account</h1>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0 h-fit md:sticky md:top-24">
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-semibold text-white ring-4 ring-white shadow-lg">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (user?.name?.[0]?.toUpperCase() ??
                  user?.email?.[0]?.toUpperCase() ??
                  "U")
                )}
              </div>
              <h2 className="font-semibold text-gray-900">
                {user?.name || "User"}
              </h2>
              <p className="text-sm text-gray-500 truncate max-w-full">
                {user?.email}
              </p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href) && pathname !== "/account";
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive || (item.exact && pathname === item.href)
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                    </span>
                    {item.href === "/account/notifications" &&
                    unreadCount > 0 ? (
                      <span
                        className={`ml-2 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          isActive || (item.exact && pathname === item.href)
                            ? "bg-white text-orange-600"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
              <hr className="my-4" />
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </nav>
          </aside>

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <>
              <button
                type="button"
                aria-label="Close dialog"
                className="fixed inset-0 bg-black/50 z-50 cursor-default"
                onClick={() => setShowLogoutConfirm(false)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl pointer-events-auto">
                  <div className="flex items-center justify-between p-5 border-b">
                    <h3 className="font-semibold text-lg">Confirm Logout</h3>
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600">
                      Are you sure you want to log out?
                    </p>
                  </div>
                  <div className="flex gap-3 p-5 pt-0">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowLogoutConfirm(false)}
                    >
                      No, Stay
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleLogout}
                    >
                      Yes, Log Out
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </Protected>
  );
}
