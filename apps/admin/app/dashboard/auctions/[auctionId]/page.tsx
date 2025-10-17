"use client";

import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packtok/ui/components/card";
import { Loading } from "@packtok/ui/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packtok/ui/components/table";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminAuction, useFinalizeAuction } from "../../../../hooks";
import { useAuctionRealtime } from "../../../../hooks/useAuctionRealtime";
import {
  AuctionLeaderboardSnapshot,
  AuctionStatus,
} from "../../../../types/auction";

const statusVariant: Record<AuctionStatus, string> = {
  DRAFT: "bg-gray-200 text-gray-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  LIVE: "bg-green-100 text-green-700",
  CLOSED: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-red-100 text-red-700",
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
    return <Loading variant="jimu" className="min-h-screen" />;
  }

  if (isError || !auction) {
    return (
      <div className="p-6">
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

  const statusBadge = statusVariant[auction.status];
  const snapshot = leaderboard ?? auction.leaderboard?.snapshot ?? null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {auction.product?.title ?? "Auction"}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>Mode: {auction.mode}</span>
            <span>•</span>
            <span>Starts {formatTimestamp(auction.startAt)}</span>
            <span>•</span>
            <span>Ends {formatTimestamp(auction.endAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={statusBadge}>{auction.status}</Badge>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={finalizeAuction.isPending}
          >
            Refresh
          </Button>
          <Button
            onClick={handleFinalize}
            disabled={finalizeAuction.isPending || auction.status !== "LIVE"}
          >
            {finalizeAuction.isPending ? "Finalizing..." : "Finalize"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Starting amount</span>
              <span className="font-medium">
                {formatCurrency(auction.startingAmount, auction.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Earnest money</span>
              <span className="font-medium">
                {formatCurrency(auction.earnestAmount, auction.currency)}
              </span>
            </div>
            {auction.minBidIncrement && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Min increment</span>
                <span className="font-medium">
                  {formatCurrency(auction.minBidIncrement, auction.currency)}
                </span>
              </div>
            )}
            {auction.minBidDecrement && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Min decrement</span>
                <span className="font-medium">
                  {formatCurrency(auction.minBidDecrement, auction.currency)}
                </span>
              </div>
            )}
            {auction.reservePrice && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Reserve price</span>
                <span className="font-medium">
                  {formatCurrency(auction.reservePrice, auction.currency)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Max winners</span>
              <span className="font-medium">{auction.maxWinners}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">
                {auction.product?.productType?.replaceAll("_", " ") ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-medium">
                {auction.product?.status?.replaceAll("_", " ") ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Inventory</span>
              <span className="font-medium">
                {auction.product?.quantity ?? "-"}
              </span>
            </div>
            {auction.notes && (
              <div>
                <span className="text-gray-600">Notes</span>
                <p className="mt-1 text-gray-700">{auction.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Leaderboard</CardTitle>
            <p className="text-sm text-gray-500">
              Last updated{" "}
              {snapshot?.updatedAt ? formatTimestamp(snapshot.updatedAt) : "-"}
            </p>
          </div>
          {snapshot && (
            <div className="text-sm text-gray-600">
              Current amount:{" "}
              <span className="font-semibold">{snapshot.currentAmount}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {bidders.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No bids recorded yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Bidder</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Placed at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bidders.map((bid, index) => (
                  <TableRow key={bid.bidId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {bid.name ?? "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {bid.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{bid.amount}</TableCell>
                    <TableCell>{bid.sequence}</TableCell>
                    <TableCell>{formatTimestamp(bid.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {auction.result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md bg-gray-900 p-4 text-xs text-gray-100 overflow-auto">
              {JSON.stringify(auction.result.winners, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
