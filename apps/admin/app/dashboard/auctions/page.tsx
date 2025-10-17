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
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAdminAuctions, useFinalizeAuction } from "../../../hooks";
import { Auction, AuctionStatus } from "../../../types/auction";

const statusVariant: Record<AuctionStatus, string> = {
  DRAFT: "bg-gray-200 text-gray-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  LIVE: "bg-green-100 text-green-700",
  CLOSED: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
};

const formatCurrency = (amount: string, currency: string) => {
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) {
    return `${currency} ${amount}`;
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numeric);
};

export default function AuctionsPage() {
  const { data: auctions = [], isLoading, error } = useAdminAuctions();
  const finalizeAuction = useFinalizeAuction();

  const upcomingAuctions = useMemo(
    () =>
      auctions.filter((auction) =>
        ["DRAFT", "SCHEDULED"].includes(auction.status)
      ),
    [auctions]
  );

  const liveAuctions = useMemo(
    () => auctions.filter((auction) => auction.status === "LIVE"),
    [auctions]
  );

  const closedAuctions = useMemo(
    () => auctions.filter((auction) => auction.status === "CLOSED"),
    [auctions]
  );

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
    return <Loading variant="jimu" className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">Failed to load auctions.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderAuctionCard = (auction: Auction) => (
    <Card key={auction.id} className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">
            {auction.product?.title ?? "Untitled Product"}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {auction.product?.productType?.replaceAll("_", " ") ?? ""}
          </p>
        </div>
        <Badge className={statusVariant[auction.status]}>
          {" "}
          {auction.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Mode</span>
          <span className="font-medium">{auction.mode}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Starts</span>
          <span className="font-medium">{formatDate(auction.startAt)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Ends</span>
          <span className="font-medium">{formatDate(auction.endAt)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Starting Amount</span>
          <span className="font-medium">
            {formatCurrency(auction.startingAmount, auction.currency)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-4">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/auctions/${auction.id}`}>View details</Link>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleFinalize(auction)}
            disabled={finalizeAuction.isPending || auction.status !== "LIVE"}
          >
            {finalizeAuction.isPending ? "Finalizing..." : "Finalize"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSection = (title: string, items: Auction[]) => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">{items.length} auctions</span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
          No auctions in this stage.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(renderAuctionCard)}
        </div>
      )}
    </section>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auctions</h1>
          <p className="text-gray-600">
            Monitor live events and manage upcoming sales.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products">Create from product</Link>
        </Button>
      </div>

      {renderSection("Live auctions", liveAuctions)}
      {renderSection("Upcoming & draft", upcomingAuctions)}
      {renderSection("Closed", closedAuctions)}
    </div>
  );
}
