"use client";

import { DollarSign, FileText, Gift, Heart } from "lucide-react";

interface DashboardStatsProps {
  productsCount: number;
  inStockCount: number;
  ordersCount: number;
  quotesCount: number;
}

export function DashboardStats({
  productsCount,
  inStockCount,
  ordersCount,
  quotesCount,
}: DashboardStatsProps) {
  const stats = [
    {
      name: "Products",
      value: productsCount.toLocaleString(),
      icon: Heart,
      color: "bg-violet-100 text-violet-700",
      bgColor: "bg-violet-50",
      subtitle: "Total listed products",
    },
    {
      name: "In Stock",
      value: inStockCount.toLocaleString(),
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-700",
      bgColor: "bg-emerald-50",
      subtitle: "Available to purchase",
    },
    {
      name: "Orders",
      value: ordersCount.toLocaleString(),
      icon: Gift,
      color: "bg-rose-100 text-rose-700",
      bgColor: "bg-rose-50",
      subtitle: "Total customer orders",
    },
    {
      name: "Quote Requests",
      value: quotesCount.toLocaleString(),
      icon: FileText,
      color: "bg-sky-100 text-sky-700",
      bgColor: "bg-sky-50",
      subtitle: "Incoming lead forms",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className={`${stat.bgColor} p-5 rounded-2xl border border-white/70 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
