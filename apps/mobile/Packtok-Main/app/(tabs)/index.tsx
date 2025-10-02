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
      <StatusBar style="light" />

      {/* Header with Orange Background and Bubble Effects */}
      <View className="bg-[#FF8C42] px-5 pt-12 pb-6 relative overflow-hidden">
        {/* Background Bubbles */}
        {/* Orange Bubble - Top Left */}
        <Image
          source={require("@/assets/images/bubble 01.png")}
          className="absolute"
          style={{
            top: -width * 0.15,
            left: -width * 0.2,
            width: width * 0.5,
            height: width * 0.5,
            opacity: 0.3,
          }}
          resizeMode="contain"
        />

        {/* Blue Bubble - Top Right */}
        <Image
          source={require("@/assets/images/bubble 02.png")}
          className="absolute"
          style={{
            top: -width * 0.1,
            right: -width * 0.25,
            width: width * 0.6,
            height: width * 0.6,
            opacity: 0.2,
          }}
          resizeMode="contain"
        />

        {/* Additional Orange Bubble - Bottom */}
        <Image
          source={require("@/assets/images/bubble 3.png")}
          className="absolute"
          style={{
            bottom: -width * 0.1,
            left: width * 0.3,
            width: width * 0.4,
            height: width * 0.4,
            opacity: 0.25,
          }}
          resizeMode="contain"
        />

        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4 z-10">
          {/* Menu Icon */}
          <TouchableOpacity className="p-2">
            <Feather name="menu" size={24} color="white" />
          </TouchableOpacity>

          <Image
            source={require("@/assets/images/logo-removebg.png")}
            style={{ width: 200, height: 10 }}
            resizeMode="contain"
          />

          {/* Right Icons */}
          <View className="flex-row items-center space-x-3">
            {/* Notification Bell with Badge */}
            <TouchableOpacity className="relative">
              <Feather name="bell" size={20} color="white" />
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
            </TouchableOpacity>

            {/* Shopping Cart */}
            <TouchableOpacity className="ml-3">
              <Feather name="shopping-cart" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 z-10">
          <Feather name="search" size={20} color="#9CA3AF" />
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Browse All Categories */}
        <View className="px-5 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-gray-900">
              Browse all categories
            </Text>
            <TouchableOpacity onPress={() => router.push("/categories")}>
              <Text className="text-sm text-[#FF8C42] font-medium">
                View all
              </Text>
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
              onPress={() => router.push("/categories")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <Image
                  source={require("@/assets/images/machinery-home.jpg")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs text-gray-700 mt-2">Machinery</Text>
            </TouchableOpacity>

            {/* Category Item 2 */}
            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => router.push("/packaging")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <Image
                  source={require("@/assets/images/splash-screen-bg.png")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs text-gray-700 mt-2">Packaging</Text>
            </TouchableOpacity>

            {/* Category Item 3 */}
            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => router.push("/marketplace/spare-parts")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <Image
                  source={require("@/assets/images/splash-screen-bg.png")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs text-gray-700 mt-2">Spare Parts</Text>
            </TouchableOpacity>

            {/* Category Item 4 */}
            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => router.push("/services")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <Image
                  source={require("@/assets/images/splash-screen-bg.png")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs text-gray-700 mt-2">Services</Text>
            </TouchableOpacity>

            {/* Category Item 5 - View All */}
            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => router.push("/categories")}
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 items-center justify-center">
                <Feather name="grid" size={24} color="#FF8C42" />
              </View>
              <Text className="text-xs text-gray-700 mt-2">View All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Marketplace on Packtok */}
        <View className="px-5 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-gray-900">
              Marketplace on Packtok
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/marketplace")}
              activeOpacity={0.7}
            >
              <Text className="text-sm text-[#FF8C42] font-medium">
                View all
              </Text>
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
              <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                {/* TODO: Replace with actual machinery image */}
                <Image
                  source={require("@/assets/images/machinery-home2.jpg")}
                  style={{ width: "100%", height: 120 }}
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-sm font-semibold text-gray-900">
                    Machinery
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Spare Parts Card */}
            <TouchableOpacity
              className="w-[48%] mb-4"
              onPress={() => router.push("/marketplace/spare-parts")}
              activeOpacity={0.7}
            >
              <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                {/* TODO: Replace with actual spare parts image */}
                <Image
                  source={require("@/assets/images/splash-screen-bg.png")}
                  style={{ width: "100%", height: 120 }}
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-sm font-semibold text-gray-900">
                    Spare parts
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bidding on Packtok Section */}
        <View className="px-5 mt-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-gray-900">
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
                <Text className="text-sm font-semibold text-gray-900">
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
                <Text className="text-sm font-semibold text-gray-900">
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
                <Text className="text-sm font-semibold text-gray-900">
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
