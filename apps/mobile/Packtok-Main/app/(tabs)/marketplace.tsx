import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  ScrollView,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");


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
    <View className="flex-1 bg-gray-50 relative">
      <StatusBar style="light" />

      <Image
        source={require("@/assets/images/bubble 01.png")}
        className="absolute z-10"
        style={{
          top: -width * 0.10,
          left: -width * 0.27,
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
          top: -width * 0.10,
          left: -width * 0.27,
          width: width * 1,
          height: width * 0.9,
        }}
        resizeMode="contain"
      />

      {/* Header - Simple Orange Header matching Figma */}
      <View className=" px-4 pt-12 relative z-30 pb-3">
        <View className="flex-row items-center  justify-between">
          {/* Menu Icon */}
          <TouchableOpacity className="p-2 relative z-20">
            <Feather name="menu" size={24} color="black" style={{ backgroundColor: "white" }} className="p-2 rounded-full" />
          </TouchableOpacity>
          {/* Center - Just a dash/line (matching Figma) */}
          <Image
            source={require("@/assets/images/logo-removebg.png")}
            style={{ width: 200, height: 100 }}
            resizeMode="contain"
          />

          {/* Right Icons */}
          <View className="flex-row items-center">
            {/* Notification Bell */}
            <TouchableOpacity className="relative w-10 h-10 items-center justify-center">
              <Feather name="bell" size={22} color="black" />
              <View className="absolute top-2 right-2 bg-red-500 rounded-full w-2 h-2" />
            </TouchableOpacity>

            {/* Shopping Cart */}
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Feather name="shopping-cart" size={22} color="black" />
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
        <View className="px-4 pt-4 pb-3 relative z-50 ">
          <View className="flex-row relative z-40 items-center bg-white rounded-lg px-4 py-3">
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
        <View className="px-4 pt-12  relative z-50">
          <Text className="text-[18px] relative z-50 font-medium text-gray-900 mb-3">
            All Marketplace
          </Text>
        </View>

        {/* Category Cards - Vertical List matching Figma exactly */}
        <View className="px-4  pb-4">
          {marketplaceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className=" rounded-xl "

              activeOpacity={0.8}
              onPress={() => {
                if (category.route) {
                  router.push(category.route as any);
                }
              }}
            >
              {/* Category Image - Larger, full width */}
              <View className=" w-full">
                <Image
                  source={category.image}
                  style={{ width: "100%", height: 180 }}
                  resizeMode="cover"
                  className="rounded-[25px]"
                />
              </View>

              {/* Category Name */}
              <View className="px-4 py-3 text-center">
                <Text className="text-sm text-center font-medium text-gray-900">
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
