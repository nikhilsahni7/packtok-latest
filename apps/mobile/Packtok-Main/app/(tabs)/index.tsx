import { Feather } from "@expo/vector-icons";
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
} from "react-native";
import { useBackHandler } from "../../hooks/useBackHandler";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  // Handle Android back button
  useBackHandler("home");

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header with Orange Background and Bubble Effects */}
      <View className=" px-5 pt-12 pb-6 relative">
        {/* Background Bubbles */}
        {/* Orange Bubble - Top Left */}
        <Image
          source={require("@/assets/images/bubble 01.png")}
          className="absolute z-10"
          style={{
            top: -width * 0.1,
            left: -width * 0.25,
            width: width * 0.7,
            height: width * 0.9,
          }}
          resizeMode="contain"
        />

        {/* Blue Bubble - Top Right */}
        <Image
          source={require("@/assets/images/bubble 02.png")}
          className="absolute"
          style={{
            top: -width * 0.1,
            left: -width * 0.25,
            width: width * 1,
            height: width * 0.9,
          }}
          resizeMode="contain"
        />

        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Menu Icon */}
          <TouchableOpacity className="p-2 relative z-20">
            <Feather
              name="menu"
              size={24}
              color="black"
              style={{ backgroundColor: "white" }}
              className="p-2 rounded-full"
            />
          </TouchableOpacity>

          <Image
            source={require("@/assets/images/logo-removebg.png")}
            style={{ width: 200, height: 100 }}
            resizeMode="contain"
          />

          {/* Right Icons */}
          <View className="flex-row items-center space-x-3">
            {/* Notification Bell with Badge */}
            <TouchableOpacity className="relative">
              <Feather name="bell" size={20} color="black" />
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full text-blac w-4 h-4 items-center justify-center">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
            </TouchableOpacity>

            {/* Shopping Cart */}
            <TouchableOpacity className="ml-3">
              <Feather name="shopping-cart" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border  rounded-full px-4 py-3 z-10">
          <Feather name="search" size={20} color="#9CA3AF" className="" />
          <TextInput
            placeholder="Search any Product..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-900"
          />
          <TouchableOpacity>
            <Feather name="mic" size={20} color="#9CA3AF" />
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
            <TouchableOpacity onPress={() => router.push("/categories")}>
              <Text className="text-sm text-black font-medium">View all</Text>
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
            <Text className="text-[18px] font-semibold text-gray-900">
              Marketplace on Packtok
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/marketplace")}
              activeOpacity={0.7}
            >
              <Text className="text-sm text-black font-medium">View all</Text>
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
              <View className=" rounded-2xl overflow-hidden">
                {/* TODO: Replace with actual machinery image */}
                <Image
                  source={require("@/assets/images/packtok.png")}
                  style={{ width: "100%", height: 120 }}
                  resizeMode="cover"
                />
              </View>

              <View className="p-3">
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
              <View className=" rounded-2xl overflow-hidden">
                <Image
                  source={require("@/assets/images/spare_part_1.png")}
                  style={{ width: "100%", height: 120 }}
                  resizeMode="cover"
                />
              </View>

              <View className="p-3">
                <Text className="text-sm font-semibold text-gray-900">
                  Spare Parts
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Podcasts Section */}
        <View className="px-5 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[18px] font-semibold text-gray-900">
              Podcasts
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/podcasts" as any)}
              activeOpacity={0.7}
            >
              <Text className="text-sm text-black font-medium">View all</Text>
            </TouchableOpacity>
          </View>

          {/* Podcasts Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            {/* Podcast Card 1 */}
            <TouchableOpacity
              className="mr-4 w-72"
              onPress={() => router.push("/podcasts/1" as any)}
              activeOpacity={0.7}
            >
              <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                <View className="relative">
                  <Image
                    source={{
                      uri: "https://img.youtube.com/vi/VXvblzAs6vM/maxresdefault.jpg",
                    }}
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
                  <View className="absolute bottom-2 right-2 bg-black/80 rounded-lg px-2 py-1">
                    <Text className="text-white text-xs font-semibold">
                      45:32
                    </Text>
                  </View>
                </View>
                <View className="p-3">
                  <Text
                    className="text-sm font-bold text-gray-900 mb-1"
                    numberOfLines={2}
                  >
                    The Future of Packaging Technology
                  </Text>
                  <View className="flex-row items-center">
                    <Feather name="heart" size={12} color="#EF4444" />
                    <Text className="text-xs text-gray-600 ml-1">245</Text>
                    <Feather
                      name="message-circle"
                      size={12}
                      color="#3B82F6"
                      className="ml-3"
                    />
                    <Text className="text-xs text-gray-600 ml-1">32</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Podcast Card 2 */}
            <TouchableOpacity
              className="mr-4 w-72"
              onPress={() => router.push("/podcasts/2" as any)}
              activeOpacity={0.7}
            >
              <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                <View className="relative">
                  <Image
                    source={{
                      uri: "https://img.youtube.com/vi/c8VcUnz3nVc/maxresdefault.jpg",
                    }}
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
                  <View className="absolute bottom-2 right-2 bg-black/80 rounded-lg px-2 py-1">
                    <Text className="text-white text-xs font-semibold">
                      38:20
                    </Text>
                  </View>
                </View>
                <View className="p-3">
                  <Text
                    className="text-sm font-bold text-gray-900 mb-1"
                    numberOfLines={2}
                  >
                    Industry Insights: Manufacturing Excellence
                  </Text>
                  <View className="flex-row items-center">
                    <Feather name="heart" size={12} color="#EF4444" />
                    <Text className="text-xs text-gray-600 ml-1">189</Text>
                    <Feather
                      name="message-circle"
                      size={12}
                      color="#3B82F6"
                      className="ml-3"
                    />
                    <Text className="text-xs text-gray-600 ml-1">24</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Podcast Card 3 */}
            <TouchableOpacity
              className="mr-4 w-72"
              onPress={() => router.push("/podcasts/3" as any)}
              activeOpacity={0.7}
            >
              <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                <View className="relative">
                  <Image
                    source={{
                      uri: "https://img.youtube.com/vi/yVTNge3sXpg/maxresdefault.jpg",
                    }}
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
                  <View className="absolute bottom-2 right-2 bg-black/80 rounded-lg px-2 py-1">
                    <Text className="text-white text-xs font-semibold">
                      42:15
                    </Text>
                  </View>
                </View>
                <View className="p-3">
                  <Text
                    className="text-sm font-bold text-gray-900 mb-1"
                    numberOfLines={2}
                  >
                    Machinery Maintenance Best Practices
                  </Text>
                  <View className="flex-row items-center">
                    <Feather name="heart" size={12} color="#EF4444" />
                    <Text className="text-xs text-gray-600 ml-1">312</Text>
                    <Feather
                      name="message-circle"
                      size={12}
                      color="#3B82F6"
                      className="ml-3"
                    />
                    <Text className="text-xs text-gray-600 ml-1">45</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Bidding on Packtok Section */}
        <View className="px-5 mt-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[18px] font-medium text-gray-900">
              Bidding on Packtok
            </Text>
          </View>

          {/* Bidding Cards */}
          <View className="mb-4">
            {/* Turnkey Card */}
            <TouchableOpacity
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-4"
              onPress={() => router.push("/services/turnkey-projects")}
              activeOpacity={0.7}
            >
              <View className="relative">
                {/* TODO: Replace with actual turnkey project image */}
                <Image
                  source={require("@/assets/images/tunkery.png")}
                  style={{ width: "100%", height: 140 }}
                  resizeMode="cover"
                />
                {/* Bookmark Icon */}
                <TouchableOpacity className="absolute top-3 right-3 bg-white/90 rounded-full p-2">
                  <Feather name="bookmark" size={18} color="#000" />
                </TouchableOpacity>
              </View>
              <View className="p-3">
                <Text className="text-[18px] font-medium text-gray-900">
                  Turnkey
                </Text>
              </View>
            </TouchableOpacity>

            {/* Consultancy Card */}
            <TouchableOpacity
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-4"
              onPress={() => router.push("/services/consultancy")}
              activeOpacity={0.7}
            >
              <View className="relative">
                {/* TODO: Replace with actual consultancy image */}
                <Image
                  source={require("@/assets/images/consultancy.png")}
                  style={{ width: "100%", height: 140 }}
                  resizeMode="cover"
                />
                {/* Bookmark Icon */}
                <TouchableOpacity className="absolute top-3 right-3 bg-white/90 rounded-full p-2">
                  <Feather name="bookmark" size={18} color="#000" />
                </TouchableOpacity>
              </View>
              <View className="p-3">
                <Text className="text-[18px] font-medium text-gray-900">
                  Consultancy
                </Text>
              </View>
            </TouchableOpacity>

            {/* Bidding (Gavel) Card */}
            <TouchableOpacity
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-4"
              onPress={() => router.push("/bidding")}
              activeOpacity={0.7}
            >
              <View className="relative">
                {/* TODO: Replace with actual bidding/gavel image */}
                <Image
                  source={require("@/assets/images/bidding1.webp")}
                  style={{ width: "100%", height: 140 }}
                  resizeMode="cover"
                />
              </View>
              <View className="p-3">
                <Text className="text-[18px] font-medium text-gray-900">
                  Bidding
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
