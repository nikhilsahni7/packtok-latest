import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PageHeader from "@/components/PageHeader";

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
    <SafeAreaView className="flex-1 bg-gray-50 relative" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Unified Header with bubbles, dynamic cart, notifications, voice search */}
      <PageHeader />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* All Marketplace Section */}
        <View className="px-4 pt-4">
          <Text className="text-[18px] font-medium text-gray-900 mb-3">
            All Marketplace
          </Text>
        </View>

        {/* Category Cards - Vertical List matching Figma exactly */}
        <View className="px-4 pb-4">
          {marketplaceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className="mb-8 rounded-xl"
              activeOpacity={0.8}
              onPress={() => {
                if (category.route) {
                  router.push(category.route as any);
                }
              }}
            >
              {/* Category Image - Larger, full width */}
              <View className="rounded-xl">
                <View
                  style={{ backgroundColor: category.bgColor }}
                  className="p-5 rounded-xl w-full flex-row col-gap-4 justify-between"
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
    </SafeAreaView>
  );
}
