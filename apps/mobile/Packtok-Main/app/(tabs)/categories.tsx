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
import { SafeAreaView } from "react-native-safe-area-context";

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
    icon: require("@/assets/images/splash-screen-bg.png"),
    available: true,
  },
  {
    id: "3",
    name: "Raw Materials",
    icon: require("@/assets/images/splash-screen-bg.png"),
    available: false,
  },
  {
    id: "4",
    name: "Consumables",
    icon: require("@/assets/images/consumables.png"),
    available: false,
  },
  {
    id: "5",
    name: "Man Power",
    icon: require("@/assets/images/splash-screen-bg.png"),
    available: false,
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
    icon: require("@/assets/images/splash-screen-bg.png"),
    available: false,
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
    icon: require("@/assets/images/splash-screen-bg.png"),
    available: true,
  },
  {
    id: "10",
    name: "Sell Old Machine",
    icon: require("@/assets/images/machinery.png"),
    available: false,
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
    icon: require("@/assets/images/splash-screen-bg.png"),
    available: false,
  },
];

export default function CategoriesScreen() {
  const router = useRouter();

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
        case "Raw Materials":
        case "Consumables":
        case "Man Power":
        case "Machinery Installer":
        case "Sell Old Machine":
        case "Investment/Takeover":
          // These are coming soon - show a toast or alert
          console.log(`⏳ ${categoryName} - Coming Soon`);
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
      <Image
        source={require("@/assets/images/bubble 01.png")}
        className="absolute"
        style={{
          top: -width * 0.35,
          left: -width * 0.35,
          width: width * 0.75,
          height: width * 0.75,
          opacity: 0.6,
          zIndex: -1,
        }}
        resizeMode="contain"
        pointerEvents="none"
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
          zIndex: -1,
        }}
        resizeMode="contain"
        pointerEvents="none"
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
          zIndex: -1,
        }}
        resizeMode="contain"
        pointerEvents="none"
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
          zIndex: -1,
        }}
        resizeMode="contain"
        pointerEvents="none"
      />

      {/* Header with Title */}
      <View className="px-5 py-4" style={{ zIndex: 10 }}>
        <View className="flex-row items-center">
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
                      className={`w-20 h-20 rounded-full items-center justify-center overflow-hidden mb-2 shadow-sm ${
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
