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

const { width } = Dimensions.get("window");

// Marketplace categories data - matching Figma
const marketplaceCategories = [
  {
    id: "1",
    name: "Machinery",
    image: require("@/assets/images/machinery.png"),
    icon: require("@/assets/images/arrow.png"),
    route: "/marketplace/machinery",
    bgColor: "#AE52EE",
  },
  {
    id: "2",
    name: "Spare Parts",
    image: require("@/assets/images/rawmaterial.png"),
    icon: require("@/assets/images/arrow.png"),
    route: "/marketplace/spare-parts",
    bgColor: "#3B82F6",
  },
  {
    id: "3",
    name: "Raw Material",
    image: require("@/assets/images/rawmaterial.png"),
    icon: require("@/assets/images/arrow.png"),
    route: "/marketplace/raw-material",
    bgColor: "#E58510",
  },
  {
    id: "4",
    name: "Consumables",
    image: require("@/assets/images/consumables.png"),
    icon: require("@/assets/images/arrow.png"),
    route: "/marketplace/consumables",
    bgColor: "#D4C522",
  },
  {
    id: "5",
    name: "Man Power",
    image: require("@/assets/images/manpower.png"),
    icon: require("@/assets/images/arrow.png"),
    route: "/services/manpower",
    bgColor: "#10B981",
  },
];

export default function MarketplaceScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50 relative">
      <StatusBar style="light" />

      {/* Blue Bubble - Top Right */}
      <Image
        source={require("@/assets/images/bubble 02.png")}
        className="absolute"
        style={{
          top: -width * 0.1,
          left: -width * 0.27,
          width: width * 1,
          height: width * 0.9,
        }}
        resizeMode="contain"
      />

      <Image
        source={require("@/assets/images/bubble 01.png")}
        className="absolute"
        style={{
          top: -width * 0.1,
          left: -width * 0.27,
          width: width * 0.7,
          height: width * 0.9,
        }}
        resizeMode="contain"
      />

      {/* Header - Simple Orange Header matching Figma */}
      <View className=" px-4 pt-12 relative z-50 pb-3">
        <View className="flex-row items-center   justify-between">
          {/* Menu Icon */}
          <TouchableOpacity
            className="w-10 h-10 items-center bg-[#F2F2F2] rounded-full justify-center relative z-20"
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="black" />
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
        <View className="px-4 pt-4 pb-3 ">
          <View className="flex-row  items-center bg-white border rounded-full px-4 py-3">
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

        {/* All Marketplace Section */}
        <View className="px-4 pt-12  relative z-50">
          <Text className="text-[18px] relative z-50 font-medium text-gray-900 mb-3">
            All Marketplace
          </Text>
        </View>

        {/* Category Cards - Vertical List matching Figma exactly */}
        <View className="px-4 pb-4">
          {marketplaceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={` mb-8 rounded-xl `}
              activeOpacity={0.8}
              onPress={() => {
                if (category.route) {
                  router.push(category.route as any);
                }
              }}
            >
              {/* Category Image - Larger, full width */}
              <View className={`  rounded-xl `}>
                <View
                  style={{ backgroundColor: category.bgColor }}
                  className={` p-5 rounded-xl w-full flex-row col-gap-4   justify-between`}
                >
                  {/* Left Side - Category Name */}
                  <View>
                    <Text className="text-[30px] mt-4 mb-2 text-white font-medium">
                      {category.name}
                    </Text>
                    <Image
                      source={category.icon}
                      style={{ width: 30, height: 30 }}
                      resizeMode="cover"
                      className="rounded-[20px]"
                    />
                  </View>

                  {/* Right Side - Image */}
                  <Image
                    source={category.image}
                    style={{ width: 120, height: 120 }}
                    resizeMode="cover"
                    className="rounded-[20px]"
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
