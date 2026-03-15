import {
  CountdownTimer,
  LiveBiddingSection,
  RegularBiddingSection,
  ReverseBiddingSection,
} from "@/components/bidding";
import PageHeader from "@/components/PageHeader";
import { usePublicAuctions } from "@/hooks/useAuctions";
import { Auction } from "@/types/auction";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const asDate = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function BiddingScreen() {
  const router = useRouter();
  const {
    data: auctions = [],
    isLoading,
    isError,
    refetch,
  } = usePublicAuctions();

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

  const reverseAuctions = useMemo(
    () =>
      auctions.filter(
        (auction) =>
          auction.mode === "REVERSE" &&
          ["SCHEDULED", "DRAFT", "LIVE"].includes(auction.status)
      ),
    [auctions]
  );

  const handleSelectAuction = (auctionId: string) => {
    if (!auctionId) {
      return;
    }
    router.push(`/bidding/${auctionId}` as any);
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50 relative" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Unified Header with bubbles, dynamic cart, notifications */}
      <PageHeader showSearch={false} />

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
            Failed to Load Auctions
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
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Countdown Timer */}
          <CountdownTimer nextAuction={nextAuction} />

          {/* Live Bidding Header */}
          <View className="px-4 flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-[18px] font-semibold text-gray-900">
                Live Bidding
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/bidding/list?type=live" as any)}>
              <Text className="text-sm font-medium text-gray-600">
                View all <Text className="text-lg">›</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Live Bidding Section */}
          <LiveBiddingSection
            auctions={liveAuctions}
            onSelectAuction={handleSelectAuction}
          />

          {/* Regular Bidding Header */}
          <View className="px-4 flex-row items-center justify-between mb-4 mt-6">
            <Text className="text-[18px] font-semibold text-gray-900">
              Regular Bidding
            </Text>
            <TouchableOpacity onPress={() => router.push("/bidding/list?type=regular" as any)}>
              <Text className="text-sm font-medium text-gray-600">
                View all <Text className="text-lg">›</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Regular Bidding Section */}
          <RegularBiddingSection
            auctions={upcomingAuctions}
            onSelectAuction={handleSelectAuction}
          />

          {/* Reverse Bidding Header */}
          <View className="px-4 flex-row items-center justify-between mb-4 mt-6">
            <Text className="text-[18px] font-semibold text-gray-900">
              Reverse Bidding
            </Text>
            <TouchableOpacity onPress={() => router.push("/bidding/list?type=reverse" as any)}>
              <Text className="text-sm font-medium text-gray-600">
                View all <Text className="text-lg">›</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reverse Bidding Section */}
          <ReverseBiddingSection
            auctions={reverseAuctions}
            onSelectAuction={handleSelectAuction}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
