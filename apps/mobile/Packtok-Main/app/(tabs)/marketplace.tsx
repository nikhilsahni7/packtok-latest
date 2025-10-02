import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Marketplace categories data - matching Figma
const marketplaceCategories = [
  {
    id: "1",
    name: "Machinery",
    image: require("@/assets/images/machinery.png"),
    route: "/marketplace/machinery",
  },
  {
    id: "2",
    name: "Raw Material",
    image: require("@/assets/images/raw-materails.png"),
    route: null, // TODO: Add route when screen is created
  },
  {
    id: "3",
    name: "Consumables",
    image: require("@/assets/images/consumables.png"),
    route: null, // TODO: Add route when screen is created
  },
];

export default function MarketplaceScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />

      {/* Header - Simple Orange Header matching Figma */}
      <View className="bg-[#FF8C42] px-4 pt-12 pb-3">
        <View className="flex-row items-center justify-between">
          {/* Menu Icon */}
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Feather name="menu" size={24} color="white" />
          </TouchableOpacity>

          {/* Center - Just a dash/line (matching Figma) */}
          <View className="flex-1 items-center">
            <View className="w-8 h-0.5 bg-white/40" />
          </View>

          {/* Right Icons */}
          <View className="flex-row items-center">
            {/* Notification Bell */}
            <TouchableOpacity className="relative w-10 h-10 items-center justify-center">
              <Feather name="bell" size={22} color="white" />
              <View className="absolute top-2 right-2 bg-red-500 rounded-full w-2 h-2" />
            </TouchableOpacity>

            {/* Shopping Cart */}
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Feather name="shopping-cart" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Search Bar */}
        <View className="px-4 pt-4 pb-3 bg-white">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Feather name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search any Product"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-sm text-gray-900"
            />
            <TouchableOpacity>
              <Feather name="sliders" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* All Marketplace Section */}
        <View className="px-4 pt-4 bg-white">
          <Text className="text-base font-bold text-gray-900 mb-3">
            All Marketplace
          </Text>
        </View>

        {/* Category Cards - Vertical List matching Figma exactly */}
        <View className="px-4 bg-white pb-4">
          {marketplaceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className="bg-white rounded-xl overflow-hidden mb-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              activeOpacity={0.8}
              onPress={() => {
                if (category.route) {
                  router.push(category.route as any);
                }
              }}
            >
              {/* Category Image - Larger, full width */}
              <View className="bg-gray-50 w-full">
                <Image
                  source={category.image}
                  style={{ width: "100%", height: 180 }}
                  resizeMode="cover"
                />
              </View>

              {/* Category Name */}
              <View className="px-4 py-3 bg-white">
                <Text className="text-sm font-semibold text-gray-900">
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
