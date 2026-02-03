"use client";

import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@packtok/ui/components/card";
import { cn } from "@packtok/ui/lib/utils";
import {
    Calendar,
    Clock,
    ExternalLink,
    Gavel,
    Package,
    Timer,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { Auction, AuctionStatus } from "../../../../types/auction";

interface AuctionCardProps {
  auction: Auction;
  onFinalize: (auction: Auction) => void;
  isFinalizing: boolean;
}

const statusVariant: Record<AuctionStatus, { class: string; label: string; icon?: React.ReactNode }> = {
  DRAFT: { class: "bg-slate-100 text-slate-700 border-slate-200", label: "Draft" },
  SCHEDULED: { class: "bg-blue-50 text-blue-700 border-blue-100", label: "Scheduled", icon: <Calendar className="w-3 h-3" /> },
  LIVE: { class: "bg-emerald-50 text-emerald-700 border-emerald-100 animate-pulse-subtle", label: "Live", icon: <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1" /> },
  CLOSED: { class: "bg-slate-100 text-slate-600 border-slate-200", label: "Closed" },
  CANCELLED: { class: "bg-red-50 text-red-700 border-red-100", label: "Cancelled" },
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: string, currency: string) => {
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return `${currency} ${amount}`;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numeric);
};

export function AuctionCard({ auction, onFinalize, isFinalizing }: AuctionCardProps) {
  const status = statusVariant[auction.status] || statusVariant.DRAFT;
  const isLive = auction.status === "LIVE";

  return (
    <Card className="group relative overflow-hidden border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
      {/* Dynamic Background Accent */}
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-1.5",
        isLive ? "bg-emerald-500" : "bg-slate-300"
      )} />

      <CardHeader className="pb-4 pt-6 px-6">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={cn("px-2.5 py-0.5 font-medium flex items-center gap-1.5", status.class)}>
            {status.icon}
            {status.label}
          </Badge>
          <div className="flex gap-2">
             <Link
              href={`/dashboard/auctions/${auction.id}`}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {auction.product?.title ?? "Untitled Product"}
          </CardTitle>
          <div className="flex items-center text-slate-500 text-sm">
            <Package className="w-3.5 h-3.5 mr-1.5" />
            {auction.product?.productType?.replaceAll("_", " ") ?? "General"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mode</span>
             <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                {auction.mode}
             </div>
          </div>
          <div className="space-y-1">
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Starting Price</span>
             <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                {formatCurrency(auction.startingAmount, auction.currency)}
             </div>
          </div>
        </div>

        <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-slate-500">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>Starts</span>
            </div>
            <span className="font-medium text-slate-700">{formatDate(auction.startAt)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-slate-500">
              <Timer className="w-3.5 h-3.5 mr-1.5" />
              <span>Ends</span>
            </div>
            <span className="font-medium text-slate-700">{formatDate(auction.endAt)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium h-10"
          >
            <Link href={`/dashboard/auctions/${auction.id}`}>
              View details
            </Link>
          </Button>
          <Button
            variant={isLive ? "default" : "secondary"}
            className={cn(
              "flex-1 font-semibold h-10 transition-all duration-300",
              isLive ? "bg-slate-900 border-none hover:bg-slate-800 shadow-lg shadow-slate-200" : ""
            )}
            onClick={() => onFinalize(auction)}
            disabled={isFinalizing || !isLive}
          >
            {isFinalizing ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4" />
                <span>{auction.status === 'CLOSED' ? 'Finalized' : 'Finalize'}</span>
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
