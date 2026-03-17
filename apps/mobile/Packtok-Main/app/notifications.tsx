import {
  AppNotificationItem,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const { data, isLoading, isRefetching } = useNotifications(activeTab);
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const notifications = data?.data || [];
  const unreadCount = data?.meta?.unreadCount || 0;

  const iconForType = (type: AppNotificationItem["type"]) => {
    switch (type) {
      case "PRODUCT_LIVE":
        return {
          name: "shopping-bag" as const,
          color: "#FF8C42",
          bg: "bg-orange-100",
        };
      case "PODCAST_LIVE":
        return {
          name: "play-circle" as const,
          color: "#3B82F6",
          bg: "bg-blue-100",
        };
      case "ARTICLE_PUBLISHED":
        return {
          name: "file-text" as const,
          color: "#2563EB",
          bg: "bg-blue-100",
        };
      case "AUCTION_PRODUCT_ADDED":
      case "AUCTION_LIVE":
        return { name: "zap" as const, color: "#EAB308", bg: "bg-yellow-100" };
      default:
        return { name: "bell" as const, color: "#6B7280", bg: "bg-gray-100" };
    }
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  const resolveNotificationRoute = (
    item: AppNotificationItem
  ): string | null => {
    const payload = (item.payload || {}) as Record<string, unknown>;

    if (item.type === "ARTICLE_PUBLISHED") {
      const articleId = payload.articleId as string | undefined;
      return articleId ? `/articles/${articleId}` : "/articles";
    }

    if (item.type === "PODCAST_LIVE") {
      const podcastId = payload.podcastId as string | undefined;
      return podcastId ? `/podcasts/${podcastId}` : "/podcasts";
    }

    if (item.type === "AUCTION_LIVE" || item.type === "AUCTION_PRODUCT_ADDED") {
      const auctionId = payload.auctionId as string | undefined;
      return auctionId ? `/bidding/${auctionId}` : "/bidding";
    }

    if (item.type === "PRODUCT_LIVE") {
      const productId = payload.productId as string | undefined;
      const productType = payload.productType as string | undefined;

      if (!productId) return "/marketplace";

      if (productType === "MACHINERY")
        return `/marketplace/machinery/${productId}`;
      if (productType === "SPARE_PARTS")
        return `/marketplace/spare-parts/${productId}`;
      if (productType === "CONSUMABLES")
        return `/marketplace/consumables/${productId}`;
      if (productType === "RAW_MATERIALS")
        return `/marketplace/raw-material/${productId}`;

      return "/marketplace";
    }

    if (item.actionUrl) {
      if (item.actionUrl.includes("auctionId=")) {
        const auctionId = item.actionUrl.split("auctionId=")[1]?.split("&")[0];
        if (auctionId) return `/bidding/${auctionId}`;
      }
      if (item.actionUrl.startsWith("/bidding")) return "/bidding";
      if (item.actionUrl.startsWith("/podcasts")) return "/podcasts";
      if (item.actionUrl.startsWith("/articles")) return "/articles";
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Notifications</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            className="px-3 py-2 rounded-lg bg-gray-100 mr-2"
            onPress={() => markAllRead()}
            disabled={isMarkingAll || unreadCount === 0}
            activeOpacity={0.7}
          >
            <Text className="text-xs font-semibold text-gray-700">
              Mark all read
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            onPress={() => router.push("/(tabs)/settings")}
          >
            <Feather name="settings" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View className="px-5 py-4 flex-row gap-2 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "all" ? "bg-[#FF8C42]" : "bg-gray-100"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "all" ? "text-white" : "text-gray-600"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("unread")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "unread" ? "bg-[#FF8C42]" : "bg-gray-100"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "unread" ? "text-white" : "text-gray-600"
            }`}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center px-5 py-20">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-500 mt-4">Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center px-5 py-20">
            <View className="w-24 h-24 rounded-full bg-blue-50 items-center justify-center mb-6">
              <Feather name="bell" size={48} color="#3B82F6" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-3">
              No Notifications
            </Text>
            <Text className="text-base text-gray-500 text-center mb-8 leading-6">
              {activeTab === "all"
                ? "You're all caught up!\nWe'll notify you when there's something new."
                : "You have no unread notifications.\nCheck back later for updates."}
            </Text>
          </View>
        ) : (
          <View className="px-5 py-4">
            {isRefetching ? (
              <Text className="text-xs text-gray-500 mb-3">Refreshing...</Text>
            ) : null}

            {notifications.map((item) => {
              const icon = iconForType(item.type);
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    if (!item.read) {
                      markRead(item.id);
                    }

                    const targetRoute = resolveNotificationRoute(item);
                    if (targetRoute) {
                      router.push(targetRoute as any);
                    }
                  }}
                  className={`rounded-2xl p-4 mb-3 border ${item.read ? "bg-white border-gray-200" : "bg-orange-50 border-orange-200"}`}
                  activeOpacity={0.75}
                >
                  <View className="flex-row items-start">
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${icon.bg}`}
                    >
                      <Feather name={icon.name} size={18} color={icon.color} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-semibold text-gray-900 flex-1 mr-2">
                          {item.title}
                        </Text>
                        {!item.read ? (
                          <View className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        ) : null}
                      </View>
                      <Text className="text-sm text-gray-600 mt-1">
                        {item.message}
                      </Text>
                      <Text className="text-xs text-gray-400 mt-2">
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
