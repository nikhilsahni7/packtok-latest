"use client";

import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@packtok/ui/components/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@packtok/ui/components/table";
import { cn } from "@packtok/ui/lib/utils";
import {
    Activity,
    ArrowLeft,
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    Clock,
    Gavel,
    History as HistoryIcon,
    Package,
    RefreshCw,
    Search,
    TrendingUp,
    Trophy as TrophyIcon
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminAuction, useFinalizeAuction } from "../../../../hooks";
import { useAuctionRealtime } from "../../../../hooks/useAuctionRealtime";
import {
    AuctionLeaderboardSnapshot,
    AuctionStatus,
} from "../../../../types/auction";

const statusVariant: Record<AuctionStatus, { class: string; label: string; icon?: any }> = {
  DRAFT: { class: "bg-slate-100 text-slate-700", label: "Draft" },
  SCHEDULED: { class: "bg-blue-50 text-blue-700", label: "Scheduled", icon: Calendar },
  LIVE: { class: "bg-emerald-50 text-emerald-700 animate-pulse-subtle", label: "Live", icon: Activity },
  CLOSED: { class: "bg-slate-100 text-slate-600", label: "Closed", icon: CheckCircle2 },
  CANCELLED: { class: "bg-red-50 text-red-700", label: "Cancelled" },
};

const formatCurrency = (value: string, currency: string) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return `${currency} ${value}`;
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numeric);
};

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
};

