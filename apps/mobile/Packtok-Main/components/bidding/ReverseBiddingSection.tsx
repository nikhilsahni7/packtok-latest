// components/bidding/ReverseBiddingSection.tsx
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

interface ReverseBiddingSectionProps {
  auctions: Auction[];
  onSelectAuction: (auctionId: string) => void;
}

export function ReverseBiddingSection({
  auctions,
  onSelectAuction,
}: ReverseBiddingSectionProps) {
  return (
    <View className="w-full pb-4">
      {auctions.length === 0 ? (
        <View className="mx-4 rounded-lg border border-dashed border-gray-200 p-6">
          <Text className="text-center text-sm text-gray-500">
            No reverse auctions available.
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
                statusLabel="Reverse"
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
