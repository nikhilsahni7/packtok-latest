"use client";

import {
  AuctionCountdown,
  BiddingHero,
  LiveBiddingSection,
  RegularBiddingSection,
} from "@/components/bidding";
import { usePublicAuctions } from "@/hooks/useAuctions";
import { Auction } from "@/types/auction";
import { Loading } from "@packtok/ui/components/loading";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

const asDate = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function BiddingPage() {
  const router = useRouter();
  const {
    data: auctions = [],
    isLoading,
    isError,
    refetch,
  } = usePublicAuctions();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load auctions");
    }
  }, [isError]);

  const liveAuctions = useMemo(
    () => auctions.filter((auction) => auction.status === "LIVE"),
    [auctions]
  );

  const upcomingAuctions = useMemo(
    () =>
      auctions.filter((auction) =>
        ["SCHEDULED", "DRAFT"].includes(auction.status)
      ),
    [auctions]
  );

  const handleSelectAuction = (auctionId: string) => {
    if (!auctionId) {
      toast.error("Unable to open auction");
      return;
    }
    router.push(`/bidding/${auctionId}`);
  };

  const pickNextAuction = (
    candidates: Auction[],
    extractor: (auction: Auction) => string
  ) => {
    if (candidates.length === 0) {
      return null;
    }
    const sorted = [...candidates].sort((a, b) => {
      const aDate = asDate(extractor(a));
      const bDate = asDate(extractor(b));
      const aTime = aDate ? aDate.getTime() : Number.POSITIVE_INFINITY;
      const bTime = bDate ? bDate.getTime() : Number.POSITIVE_INFINITY;
      return aTime - bTime;
    });
    return sorted[0] ?? null;
  };

  const nextAuction = useMemo(() => {
    const active = pickNextAuction(liveAuctions, (auction) => auction.endAt);
    if (active) {
      return active;
    }
    return pickNextAuction(upcomingAuctions, (auction) => auction.startAt);
  }, [liveAuctions, upcomingAuctions]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <BiddingHero />
        <div className="relative h-64">
          <Loading variant="jimu" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-white">
        <BiddingHero />
        <section className="container mx-auto px-4 lg:px-8 py-16">
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600">
              Something went wrong while loading auctions.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <BiddingHero />
      <AuctionCountdown nextAuction={nextAuction ?? null} />
      <div className="space-y-0">
        <LiveBiddingSection
          auctions={liveAuctions}
          onSelectAuction={handleSelectAuction}
        />
        <RegularBiddingSection
          auctions={upcomingAuctions}
          onSelectAuction={handleSelectAuction}
        />
      </div>
    </main>
  );
}
