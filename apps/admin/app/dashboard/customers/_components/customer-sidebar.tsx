"use client";

import { cn } from "@packtok/ui/lib/utils";
import {
    Bookmark,
    Calendar,
    Globe,
    Mail,
    MapPin,
    Package,
    Phone,
    ShoppingBag,
    Star,
} from "lucide-react";
import {
    BarChart,
    PieChart,
} from "recharts";

import { AdminUserDetail } from "../../../../hooks/useUsers";

interface CustomerSidebarProps {
  customer: AdminUserDetail | null;
  isLoading?: boolean;
}

export function CustomerSidebar({ customer, isLoading }: CustomerSidebarProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse space-y-4">
        <div className="h-16 w-16 bg-gray-100 rounded-full mx-auto" />
        <div className="h-4 w-32 bg-gray-100 mx-auto rounded" />
        <div className="space-y-2 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 w-full bg-gray-50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white p-10 rounded-lg shadow-sm text-center">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-6 h-6 text-slate-200" />
        </div>
        <p className="text-sm text-slate-400 font-medium tracking-tight">
          Select a customer to view details
        </p>
      </div>
    );
  }

  const primaryAddress = customer.addresses?.[0];

  return (
    <div className="space-y-6">
      {/* Selected Customer Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
            {customer.profile_image ? (
              <img
                src={customer.profile_image}
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-semibold text-lg">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            {customer.name}
          </h3>
          <p className="text-primary-600 text-xs font-black uppercase tracking-widest mt-1 opacity-80">
            {customer.role.replaceAll("_", " ")}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Contact Details
          </h4>

          <div className="flex items-center space-x-3 text-sm group">
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover:text-primary-500 transition-colors">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <span className="text-slate-600 font-medium">
              {customer.email}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-sm group">
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover:text-primary-500 transition-colors">
              <Phone className="h-3.5 w-3.5" />
            </div>
            <span className="text-slate-600 font-medium">
              {customer.phone_number || "No phone added"}
            </span>
          </div>

          {customer.country && (
            <div className="flex items-center space-x-3 text-sm group">
              <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover:text-primary-500 transition-colors">
                <Globe className="h-3.5 w-3.5" />
              </div>
              <span className="text-slate-600 font-medium">
                {customer.country}
              </span>
            </div>
          )}

          {primaryAddress && (
            <div className="flex items-start space-x-3 text-sm group">
              <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover:text-primary-500 transition-colors mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-600 font-medium">
                  {primaryAddress.line1}
                </span>
                <span className="text-xs text-slate-400">
                  {primaryAddress.city}, {primaryAddress.state}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="space-y-3 pt-4 mt-4 border-t border-slate-50">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Account Info
          </h4>
          <div className="flex items-center space-x-3 text-sm">
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-600 font-medium">
                Joined {new Date(customer.createdAt).toLocaleDateString()}
              </span>
              {customer.updatedAt && (
                <span className="text-xs text-slate-400">
                  Last updated{" "}
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">
          Engagement Overview
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Orders",
              count: customer._count.orders,
              icon: ShoppingBag,
              color: "text-emerald-500",
              bg: "bg-emerald-50",
            },
            {
              label: "Auctions",
              count: customer._count.auctionEnrollments,
              icon: PieChart,
              color: "text-amber-500",
              bg: "bg-amber-50",
            },
            {
              label: "Bookmarks",
              count: customer._count.bookmarks,
              icon: Bookmark,
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              label: "Reviews",
              count: customer._count.productReviews,
              icon: Star,
              color: "text-violet-500",
              bg: "bg-violet-50",
            },
            {
              label: "Services",
              count: customer._count.serviceRequests,
              icon: BarChart,
              color: "text-rose-500",
              bg: "bg-rose-50",
            },
            {
              label: "Products",
              count: customer._count.createdProducts,
              icon: Package,
              color: "text-teal-500",
              bg: "bg-teal-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={cn(
                "p-4 rounded-2xl border border-slate-50",
                stat.bg
              )}
            >
              <div
                className={cn(
                  "mb-2 p-1.5 w-fit rounded-lg bg-white shadow-sm",
                  stat.color
                )}
              >
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stat.count}
              </div>
              <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
