// components/bidding/RegularBiddingSection.tsx
import { Auction } from "@/types/auction";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { MachineCard } from "./MachineCard";

const formatCurrency = (value: string, currency: string) => {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numeric);
  }
  return `${currency} ${value}`;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
};

interface RegularBiddingSectionProps {
  auctions: Auction[];
  onSelectAuction: (auctionId: string) => void;
}

export function RegularBiddingSection({
  auctions,
  onSelectAuction,
}: RegularBiddingSectionProps) {
  return (
    <View className="w-full pb-4">
      {auctions.length === 0 ? (
        <View className="mx-4 rounded-lg border border-dashed border-gray-200 p-6 bg-white">
          <Text className="text-center text-sm text-gray-500">
            No upcoming auctions have been scheduled yet.
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {auctions.map((auction) => {
            const image =
              auction.product?.imagesThumbnail ??
              auction.product?.images?.[0] ??
              undefined;
            return (
              <MachineCard
                key={auction.id}
                machineName={auction.product?.title ?? "Untitled product"}
                startingPrice={formatCurrency(
                  auction.startingAmount,
                  auction.currency
                )}
                imageUrl={image}
                statusLabel={auction.mode === "REVERSE" ? "Reverse" : "Forward"}
                meta={
                  auction.status === "LIVE"
                    ? `Ends ${formatDateTime(auction.endAt)}`
                    : `Starts ${formatDateTime(auction.startAt)}`
                }
                ctaLabel="View details"
                onPress={() => onSelectAuction(auction.id)}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
