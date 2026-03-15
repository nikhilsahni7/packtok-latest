import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useState } from "react";
import { useBackHandler } from "../../hooks/useBackHandler";
import { useCartItemCount } from "@/hooks/useCart";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { useAuthStore } from "@/store/auth-store";
import { usePodcasts } from "@/hooks/usePodcasts";
import { useArticles } from "@/hooks/useArticles";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const itemCount = useCartItemCount();
  const [searchQuery, setSearchQuery] = useState("");
  const user = useAuthStore((state) => state.user);
  const { data: articles = [] } = useArticles(3);
  const { data: podcastsData } = usePodcasts({ limit: 3 });
  const podcasts = podcastsData?.items ?? [];

  const { startListening, isListening, transcript } = useVoiceSearch();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/search",
        params: { q: searchQuery },
      } as any);
      setSearchQuery("");
    }
  };

  // Handle Android back button
  useBackHandler("home");

  return (
    <SafeAreaView className="flex-1 bg-white relative" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Background Bubbles - Blue and Orange Combo */}
      {/* Orange Bubble - Top Left */}
      <View
        className="absolute z-10"
        style={{
          top: -width * 0.1,
          left: -width * 0.25,
          width: width * 0.7,
          height: width * 0.9,
        }}
        pointerEvents="none"
      >
        <Image
          source={require("@/assets/images/bubble 01.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      {/* Blue Bubble - Top Right */}
      <View
        className="absolute"
        style={{
          top: -width * 0.1,
          left: -width * 0.25,
          width: width * 1,
          height: width * 0.9,
        }}
        pointerEvents="none"
      >
        <Image
          source={require("@/assets/images/bubble 02.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      {/* Header with Title and Search */}
      <View className="px-5 pt-12 pb-2 relative" style={{ zIndex: 10 }}>

        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Menu Icon / User Profile */}
          <TouchableOpacity 
            className="p-1 relative z-20 rounded-full border border-gray-100 shadow-sm bg-white"
            onPress={() => router.push("/settings" as any)}
          >
            {user?.profile_image ? (
              <Image 
                source={{ uri: user.profile_image }} 
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className="w-10 h-10 rounded-full items-center justify-center bg-orange-50">
                <Feather
                  name="user"
                  size={20}
                  color="#FF8C42"
                />
              </View>
            )}
          </TouchableOpacity>

          <Image
            source={require("@/assets/images/logo-removebg.png")}
            style={{ width: 200, height: 100 }}
            resizeMode="contain"
          />

          {/* Right Icons */}
          <View className="flex-row items-center space-x-3">
            {/* Notification Bell with Badge */}
            <TouchableOpacity 
               className="relative"
               onPress={() => router.push("/notifications")}
            >
              <Feather name="bell" size={20} color="black" />
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full text-blac w-4 h-4 items-center justify-center">
                <Text className="text-white text-[10px] font-bold">2</Text>
              </View>
            </TouchableOpacity>

            {/* Shopping Cart */}
            <TouchableOpacity 
              className="ml-3 relative"
              onPress={() => router.push("/cart")}
            >
              <Feather name="shopping-cart" size={20} color="black" />
              {itemCount > 0 && (
                <View className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full min-w-[14px] h-[14px] items-center justify-center px-0.5">
                  <Text className="text-white text-[8px] font-bold">
                    {itemCount > 99 ? "99+" : itemCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border  rounded-full px-4 py-3 z-10">
          <Feather name="search" size={20} color="#9CA3AF" className="" />
          <TextInput
            placeholder={isListening ? "Listening..." : "Search any Product..."}
            placeholderTextColor={isListening ? "#FF8C42" : "#9CA3AF"}
            className="flex-1 ml-3 text-base text-gray-900"
            value={isListening ? transcript : searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={startListening}>
            <Feather name="mic" size={20} color={isListening ? "#FF8C42" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 relative z-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Browse All Categories */}
        <View className="px-5 mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[18px] font-medium mb-2 text-gray-900">
              Browse all categories
            </Text>
            <TouchableOpacity onPress={() => router.push("/categories")} className="flex-row items-center pb-2">
              <Text className="text-sm text-black font-medium">View all</Text>
              <Feather name="chevron-right" size={16} color="black" />
            </TouchableOpacity>
          </View>

          {/* Categories Scroll - Horizontal */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            {/* Category Item 1 */}
            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => router.push("/marketplace/machinery")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-[15px] overflow-hidden bg-gray-200">
                <Image
                  source={require("@/assets/images/machinery-home.jpg")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs font-medium text-gray-700 mt-2">
                Machinery
              </Text>
            </TouchableOpacity>

            {/* Category Item 2 */}

            {/* Category Item 3 */}
            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => router.push("/marketplace/spare-parts")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-[15px] overflow-hidden bg-gray-200">
                <Image
                  source={require("@/assets/images/spare_part_1.png")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs font-medium text-gray-700 mt-2">
                Spare Parts
              </Text>
            </TouchableOpacity>

            {/* Category Item 4 */}
            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => router.push("/services")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-[15px] overflow-hidden bg-gray-200">
                <Image
                  source={require("@/assets/images/consultancy.png")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs font-medium text-gray-700 mt-2">
                Services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => router.push("/marketplace")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-[15px] overflow-hidden bg-gray-200">
                <Image
                  source={require("@/assets/images/marketplace.png")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs font-medium text-gray-700 mt-2">
                Marketplace
              </Text>
            </TouchableOpacity>

            {/* Category Item 5 - View All */}
            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => router.push("/categories")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-[15px] overflow-hidden bg-gray-200 items-center justify-center">
                <Feather name="grid" size={24} color="#FF8C42" />
              </View>
              <Text className="text-xs font-medium text-gray-700 mt-2">
                View All
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Marketplace on Packtok */}
        <View className="px-5 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[18px] font-medium text-gray-900">
              Marketplace on Packtok
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/marketplace")}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Text className="text-sm text-black font-medium">View all</Text>
              <Feather name="chevron-right" size={16} color="black" />
            </TouchableOpacity>
          </View>

          {/* Marketplace Grid - 2 Column */}
          <View className="flex-row flex-wrap justify-between">
            {/* Machinery Card */}
            <TouchableOpacity
              className="w-[48%] mb-4"
              onPress={() => router.push("/marketplace/machinery")}
              activeOpacity={0.7}
            >
              <View className="relative rounded-2xl overflow-hidden">
                <Image
                  source={require("@/assets/images/packtok.png")}
                  style={{ width: "100%", height: 120 }}
                  resizeMode="cover"
                />
                <TouchableOpacity className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 shadow-sm">
                  <Feather name="heart" size={16} color="#4B5563" />
                </TouchableOpacity>
              </View>

              <View className="pt-2 pb-1">
                <Text className="text-sm font-semibold text-gray-900">
                  Machinery
                </Text>
              </View>
            </TouchableOpacity>

            {/* Spare Parts Card */}
            <TouchableOpacity
              className="w-[48%] mb-4"
              onPress={() => router.push("/marketplace/spare-parts")}
              activeOpacity={0.7}
            >
              <View className="relative rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  source={require("@/assets/images/spare_part_1.png")}
                  style={{ width: "100%", height: 120 }}
                  resizeMode="cover"
                />
                <TouchableOpacity className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 shadow-sm">
                  <Feather name="heart" size={16} color="#4B5563" />
                </TouchableOpacity>
              </View>

              <View className="pt-2 pb-1">
                <Text className="text-sm font-semibold text-gray-900">
                  Spare parts
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Podcasts Section */}
        <View className="px-5 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[18px] font-medium text-gray-900">
              Podcasts
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/podcasts" as any)}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Text className="text-sm text-black font-medium">View all</Text>
              <Feather name="chevron-right" size={16} color="black" />
            </TouchableOpacity>
          </View>

          {/* Podcasts Horizontal Scroll */}
          {podcasts.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {podcasts.map((podcast) => (
                <TouchableOpacity
                  key={podcast.id}
                  className="mr-4 w-72"
                  onPress={() => router.push(`/podcasts/${podcast.id}` as any)}
                  activeOpacity={0.7}
                >
                  <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                    <View className="relative">
                      <Image
                        source={
                          podcast.thumbnailUrl
                            ? { uri: podcast.thumbnailUrl }
                            : require("@/assets/images/article1.png")
                        }
                        style={{ width: "100%", height: 160 }}
                        resizeMode="cover"
                      />
                      {/* Play Icon */}
                      <View className="absolute inset-0 items-center justify-center">
                        <View className="w-12 h-12 rounded-full bg-white/90 items-center justify-center shadow-lg">
                          <Feather name="play" size={20} color="#000" />
                        </View>
                      </View>
                      {/* Duration Badge */}
                      {podcast.duration && (
                        <View className="absolute bottom-2 right-2 bg-black/80 rounded-lg px-2 py-1">
                          <Text className="text-white text-xs font-semibold">
                            {Math.floor(podcast.duration / 60)}:
                            {String(podcast.duration % 60).padStart(2, "0")}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="p-3">
                      <Text
                        className="text-sm font-bold text-gray-900 mb-1"
                        numberOfLines={2}
                      >
                        {podcast.title}
                      </Text>
                      <View className="flex-row items-center">
                        <Feather name="heart" size={12} color="#EF4444" />
                        <Text className="text-xs text-gray-600 ml-1">
                          {podcast.likeCount}
                        </Text>
                        <Feather
                          name="message-circle"
                          size={12}
                          color="#3B82F6"
                          className="ml-3"
                        />
                        <Text className="text-xs text-gray-600 ml-1">
                          {podcast.commentCount}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text className="text-gray-500 italic mb-4">No podcasts available yet.</Text>
          )}
        </View>

        <View className="px-5 mt-6 border-t border-gray-100 pt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[18px] font-medium text-gray-900">
              Services on Packtok
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/services")}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Text className="text-sm text-black font-medium">View all</Text>
              <Feather name="chevron-right" size={16} color="black" />
            </TouchableOpacity>
          </View>

          {/* Services Cards (2 column) */}
          <View className="flex-row flex-wrap justify-between mb-2">
            {/* Turnkey Card */}
            <TouchableOpacity
              className="w-[48%] mb-4"
              onPress={() => router.push("/services/turnkey-projects")}
              activeOpacity={0.7}
            >
              <View className="relative rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  source={require("@/assets/images/tunkery.png")}
                  style={{ width: "100%", height: 120 }}
                  resizeMode="cover"
                />
                <TouchableOpacity className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 shadow-sm">
                  <Feather name="heart" size={16} color="#4B5563" />
                </TouchableOpacity>
              </View>
              <View className="pt-2 pb-1">
                <Text className="text-sm font-semibold text-gray-900">
                  Turnkey
                </Text>
              </View>
            </TouchableOpacity>

            {/* Consultancy Card */}
            <TouchableOpacity
              className="w-[48%] mb-4"
              onPress={() => router.push("/services/consultancy")}
              activeOpacity={0.7}
            >
              <View className="relative rounded-2xl overflow-hidden bg-gray-100" style={{ height: 120 }}>
                {/* For Consultancy, if the image isn't perfect, it still fits the 120 height boundary */}
                <Image
                  source={require("@/assets/images/consultancy.png")}
                  style={{ width: "100%", height: 120 }}
                  resizeMode="cover"
                />
              </View>
              <View className="pt-2 pb-1">
                <Text className="text-sm font-semibold text-gray-900">
                  Consultancy
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bidding Section */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[18px] font-medium text-gray-900">
              Bidding
            </Text>
          </View>

          <TouchableOpacity
            className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
            onPress={() => router.push("/bidding")}
            activeOpacity={0.7}
          >
            <Image
              source={require("@/assets/images/bidding1.webp")}
              style={{ width: "100%", height: 160 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Articles Section */}
        {articles.length > 0 && (
          <View className="px-5 mb-6 mt-2">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[18px] font-medium text-gray-900">
                Packaging Articles
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/articles" as any)}
                activeOpacity={0.7}
                className="flex-row items-center border-b border-black pb-0.5"
              >
                <Text className="text-sm text-black font-medium">More Articles</Text>
                <Feather name="arrow-right" size={14} color="black" className="ml-1" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
              className="-mx-5 px-5"
            >
              {articles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  className="mr-4 w-[240px]"
                  onPress={() => router.push(`/articles/${article.id}` as any)}
                  activeOpacity={0.8}
                >
                  <View className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm mb-3">
                    <Image
                      source={
                        article.coverImage
                          ? { uri: article.coverImage }
                          : require("@/assets/images/article1.png")
                      }
                      style={{ width: "100%", height: 140 }}
                      resizeMode="cover"
                    />
                  </View>
                  <Text className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight mb-2">
                    {article.title}
                  </Text>
                  <View className="flex-row items-center border-b border-black pb-0.5 self-start">
                    <Text className="text-sm text-gray-900 font-medium">Read More</Text>
                    <Feather name="arrow-right" size={14} color="black" className="ml-1" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
