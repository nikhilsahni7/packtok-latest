import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Category data structure
const categories = [
  {
    id: "1",
    name: "Machinery",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "2",
    name: "Spare Parts",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "3",
    name: "Raw Materials",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "4",
    name: "Consumables",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "5",
    name: "Man Power",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "6",
    name: "Bidding",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "7",
    name: "Machinery Installer",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "8",
    name: "Consultancy",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "9",
    name: "Maintenance",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "10",
    name: "Sell Old Machine",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "11",
    name: "Turnkey",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
  {
    id: "12",
    name: "Investment/Takeover",
    icon: require("@/assets/images/splash-screen-bg.png"),
  },
];

export default function CategoriesScreen() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    // Navigate to category detail screen
    console.log(`Navigate to ${categoryName}`);
    // router.push(`/category/${categoryId}`);
  };

  return (
    <View className="flex-1 bg-white relative">
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Background Bubbles - Blue and Orange Combo */}
      {/* Orange Bubble - Top Left */}
      <Image
        source={require("@/assets/images/bubble 01.png")}
        className="absolute"
        style={{
          top: -width * 0.35,
          left: -width * 0.35,
          width: width * 0.75,
          height: width * 0.75,
          opacity: 0.6,
        }}
        resizeMode="contain"
      />

      {/* Blue Bubble - Top Right */}
      <Image
        source={require("@/assets/images/bubble 02.png")}
        className="absolute"
        style={{
          top: -width * 0.25,
          right: -width * 0.4,
          width: width * 0.85,
          height: width * 0.85,
          opacity: 0.5,
        }}
        resizeMode="contain"
      />

      {/* Orange Bubble - Bottom Left */}
      <Image
        source={require("@/assets/images/bubble 3.png")}
        className="absolute"
        style={{
          bottom: width * 0.1,
          left: -width * 0.3,
          width: width * 0.6,
          height: width * 0.6,
          opacity: 0.4,
        }}
        resizeMode="contain"
      />

      {/* Blue Bubble - Bottom Right */}
      <Image
        source={require("@/assets/images/bubble 4.png")}
        className="absolute"
        style={{
          bottom: width * 0.05,
          right: -width * 0.25,
          width: width * 0.55,
          height: width * 0.55,
          opacity: 0.3,
        }}
        resizeMode="contain"
      />

      {/* Header with Back Button and Title */}
      <View className="px-5 pt-14 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#FF8C42" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-gray-900">
            All Categories
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
              >
                {/* Category Circle */}
                <View className="items-center">
                  <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center overflow-hidden mb-2 shadow-sm">
                    {/* TODO: Replace with actual category images */}
                    <Image
                      source={category.icon}
                      style={{ width: 80, height: 80 }}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Category Name */}
                  <Text
                    className="text-xs text-gray-900 text-center font-medium"
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

      {/* Bottom Tab Bar - Enhanced with Shadow and Better Spacing */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <View
          className="flex-row items-center justify-around px-4"
          style={{ paddingTop: 12, paddingBottom: 12 }}
        >
          {/* Home Tab */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/" as any)}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <View className="items-center">
              <Feather name="home" size={24} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 mt-1.5 font-medium">
                Home
              </Text>
            </View>
          </TouchableOpacity>

          {/* Wishlist Tab */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/wishlist" as any)}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <View className="items-center">
              <Feather name="heart" size={24} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 mt-1.5 font-medium">
                Wishlist
              </Text>
            </View>
          </TouchableOpacity>

          {/* Cart Tab */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cart" as any)}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <View className="items-center">
              <Feather name="shopping-cart" size={24} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 mt-1.5 font-medium">
                Cart
              </Text>
            </View>
          </TouchableOpacity>

          {/* Settings Tab */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings" as any)}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <View className="items-center">
              <Feather name="settings" size={24} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 mt-1.5 font-medium">
                Setting
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
