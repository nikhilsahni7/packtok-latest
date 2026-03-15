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
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useCartItemCount } from "@/hooks/useCart";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";

const { width } = Dimensions.get("window");

// Category data structure
const categories = [
  {
    id: "1",
    name: "Machinery",
    icon: require("@/assets/images/machinery-home.jpg"),
    available: true,
  },
  {
    id: "2",
    name: "Spare Parts",
    icon: require("@/assets/images/spare_part_1.png"),
    available: true,
  },
  {
    id: "3",
    name: "Raw Materials",
    icon: require("@/assets/images/rawmaterial.png"),
    available: true,
  },
  {
    id: "4",
    name: "Consumables",
    icon: require("@/assets/images/consumables.png"),
    available: true,
  },
  {
    id: "5",
    name: "Man Power",
    icon: require("@/assets/images/manpower2.jpg"),
    available: true,
  },
  {
    id: "6",
    name: "Bidding",
    icon: require("@/assets/images/bidding1.webp"),
    available: true,
  },
  {
    id: "7",
    name: "Machinery Installer",
    icon: require("@/assets/images/machinery-installer.png"),
    available: true,
  },
  {
    id: "8",
    name: "Consultancy",
    icon: require("@/assets/images/consultancy.png"),
    available: true,
  },
  {
    id: "9",
    name: "Maintenance",
    icon: require("@/assets/images/maintainance.png"),
    available: true,
  },
  {
    id: "10",
    name: "Sell Old Machine",
    icon: require("@/assets/images/sell-old-machine.png"),
    available: true,
  },
  {
    id: "11",
    name: "Turnkey",
    icon: require("@/assets/images/tunkery.png"),
    available: true,
  },
  {
    id: "12",
    name: "Investment/Takeover",
    icon: require("@/assets/images/investment.png"),
    available: true,
  },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const itemCount = useCartItemCount();
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    console.log(`🔍 Category pressed: ${categoryName} (ID: ${categoryId})`);

    // Navigate to appropriate screen based on category
    try {
      switch (categoryName) {
        case "Machinery":
          console.log("→ Navigating to Machinery");
          router.push("/marketplace/machinery");
          break;
        case "Spare Parts":
          console.log("→ Navigating to Spare Parts");
          router.push("/marketplace/spare-parts");
          break;
        case "Raw Materials":
          console.log("→ Navigating to Raw Materials");
          router.push("/marketplace/raw-material");
          break;
        case "Consumables":
          console.log("→ Navigating to Consumables");
          router.push("/marketplace/consumables");
          break;
        case "Bidding":
          console.log("→ Navigating to Bidding");
          router.push("/bidding");
          break;
        case "Consultancy":
          console.log("→ Navigating to Consultancy");
          router.push("/services/consultancy");
          break;
        case "Maintenance":
          console.log("→ Navigating to Maintenance");
          router.push("/services/maintenance");
          break;
        case "Turnkey":
          console.log("→ Navigating to Turnkey Projects");
          router.push("/services/turnkey-projects");
          break;
        case "Machinery Installer":
          console.log("→ Navigating to Machinery Installer");
          router.push("/services/machinery-installer");
          break;
        case "Sell Old Machine":
          console.log("→ Navigating to Sell Old Machine");
          router.push("/services/sell-old-machine");
          break;
        case "Investment/Takeover":
          console.log("→ Navigating to Investment/Takeover");
          router.push("/services/investment-takeover");
          break;
        case "Man Power":
          console.log("→ Navigating to Man Power");
          router.push("/services/manpower");
          break;
        default:
          console.log(`❌ Unknown category: ${categoryName}`);
      }
    } catch (error) {
      console.error("❌ Navigation error:", error);
    }
  };

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

      {/* Orange Bubble - Bottom Left */}
      {/* <Image
        source={require("@/assets/images/bubble 3.png")}
        className="absolute"
        style={{
          bottom: width * 0.1,
          left: -width * 0.3,
          width: width * 0.6,
          height: width * 0.6,
          opacity: 0.4,
          zIndex: -1,
        }}
        resizeMode="contain"
        pointerEvents="none"
      /> */}

      {/* Blue Bubble - Bottom Right */}
      {/* <Image
        source={require("@/assets/images/bubble 4.png")}
        className="absolute"
        style={{
          bottom: width * 0.05,
          right: -width * 0.25,
          width: width * 0.55,
          height: width * 0.55,
          opacity: 0.3,
          zIndex: -1,
        }}
        resizeMode="contain"
        pointerEvents="none"
      /> */}

      {/* Header with Title and Search */}
      <View className="px-5 pt-12 pb-2 relative" style={{ zIndex: 10 }}>
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Menu Icon */}
          <TouchableOpacity 
            className="p-2 relative z-20"
            onPress={() => router.back()}
          >
            <Feather
              name="arrow-left"
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
        <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-3 z-10 shadow-sm mb-4">
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

        {/* Page Title */}
        <View className="flex-row items-center justify-center mb-1 font-semibold: ">
          <Text className="text-2xl font-bold text-gray-900">
            All Categories
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, zIndex: 10 }}
      >
        {/* Categories Grid - 3 Columns */}
        <View className="px-5 pt-4">
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id, category.name)}
                activeOpacity={0.7}
                className="w-[31%] mb-6"
                disabled={false}
              >
                {/* Category Circle */}
                <View className="items-center">
                  <View className="relative">
                    <View
                      className={`w-20 h-20 rounded-[15px] items-center justify-center overflow-hidden mb-2 shadow-sm ${
                        category.available ? "bg-gray-200" : "bg-gray-300"
                      }`}
                    >
                      <Image
                        source={category.icon}
                        style={{
                          width: 80,
                          height: 80,
                          opacity: category.available ? 1 : 0.5,
                        }}
                        resizeMode="cover"
                      />
                    </View>

                    {/* Coming Soon Badge */}
                    {!category.available && (
                      <View className="absolute top-0 right-0 bg-yellow-500 rounded-full px-1.5 py-0.5">
                        <Text className="text-[8px] font-bold text-white">
                          SOON
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Category Name */}
                  <Text
                    className={`text-xs text-center font-medium ${
                      category.available ? "text-gray-900" : "text-gray-500"
                    }`}
                    numberOfLines={2}
                  >
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
