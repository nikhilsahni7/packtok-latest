"use client";

import Protected from "@/components/auth/protected";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@packtok/ui/components/button";
import { FileText, Heart, LogOut, MapPin, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/account", label: "Account", icon: User, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/quotes", label: "Quote Requests", icon: FileText },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <Protected>
      <div className="max-w-6xl mx-auto pb-20 pt-24 px-4">
        <h1 className="text-3xl font-bold mb-10 text-center">My Account</h1>
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="bg-gray-50 rounded-xl p-6 h-fit md:sticky md:top-24">
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-semibold text-white">
                {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <h2 className="font-semibold">{user?.name || "User"}</h2>
              <p className="text-sm text-gray-500 truncate max-w-full">{user?.email}</p>
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
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <hr className="my-4" />
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                asChild
              >
                <Link href="/auth/signout">
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </Link>
              </Button>
            </nav>
          </aside>

          {/* Content */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </Protected>
  );
}
