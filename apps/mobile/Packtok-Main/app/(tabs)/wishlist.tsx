import {
  useActivitySummary,
  useBookmarks,
  useRecentlyViewed,
  useRemoveBookmark,
  useSearchHistory,
} from "@/hooks/useUserTracking";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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

type TabType = "bookmarks" | "recent" | "searches";

export default function WishlistScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("bookmarks");

  const { data: activityData } = useActivitySummary();
  const { data: bookmarksData, isLoading: bookmarksLoading } = useBookmarks();
  const { data: recentViewsData, isLoading: recentLoading } = useRecentlyViewed(
    1,
    20,
    true
  );
  const { data: searchHistoryData, isLoading: searchesLoading } =
    useSearchHistory(1, 20, true);

  const removeBookmark = useRemoveBookmark();

  const handleRemoveBookmark = (productId: string) => {
    removeBookmark.mutate(productId);
  };

  const renderStars = (rating: number = 5) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialIcons
            key={star}
            name="star"
            size={12}
            color={star <= rating ? "#000" : "#D1D5DB"}
          />
        ))}
      </View>
    );
  };

  const renderBookmarks = () => {
    if (bookmarksLoading) {
      return (
        <View className="py-20 items-center justify-center">
          <ActivityIndicator size="large" color="#FF8C42" />
        </View>
      );
    }

    const bookmarks = bookmarksData?.bookmarks || [];

    if (bookmarks.length === 0) {
      return (
        <View className="py-20 items-center justify-center">
          <Feather name="bookmark" size={48} color="#9CA3AF" />
          <Text className="text-gray-900 font-semibold mt-4 text-lg">
            No bookmarks yet
          </Text>
          <Text className="text-gray-500 mt-2 text-center px-8">
            Start bookmarking products you like
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-row flex-wrap justify-between px-3 pt-4">
        {bookmarks.map((bookmark: any) => (
          <TouchableOpacity
            key={bookmark.id}
            className="rounded-2xl overflow-hidden mb-4 relative"
            style={{
              width: (width - 32) / 2 - 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                `/marketplace/machinery/${bookmark.product.id}` as any
              )
            }
          >
            {/* Remove Bookmark Button */}
            <TouchableOpacity
              className="absolute top-2 right-2 z-10 bg-white rounded-[15px] p-1.5"
              onPress={(e) => {
                e.stopPropagation();
                handleRemoveBookmark(bookmark.productId);
              }}
            >
              <Feather name="x" size={16} color="#EF4444" />
            </TouchableOpacity>

            {/* Product Image */}
            <View className="bg-gray-100 w-full h-[140px]">
              <Image
                source={
                  bookmark.product.imagesThumbnail ||
                  bookmark.product.images?.[0]
                    ? {
                        uri:
                          bookmark.product.imagesThumbnail ||
                          bookmark.product.images[0],
                      }
                    : require("@/assets/images/splash-screen-bg.png")
                }
                style={{ width: "100%", height: "100%" }}
                className="rounded-t-2xl"
                resizeMode="cover"
              />
            </View>

            {/* Product Details */}
            <View className="p-2 bg-white rounded-b-2xl">
              <View className="mb-1">{renderStars()}</View>
              <Text
                className="text-xs text-gray-900 font-medium"
                numberOfLines={2}
              >
                {bookmark.product.title}
              </Text>
              <Text className="text-[10px] text-gray-500 mt-1">
                {bookmark.product.category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRecentlyViewed = () => {
    if (recentLoading) {
      return (
        <View className="py-20 items-center justify-center">
          <ActivityIndicator size="large" color="#FF8C42" />
        </View>
      );
    }

    const views = recentViewsData?.views || [];

    if (views.length === 0) {
      return (
        <View className="py-20 items-center justify-center">
          <Feather name="eye" size={48} color="#9CA3AF" />
          <Text className="text-gray-900 font-semibold mt-4 text-lg">
            No viewing history
          </Text>
          <Text className="text-gray-500 mt-2 text-center px-8">
            Products you view will appear here
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-row flex-wrap justify-between px-3 pt-4">
        {views.map((view: any) => (
          <TouchableOpacity
            key={view.id}
            className="rounded-2xl overflow-hidden mb-4"
            style={{
              width: (width - 32) / 2 - 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            activeOpacity={0.8}
            onPress={() =>
              router.push(`/marketplace/machinery/${view.product.id}` as any)
            }
          >
            {/* Product Image */}
            <View className="bg-gray-100 w-full h-[140px]">
              <Image
                source={
                  view.product.imagesThumbnail || view.product.images?.[0]
                    ? {
                        uri:
                          view.product.imagesThumbnail ||
                          view.product.images[0],
                      }
                    : require("@/assets/images/splash-screen-bg.png")
                }
                style={{ width: "100%", height: "100%" }}
                className="rounded-t-2xl"
                resizeMode="cover"
              />
            </View>

            {/* Product Details */}
            <View className="p-2 bg-white rounded-b-2xl">
              <View className="mb-1">{renderStars()}</View>
              <Text
                className="text-xs text-gray-900 font-medium"
                numberOfLines={2}
              >
                {view.product.title}
              </Text>
              <Text className="text-[10px] text-gray-500 mt-1">
                Viewed {new Date(view.viewedAt).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSearchHistory = () => {
    if (searchesLoading) {
      return (
        <View className="py-20 items-center justify-center">
          <ActivityIndicator size="large" color="#FF8C42" />
        </View>
      );
    }

    const searches = searchHistoryData?.searches || [];

    if (searches.length === 0) {
      return (
        <View className="py-20 items-center justify-center">
          <Feather name="search" size={48} color="#9CA3AF" />
          <Text className="text-gray-900 font-semibold mt-4 text-lg">
            No search history
          </Text>
          <Text className="text-gray-500 mt-2 text-center px-8">
            Your searches will appear here
          </Text>
        </View>
      );
    }

    return (
      <View className="px-4 pt-4">
        {searches.map((search: any) => (
          <TouchableOpacity
            key={search.id}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
            onPress={() => {
              // Navigate to search results with this term
              router.push(
                `/marketplace/machinery?search=${search.searchTerm}` as any
              );
            }}
          >
            <View className="flex-row items-center flex-1">
              <View className="bg-gray-100 rounded-full p-2 mr-3">
                <Feather name="search" size={18} color="#6B7280" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">
                  {search.searchTerm}
                </Text>
                {search.resultsCount !== null && (
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {search.resultsCount} results
                  </Text>
                )}
              </View>
            </View>
            <Feather name="arrow-up-left" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">My Activity</Text>
        </View>

        {/* Activity Summary */}
        {activityData && (
          <View className="flex-row justify-around mt-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {activityData.bookmarks}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Bookmarks</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {activityData.views}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Viewed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {activityData.searches}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Searches</Text>
            </View>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View className="bg-white border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
          contentContainerStyle={{ paddingVertical: 12 }}
        >
          <TouchableOpacity
            className={`px-5 py-2 rounded-full mr-3 ${
              activeTab === "bookmarks" ? "bg-gray-900" : "bg-gray-100"
            }`}
            onPress={() => setActiveTab("bookmarks")}
          >
            <Text
              className={`text-sm font-medium ${
                activeTab === "bookmarks" ? "text-white" : "text-gray-700"
              }`}
            >
              Bookmarks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-5 py-2 rounded-full mr-3 ${
              activeTab === "recent" ? "bg-gray-900" : "bg-gray-100"
            }`}
            onPress={() => setActiveTab("recent")}
          >
            <Text
              className={`text-sm font-medium ${
                activeTab === "recent" ? "text-white" : "text-gray-700"
              }`}
            >
              Recently Viewed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-5 py-2 rounded-full ${
              activeTab === "searches" ? "bg-gray-900" : "bg-gray-100"
            }`}
            onPress={() => setActiveTab("searches")}
          >
            <Text
              className={`text-sm font-medium ${
                activeTab === "searches" ? "text-white" : "text-gray-700"
              }`}
            >
              Search History
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "bookmarks" && renderBookmarks()}
        {activeTab === "recent" && renderRecentlyViewed()}
        {activeTab === "searches" && renderSearchHistory()}
      </ScrollView>
    </View>
  );
}