export default function AuctionDetailPage() {
  const router = useRouter();
  const params = useParams<{ auctionId: string }>();
  const auctionId = params?.auctionId ?? "";

  const {
    data: auction,
    isLoading,
    isError,
    refetch,
  } = useAdminAuction(auctionId);
  const finalizeAuction = useFinalizeAuction();
  const [leaderboard, setLeaderboard] =
    useState<AuctionLeaderboardSnapshot | null>(null);

  useEffect(() => {
    if (auction?.leaderboard?.snapshot) {
      setLeaderboard(auction.leaderboard.snapshot);
    }
  }, [auction?.leaderboard?.snapshot]);

  useAuctionRealtime(auctionId, {
    onLeaderboard: (event) => {
      setLeaderboard(event.leaderboard ?? null);
    },
    onFinalized: () => {
      toast.success("Auction marked as closed");
      refetch();
    },
  });

  const bidders = useMemo(() => leaderboard?.bidders ?? [], [leaderboard]);

  const handleFinalize = async () => {
    if (!auctionId || !auction) {
      return;
    }
    if (auction.status !== "LIVE") {
      toast.error("Auction must be live before finalizing");
      return;
    }
    const confirmed = window.confirm(
      "Finalize this auction? This will close bidding and determine winners."
    );
    if (!confirmed) {
      return;
    }
    try {
      await finalizeAuction.mutateAsync(auctionId);
      toast.success("Auction finalized");
    } catch (error) {
      toast.error("Failed to finalize auction");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="mb-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-56 rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 rounded-full bg-gray-200" />
            <div className="h-9 w-20 rounded-md bg-gray-200" />
            <div className="h-9 w-24 rounded-md bg-gray-200" />
          </div>
        </div>
        {/* Cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 space-y-4">
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 w-28 rounded bg-gray-200" />
                    <div className="h-4 w-20 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Table skeleton */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-3 border-b">
                <div className="h-4 w-8 rounded bg-gray-200" />
                <div className="h-4 flex-1 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !auction) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Auction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">Failed to load auction.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusVariant[auction.status] || statusVariant.DRAFT;
  const StatusIcon = status.icon;
  const snapshot = leaderboard ?? auction.leaderboard?.snapshot ?? null;

  return (
    <div className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-600 hidden sm:block">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                {auction.product?.title ?? "Auction"}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 font-bold text-slate-400 text-xs uppercase tracking-widest">
                <Package className="w-3.5 h-3.5" />
                {auction.product?.productType?.replaceAll("_", " ") ?? "General"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white/50 p-2 rounded-xl backdrop-blur-sm border border-slate-100">
            <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-200 last:border-0">
               <TrendingUp className="w-4 h-4 text-slate-400" />
               <span className="text-sm font-bold text-slate-700">Mode: {auction.mode}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-200 last:border-0 text-slate-500">
               <Calendar className="w-4 h-4" />
               <span className="text-xs font-medium">{formatTimestamp(auction.startAt)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-slate-500">
               <Clock className="w-4 h-4" />
               <span className="text-xs font-medium">{formatTimestamp(auction.endAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("px-4 py-1.5 font-bold rounded-lg flex items-center gap-2", status.class)}>
            {StatusIcon && <StatusIcon className="w-3.5 h-3.5" />}
            {status.label}
          </Badge>
          <Button variant="outline" onClick={() => refetch()} className="bg-white hover:bg-slate-50 shadow-sm h-11 px-4 gap-2 font-bold text-slate-700">
            <RefreshCw className={cn("w-4 h-4", finalizeAuction.isPending && "animate-spin")} />
            Refresh
          </Button>
          <Button onClick={handleFinalize} disabled={finalizeAuction.isPending || auction.status !== "LIVE"} className="h-11 px-6 font-bold shadow-lg shadow-primary-200 gap-2">
            <Gavel className="w-4 h-4" />
            {finalizeAuction.isPending ? "Finalizing..." : "Finalize"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-primary-500" />
               <CardTitle className="text-base font-bold text-slate-800">Financials</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm">
            {[
              { label: "Starting amount", value: formatCurrency(auction.startingAmount, auction.currency), icon: ArrowUpRight },
              { label: "Earnest money", value: formatCurrency(auction.earnestAmount, auction.currency), icon: HistoryIcon },
              { label: "Min increment", value: auction.minBidIncrement ? formatCurrency(auction.minBidIncrement, auction.currency) : null, icon: TrendingUp },
              { label: "Min decrement", value: auction.minBidDecrement ? formatCurrency(auction.minBidDecrement, auction.currency) : null, icon: TrendingUp },
              { label: "Reserve price", value: auction.reservePrice ? formatCurrency(auction.reservePrice, auction.currency) : null, icon: TrophyIcon },
              { label: "Max winners", value: auction.maxWinners, icon: TrophyIcon },
            ].map((item, i) => {
              if (!item.value) return null;
              const Icon = item.icon;
              return (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Icon className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
                  {item.value}
                </span>
              </div>
            )})}
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center gap-2">
               <Package className="w-4 h-4 text-primary-500" />
               <CardTitle className="text-base font-bold text-slate-800">Product Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm">
            {[
              { label: "Category", value: auction.product?.productType?.replaceAll("_", " "), icon: Package },
              { label: "Status", value: auction.product?.status?.replaceAll("_", " "), icon: Activity },
              { label: "Inventory", value: auction.product?.quantity, icon: HistoryIcon },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Icon className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="font-bold text-slate-700 capitalize">
                  {item.value ?? "-"}
                </span>
              </div>
            )})}
            {auction.notes && (
              <div className="pt-2 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</span>
                <p className="mt-1.5 text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-xs italic">
                  "{auction.notes}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-50 bg-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                <HistoryIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Live Leaderboard</CardTitle>
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3" />
                  Last updated {snapshot?.updatedAt ? formatTimestamp(snapshot.updatedAt) : "-"}
                </p>
              </div>
            </div>
            {snapshot && (
              <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Current Amount</span>
                <span className="text-xl font-black text-emerald-700">
                  {snapshot.currentAmount}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {bidders.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                 <Search className="w-6 h-6 text-slate-200" />
              </div>
              <p className="text-sm font-medium text-slate-400">No bids recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-16 text-center font-bold text-slate-500 uppercase text-[10px] tracking-wider">Rank</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Bidder</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Amount</TableHead>
                    <TableHead className="w-24 text-center font-bold text-slate-500 uppercase text-[10px] tracking-wider">Sequence</TableHead>
                    <TableHead className="text-right font-bold text-slate-500 uppercase text-[10px] tracking-wider pr-6">Placed at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bidders.map((bid, index) => (
                    <TableRow key={bid.bidId} className="group transition-colors hover:bg-slate-50/50 border-slate-50">
                      <TableCell className="text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-black",
                          index === 0 ? "bg-amber-100 text-amber-700 shadow-sm shadow-amber-100" :
                          index === 1 ? "bg-slate-200 text-slate-700" :
                          index === 2 ? "bg-orange-50 text-orange-700" :
                          "bg-slate-50 text-slate-400"
                        )}>
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                            {bid.name ?? "Anonymous"}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {bid.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50">
                          {bid.amount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-400 text-xs">
                        #{bid.sequence}
                      </TableCell>
                      <TableCell className="text-right text-xs font-semibold text-slate-500 pr-6">
                        {formatTimestamp(bid.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {auction.result && (() => {
        // Parse winners data — it's stored as JSON in the DB
        const winners: Array<{
          rank: number;
          user: { id: string; name: string; email: string };
          bidId: string;
          amount: string;
          userId: string;
          sequence: number;
        }> = Array.isArray(auction.result.winners) ? auction.result.winners : [];

        return (
        <Card className="border-slate-100 shadow-sm overflow-hidden bg-slate-900 text-white mt-12">
          <CardHeader className="border-b border-white/5 bg-white/5 p-6">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <TrophyIcon className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-xl font-bold text-white">Auction Results</CardTitle>
                  <p className="text-sm text-slate-400 font-medium mt-1">
                    Auction finalized - Top {auction.maxWinners} winner(s) successfully selected
                  </p>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {winners.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p className="font-medium">No winner data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="hover:bg-transparent border-white/5">
                      <TableHead className="w-16 text-center font-bold text-slate-400 uppercase text-[10px] tracking-wider">Rank</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Winner</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Winning Bid</TableHead>
                      <TableHead className="w-24 text-center font-bold text-slate-400 uppercase text-[10px] tracking-wider">Bid #</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {winners.map((winner) => (
                      <TableRow key={winner.bidId || winner.rank} className="group hover:bg-white/5 border-white/5">
                        <TableCell className="text-center">
                          <span className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black",
                            winner.rank === 1 ? "bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/30" :
                            winner.rank === 2 ? "bg-slate-300/20 text-slate-300 ring-1 ring-slate-300/30" :
                            winner.rank === 3 ? "bg-orange-400/20 text-orange-400 ring-1 ring-orange-400/30" :
                            "bg-white/10 text-slate-400"
                          )}>
                            {winner.rank}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-white group-hover:text-primary-400 transition-colors">
                              {winner.user?.name || "Anonymous"}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              {winner.user?.email || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-black text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                            {formatCurrency(winner.amount, auction.currency)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-400 text-xs">
                          #{winner.sequence}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {auction.result.settledAt && (
              <div className="px-6 py-3 border-t border-white/5 text-xs text-slate-500 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Settled on {formatTimestamp(auction.result.settledAt)}
              </div>
            )}
          </CardContent>
        </Card>
        );
      })()}
    </div>
  );
}
