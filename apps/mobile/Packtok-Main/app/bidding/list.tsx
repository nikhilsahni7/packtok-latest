import { MachineCard } from "@/components/bidding";
import PageHeader from "@/components/PageHeader";
import { usePublicAuctions } from "@/hooks/useAuctions";
import { Auction } from "@/types/auction";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function BiddingListScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: string }>();

  const {
    data: auctions = [],
    isLoading,
    isError,
    refetch,
  } = usePublicAuctions();

  const filteredAuctions = useMemo(() => {
    switch (type) {
      case "live":
        return auctions.filter((a) => a.status === "LIVE");
      case "regular":
        return auctions.filter((a) => ["SCHEDULED"].includes(a.status));
      case "reverse":
        return auctions.filter(
          (a) =>
            a.mode === "REVERSE" && ["SCHEDULED", "LIVE"].includes(a.status),
        );
      default:
        return auctions;
    }
  }, [auctions, type]);

  const pageTitle = useMemo(() => {
    switch (type) {
      case "live":
        return "Live Bidding";
      case "regular":
        return "Regular Bidding";
      case "reverse":
        return "Reverse Bidding";
      default:
        return "All Auctions";
    }
  }, [type]);

  const handleSelectAuction = (auctionId: string) => {
    router.push(`/bidding/${auctionId}` as any);
  };

  const renderItem = ({ item: auction }: { item: Auction }) => {
    const image =
      auction.product?.imagesThumbnail ??
      auction.product?.images?.[0] ??
      undefined;

    const amount =
      type === "live"
        ? (auction.leaderboard?.snapshot?.currentAmount ??
          auction.startingAmount)
        : auction.startingAmount;

    const priceLabel = type === "live" ? "Current amount" : "Starting price";
    let statusLabel =
      auction.status === "LIVE"
        ? "Live"
        : auction.mode === "REVERSE"
          ? "Reverse"
          : "Forward";

    // Reverse auctions get specific label override
    if (type === "reverse" || auction.mode === "REVERSE") {
      statusLabel = "Reverse";
    }

    // Live label gets priority if looking at "Live" list specifically
    if (type === "live") {
      statusLabel = "Live";
    }

    const meta =
      auction.status === "LIVE"
        ? `Ends ${formatDateTime(auction.endAt)}`
        : `Starts ${formatDateTime(auction.startAt)}`;

    return (
      <View className="mb-6 px-4">
        <MachineCard
          machineName={auction.product?.title ?? "Untitled product"}
          startingPrice={formatCurrency(amount, auction.currency)}
          priceLabel={priceLabel}
          imageUrl={image}
          statusLabel={statusLabel}
          meta={meta}
          ctaLabel={
            auction.status === "LIVE" ? "Enter auction" : "View details"
          }
          onPress={() => handleSelectAuction(auction.id)}
          style={{ width: "100%", marginRight: 0 }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Search omitted for clarity, but header displays unified Bubble styling */}
      <PageHeader showSearch={false} />

      {/* Title area */}
      <View className="px-5 py-2 z-10 w-full mb-2">
        <Text className="text-[22px] font-bold text-gray-900">{pageTitle}</Text>
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="text-gray-500 mt-4">Loading auctions...</Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Feather name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">
            Failed to Load
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            Unable to fetch auction data. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-black px-8 py-3 rounded-lg"
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredAuctions.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Feather name="package" size={32} color="#9CA3AF" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            No Auctions Found
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            There are currently no auctions available in this category.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAuctions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          className="flex-1 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
}
