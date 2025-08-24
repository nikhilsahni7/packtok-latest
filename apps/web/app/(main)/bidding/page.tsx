"use client";

import {
  AuctionCountdown,
  BiddingHero,
  LiveBiddingSection,
  RegularBiddingSection,
} from "@/components/bidding";

export default function BiddingPage() {
  return (
    <main className="min-h-screen bg-white">
      <BiddingHero />
      <AuctionCountdown />
      <div className="space-y-0">
        <LiveBiddingSection />
        <RegularBiddingSection />
      </div>
    </main>
  );
}
