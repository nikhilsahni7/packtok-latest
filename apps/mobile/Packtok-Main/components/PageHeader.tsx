import { useCartItemCount } from "@/hooks/useCart";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface PageHeaderProps {
  /** Show search bar (default: true) */
  showSearch?: boolean;
  /** Show background bubbles (default: true) */
  showBubbles?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Callback for in-page search filtering. When provided, search stays in-page instead of navigating to /search */
  onSearchChange?: (text: string) => void;
  /** Controlled search value (for in-page filtering) */
  searchValue?: string;
}

export default function PageHeader({
  showSearch = true,
  showBubbles = true,
  searchPlaceholder = "Search any Product...",
  onSearchChange,
  searchValue,
}: PageHeaderProps) {
  const router = useRouter();
  const itemCount = useCartItemCount();
  const { startListening, isListening, transcript } = useVoiceSearch();
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Use controlled value if onSearchChange is provided, otherwise use local state
  const isControlled = onSearchChange !== undefined;
  const displayValue = isControlled
    ? isListening
      ? transcript
      : searchValue ?? ""
    : isListening
      ? transcript
      : localSearchQuery;

  const handleTextChange = (text: string) => {
    if (isControlled) {
      onSearchChange?.(text);
    } else {
      setLocalSearchQuery(text);
    }
  };

  const handleSearch = () => {
    const query = isControlled ? searchValue ?? "" : localSearchQuery;
    if (!isControlled && query.trim()) {
      router.push({
        pathname: "/search",
        params: { q: query },
      } as any);
      setLocalSearchQuery("");
    }
  };

  return (
    <>
      {/* Background Bubbles */}
      {showBubbles && (
        <>
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
        </>
      )}

      {/* Header Content */}
      <View className="px-5 pt-12 pb-2 relative" style={{ zIndex: 10 }}>
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Back Button */}
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

          {/* Logo */}
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
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-[10px] font-bold">2</Text>
              </View>
            </TouchableOpacity>

            {/* Shopping Cart with Dynamic Badge */}
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
        {showSearch && (
          <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-3 z-10 shadow-sm">
            <Feather name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder={isListening ? "Listening..." : searchPlaceholder}
              placeholderTextColor={isListening ? "#FF8C42" : "#9CA3AF"}
              className="flex-1 ml-3 text-base text-gray-900"
              value={displayValue}
              onChangeText={handleTextChange}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={startListening}>
              <Feather
                name="mic"
                size={20}
                color={isListening ? "#FF8C42" : "#9CA3AF"}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}
