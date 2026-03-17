"use client";

import { useMyBidHistory } from "@/hooks/useAuctions";
import { BarChart3, Loader2, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BiddingHistoryPage() {
  const { data, isLoading } = useMyBidHistory();

  const stats = data?.stats;
  const items = data?.items || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Bidding History</h2>
        <p className="text-sm text-gray-500 mt-1">
          Your complete bidding stats and per-auction performance.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Auctions Bid</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {stats?.auctionsBid ?? 0}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Bids</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {stats?.totalBids ?? 0}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Won Auctions</p>
          <p className="text-xl font-bold text-green-700 mt-1">
            {stats?.totalWins ?? 0}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Bid Value</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {(stats?.totalBidAmount ?? 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            No bidding history yet
          </h3>
          <p className="text-gray-500 text-sm">
            Start bidding to see your stats here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Link
              key={item.auctionId}
              href={`/bidding/${item.auctionId}`}
              className="block bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {item.product.imagesThumbnail ? (
                    <Image
                      src={item.product.imagesThumbnail}
                      alt={item.product.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">
                      {item.product.title}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.won
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.won ? <Trophy className="h-3.5 w-3.5" /> : null}
                      {item.won ? "WON" : item.auctionStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                    <p>Bids: {item.bidCount}</p>
                    <p>
                      Latest Bid: {item.currency}{" "}
                      {Number(item.latestBidAmount).toLocaleString("en-IN")}
                    </p>
                    <p>
                      Total Bid Value: {item.currency}{" "}
                      {item.totalBidAmount.toLocaleString("en-IN")}
                    </p>
                    <p>
                      Final Closing:{" "}
                      {item.finalClosingAmount
                        ? `${item.currency} ${Number(item.finalClosingAmount).toLocaleString("en-IN")}`
                        : "-"}
                    </p>
                    <p>
                      Your Winning Amount:{" "}
                      {item.winningAmount
                        ? `${item.currency} ${Number(item.winningAmount).toLocaleString("en-IN")}`
                        : "-"}
                    </p>
                    <p>
                      Auction Closed:{" "}
                      {new Date(item.auctionEndAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
