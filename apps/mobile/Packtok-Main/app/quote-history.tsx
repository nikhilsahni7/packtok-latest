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
import {
  QuoteRequest,
  QuoteStatus,
  useMyQuoteRequests,
} from "../hooks/useQuoteRequests";
import { useQuoteSocket } from "../hooks/useQuoteSocket";
import { useAuthStore } from "../store/auth-store";

export default function QuoteHistoryScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: quotes, isLoading, refetch } = useMyQuoteRequests();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending"
  );

  // Connect to socket for real-time updates
  useQuoteSocket(user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusBadgeStyle = (status: QuoteStatus) => {
    const statusStyles: Record<
      QuoteStatus,
      { bg: string; text: string; label: string }
    > = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "PENDING",
      },
      REVIEWED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "REVIEWED",
      },
      COMPLETED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "COMPLETED",
      },
      CANCELLED: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "CANCELLED",
      },
    };
    return statusStyles[status] || statusStyles.PENDING;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredQuotes = quotes?.filter((quote) => {
    if (activeTab === "pending") {
      return quote.status === "PENDING" || quote.status === "REVIEWED";
    } else {
      return quote.status === "COMPLETED" || quote.status === "CANCELLED";
    }
  });

  const renderQuoteCard = (quote: QuoteRequest) => {
    const statusStyle = getStatusBadgeStyle(quote.status);
    const productImage = quote.product?.images?.[0];

    return (
      <TouchableOpacity
        key={quote.id}
        onPress={() => router.push(`/quote-detail?id=${quote.id}`)}
        className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm"
        activeOpacity={0.7}
      >
        <View className="flex-row items-start mb-3">
          {/* Product Image */}
          {productImage ? (
            <Image
              source={{ uri: productImage }}
              className="w-16 h-16 rounded-lg mr-3"
              resizeMode="cover"
            />
          ) : (
            <View className="w-16 h-16 rounded-lg bg-gray-100 items-center justify-center mr-3">
              <Feather name="package" size={24} color="#9CA3AF" />
            </View>
          )}

          {/* Quote Info */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className="text-base font-semibold text-gray-900 flex-1"
                numberOfLines={1}
              >
                {quote.product?.title || "Product"}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <View className={`${statusStyle.bg} px-3 py-1 rounded-full`}>
                <Text className={`text-xs font-medium ${statusStyle.text}`}>
                  {statusStyle.label}
                </Text>
              </View>
            </View>

            <Text className="text-sm text-gray-600 mb-1">
              Company: {quote.companyName}
            </Text>
            <Text className="text-xs text-gray-500">
              Requested: {formatDate(quote.createdAt)}
            </Text>
          </View>
        </View>

        {/* Message Preview */}
        <View className="bg-gray-50 rounded-lg p-3 mb-2">
          <Text className="text-xs text-gray-500 mb-1">Message:</Text>
          <Text className="text-sm text-gray-700" numberOfLines={2}>
            {quote.message}
          </Text>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
          <Text className="text-xs text-gray-500">
            ID: {quote.id.slice(0, 8)}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-xs text-[#FF8C42] font-medium mr-1">
              View Details
            </Text>
            <Feather name="chevron-right" size={14} color="#FF8C42" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center">
          <Text className="text-xl font-bold text-gray-900 mr-3">
            Quote Requests
          </Text>
          {user?.profile_image ? (
            <Image
              source={{ uri: user.profile_image }}
              className="w-10 h-10 rounded-full ml-auto"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 items-center justify-center ml-auto">
              <Text className="text-white font-bold text-base">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View className="px-5 py-4 flex-row gap-2">
        <TouchableOpacity
          onPress={() => setActiveTab("pending")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "pending" ? "bg-[#FF8C42]" : "bg-gray-100"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "pending" ? "text-white" : "text-gray-600"
            }`}
          >
            PENDING
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("completed")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "completed" ? "bg-[#FF8C42]" : "bg-gray-100"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "completed" ? "text-white" : "text-gray-600"
            }`}
          >
            COMPLETED
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#FF8C42" />
            <Text className="text-gray-500 mt-4">
              Loading quote requests...
            </Text>
          </View>
        ) : filteredQuotes && filteredQuotes.length > 0 ? (
          <View className="pb-6">
            {filteredQuotes.map((quote) => renderQuoteCard(quote))}
          </View>
        ) : (
          <View className="items-center justify-center py-12">
            <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
              <Feather name="file-text" size={32} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              No Quote Requests
            </Text>
            <Text className="text-sm text-gray-500 text-center px-8">
              {activeTab === "pending"
                ? "You don't have any pending quote requests"
                : "You don't have any completed quote requests"}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
