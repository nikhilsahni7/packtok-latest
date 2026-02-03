"use client";

import { Button } from "@packtok/ui/components/button";
import {
  Card,
  CardContent
} from "@packtok/ui/components/card";
import { cn } from "@packtok/ui/lib/utils";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Gavel,
  LayoutDashboard,
  Plus
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminAuctions, useFinalizeAuction } from "../../../hooks";
import { Auction } from "../../../types/auction";
import { AuctionCard } from "./components/auction-card";

type TabType = "LIVE" | "UPCOMING" | "CLOSED" | "OVERVIEW";

export default function AuctionsPage() {
  const { data: auctions = [], isLoading, error } = useAdminAuctions();
  const finalizeAuction = useFinalizeAuction();
  const [activeTab, setActiveTab] = useState<TabType>("LIVE");

  const counts = useMemo(() => ({
    LIVE: auctions.filter(a => a.status === "LIVE").length,
    UPCOMING: auctions.filter(a => ["DRAFT", "SCHEDULED"].includes(a.status)).length,
    CLOSED: auctions.filter(a => a.status === "CLOSED").length,
    TOTAL: auctions.length
  }), [auctions]);

  const filteredAuctions = useMemo(() => {
    switch (activeTab) {
      case "LIVE":
        return auctions.filter((a) => a.status === "LIVE");
      case "UPCOMING":
        return auctions.filter((a) => ["DRAFT", "SCHEDULED"].includes(a.status));
      case "CLOSED":
        return auctions.filter((a) => a.status === "CLOSED");
      default:
        return auctions;
    }
  }, [auctions, activeTab]);

  const handleFinalize = async (auction: Auction) => {
    if (auction.status !== "LIVE") {
      toast.error("Auction must be live before finalizing");
      return;
    }

    const confirmed = window.confirm(
      "Finalize this auction? This will lock bidding and determine winners."
    );
    if (!confirmed) {
      return;
    }

    try {
      await finalizeAuction.mutateAsync(auction.id);
      toast.success("Auction finalized");
    } catch (err) {
      toast.error("Failed to finalize auction");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-10 bg-slate-50/30 min-h-screen">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-10 w-48 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-4 w-72 rounded-md bg-slate-200 animate-pulse" />
          </div>
          <div className="h-11 w-44 rounded-xl bg-slate-200 animate-pulse" />
        </div>
        <div className="flex gap-4 border-b border-slate-200 pb-px">
          {[1, 2, 3, 4].map(i => (
             <div key={i} className="h-10 w-28 rounded-t-lg bg-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[320px] rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full border-red-100 bg-red-50/30">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
               <Activity className="text-red-600 w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Failed to load auctions</h3>
              <p className="text-sm text-slate-600">There was an error communicating with the server. Please check your connection and try again.</p>
            </div>
            <Button onClick={() => window.location.reload()} className="w-full">
               Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: "OVERVIEW", label: "Overview", icon: LayoutDashboard },
    { id: "LIVE", label: "Live", icon: Activity, count: counts.LIVE },
    { id: "UPCOMING", label: "Upcoming", icon: Calendar, count: counts.UPCOMING },
    { id: "CLOSED", label: "Closed", icon: CheckCircle2, count: counts.CLOSED },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <Image
                src="/navbar-logo.png"
                alt="Packtok Logo"
                width={140}
                height={40}
                className="object-contain"
                priority
              />
              <div className="h-8 w-px bg-slate-200 ml-6 mr-6" />
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-0.5">
                <h1 className="text-4xl font-black tracking-tight text-slate-900">Auctions</h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-0.5">Control Center</p>
              </div>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
            Real-time auction management hub. Monitor live events, schedule upcoming drops, and manage historical data.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <Button asChild className="shadow-2xl shadow-primary-200 h-12 px-8 font-black rounded-2xl gap-3 text-base hover:scale-105 active:scale-95 transition-all">
            <Link href="/dashboard/products">
              <Plus className="w-5 h-5" />
              Create Auction
            </Link>
          </Button>
        </div>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="relative border-b border-slate-200 pt-2">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold transition-all duration-300 relative whitespace-nowrap",
                  isActive
                    ? "text-primary-600"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-xl"
                )}
              >
                <Icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-primary-600" : "text-slate-400")} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={cn(
                    "ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-black",
                    isActive ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "OVERVIEW" ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Enhanced Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Auctions", value: counts.TOTAL, sub: "Historical total", icon: Gavel, color: "from-blue-500 to-indigo-600", accent: "bg-blue-500/10 text-blue-600" },
                { label: "Active Now", value: counts.LIVE, sub: "Currently bidding", icon: Activity, color: "from-emerald-400 to-teal-600", accent: "bg-emerald-500/10 text-emerald-600", pulse: true },
                { label: "Upcoming", value: counts.UPCOMING, sub: "Scheduled events", icon: Calendar, color: "from-amber-400 to-orange-600", accent: "bg-amber-500/10 text-amber-600" },
                { label: "Finalized", value: counts.CLOSED, sub: "Completed sales", icon: CheckCircle2, color: "from-slate-600 to-slate-800", accent: "bg-slate-500/10 text-slate-700" },
              ].map((stat, i) => (
                <Card key={i} className="group border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-white">
                  <CardContent className="p-0">
                    <div className={cn("h-1 w-full bg-gradient-to-r", stat.color)} />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
                        <div className={cn("p-2 rounded-xl transition-colors", stat.accent)}>
                          <stat.icon className={cn("w-5 h-5", stat.pulse && "animate-pulse-subtle")} />
                        </div>
                      </div>
                      <div className="flex items-end gap-2.5">
                        <span className="text-4xl font-black tracking-tight text-slate-900 leading-none">{stat.value}</span>
                        <span className="text-[11px] text-slate-500 mb-1 font-bold">{stat.sub}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in duration-500">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No auctions found</h3>
             <p className="text-slate-500 text-center max-w-sm mb-8">
               We couldn&apos;t find any {activeTab.toLowerCase()} auctions at the moment. Try creating a new one from your products.
             </p>
             <Button asChild variant="outline" className="rounded-xl px-8 border-slate-200">
               <Link href="/dashboard/products">Go to Products</Link>
             </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {filteredAuctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                onFinalize={handleFinalize}
                isFinalizing={finalizeAuction.isPending && finalizeAuction.variables === auction.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
