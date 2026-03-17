import { useMyBidHistory } from "@/hooks/useAuctions";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BiddingHistoryScreen() {
  const router = useRouter();
  const { data, isLoading, refetch } = useMyBidHistory();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const items = data?.items ?? [];
  const stats = data?.stats;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Bidding History</Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View className="items-center justify-center py-16">
            <ActivityIndicator size="large" color="#FF8C42" />
          </View>
        ) : (
          <>
            <View className="px-5 py-4">
              <View className="flex-row flex-wrap">
                <View className="w-1/2 pr-2 pb-3">
                  <View className="bg-gray-50 rounded-xl p-3">
                    <Text className="text-xs text-gray-500">Auctions Bid</Text>
                    <Text className="text-lg font-bold text-gray-900 mt-1">
                      {stats?.auctionsBid ?? 0}
                    </Text>
                  </View>
                </View>
                <View className="w-1/2 pl-2 pb-3">
                  <View className="bg-gray-50 rounded-xl p-3">
                    <Text className="text-xs text-gray-500">Total Bids</Text>
                    <Text className="text-lg font-bold text-gray-900 mt-1">
                      {stats?.totalBids ?? 0}
                    </Text>
                  </View>
                </View>
                <View className="w-1/2 pr-2 pb-3">
                  <View className="bg-gray-50 rounded-xl p-3">
                    <Text className="text-xs text-gray-500">Won Auctions</Text>
                    <Text className="text-lg font-bold text-green-700 mt-1">
                      {stats?.totalWins ?? 0}
                    </Text>
                  </View>
                </View>
                <View className="w-1/2 pl-2 pb-3">
                  <View className="bg-gray-50 rounded-xl p-3">
                    <Text className="text-xs text-gray-500">
                      Total Bid Value
                    </Text>
                    <Text className="text-lg font-bold text-gray-900 mt-1">
                      {(stats?.totalBidAmount ?? 0).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="px-5 pb-6">
              {items.length === 0 ? (
                <View className="items-center py-16">
                  <Feather name="bar-chart-2" size={56} color="#D1D5DB" />
                  <Text className="text-gray-500 mt-4">
                    No bidding history yet
                  </Text>
                </View>
              ) : (
                items.map((item) => (
                  <TouchableOpacity
                    key={item.auctionId}
                    onPress={() =>
                      router.push(`/bidding/${item.auctionId}` as any)
                    }
                    className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-start mb-3">
                      {item.product.imagesThumbnail ? (
                        <Image
                          source={{ uri: item.product.imagesThumbnail }}
                          className="w-16 h-16 rounded-lg mr-3"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-16 h-16 rounded-lg bg-gray-100 items-center justify-center mr-3">
                          <Feather name="package" size={22} color="#9CA3AF" />
                        </View>
                      )}
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text
                            className="text-base font-semibold text-gray-900 flex-1 mr-2"
                            numberOfLines={1}
                          >
                            {item.product.title}
                          </Text>
                          <View
                            className={`px-2 py-1 rounded-full ${item.won ? "bg-green-100" : "bg-gray-100"}`}
                          >
                            <Text
                              className={`text-[10px] font-semibold ${item.won ? "text-green-700" : "text-gray-600"}`}
                            >
                              {item.won ? "WON" : item.auctionStatus}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-xs text-gray-500">
                          Bids: {item.bidCount}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Your latest bid: {item.currency}{" "}
                          {Number(item.latestBidAmount).toLocaleString()}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Auction closed:{" "}
                          {new Date(item.auctionEndAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-gray-50 rounded-lg p-3">
                      <Text className="text-xs text-gray-500">
                        Total bid value: {item.currency}{" "}
                        {item.totalBidAmount.toLocaleString()}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        Final closing:{" "}
                        {item.finalClosingAmount
                          ? `${item.currency} ${Number(item.finalClosingAmount).toLocaleString()}`
                          : "-"}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        Your winning amount:{" "}
                        {item.winningAmount
                          ? `${item.currency} ${Number(item.winningAmount).toLocaleString()}`
                          : "-"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
