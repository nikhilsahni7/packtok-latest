"use client";

import { Card } from "@packtok/ui/components/card";
import {
    CheckCircle,
    Clock,
    DollarSign,
    Package,
    RefreshCw,
    Truck,
    XCircle,
} from "lucide-react";
import { OrderStats } from "../../../../types/order";

interface OrdersStatsProps {
  stats: OrderStats;
}

export function OrdersStats({ stats }: OrdersStatsProps) {
  const statCards = [
    {
      label: "Total Orders",
      value: stats.total,
      icon: Package,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Pending Payment",
      value: stats.byStatus.pending,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Paid",
      value: stats.byStatus.paid,
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Processing",
      value: stats.byStatus.processing,
      icon: RefreshCw,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Shipped",
      value: stats.byStatus.shipped,
      icon: Truck,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      label: "Delivered",
      value: stats.byStatus.delivered,
      icon: CheckCircle,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Cancelled",
      value: stats.byStatus.cancelled,
      icon: XCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className={`p-4 ${stat.bgColor} border-none`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Card */}
      <Card className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 border-none">
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-sm opacity-80">Total Revenue (Delivered)</p>
            <p className="text-3xl font-bold">₹{parseFloat(stats.revenue).toLocaleString()}</p>
          </div>
          <DollarSign className="h-12 w-12 opacity-20" />
        </div>
      </Card>
    </div>
  );
}
