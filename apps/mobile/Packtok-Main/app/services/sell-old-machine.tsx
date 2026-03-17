import {
  openSupportLocation,
  openSupportPhone,
  shareServiceDetails,
} from "@/utils/serviceSupport";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SellOldMachineScreen() {
  const router = useRouter();

  const handleCall = () => {
    void openSupportPhone();
  };

  const handleLocation = () => {
    void openSupportLocation();
  };

  const handleShare = () => {
    void shareServiceDetails({
      title: "Sell Old Machine",
      description:
        "Packtok helps you value, list, negotiate, and transfer old machinery with a smoother resale process.",
    });
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Image */}
        <View className="relative">
          <Image
            source={require("@/assets/images/sell-old-machine.png")}
            style={{ width: width, height: width * 0.75 }}
            resizeMode="cover"
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-5 w-10 h-10 items-center justify-center bg-white/90 rounded-full shadow-lg"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View className="bg-white rounded-t-[70px] -mt-16 px-10 pt-20">
          {/* Title */}
          <Text className="text-[36px] text-center font-bold text-gray-900 mb-4">
            Sell Old Machine
          </Text>

          {/* Action Buttons */}
          <View className="flex-row items-start mb-6">
            <View className="flex-row items-start gap-x-4">
              {/* Call Button */}
              <View className="items-center">
                <TouchableOpacity
                  onPress={handleCall}
                  className="w-11 h-11 items-center justify-center bg-gray-100 rounded-full mb-1"
                  activeOpacity={0.7}
                >
                  <Feather name="phone" size={18} color="#000" />
                </TouchableOpacity>
                <Text className="text-xs text-gray-600">Call</Text>
              </View>

              {/* Location Button */}
              <View className="items-center">
                <TouchableOpacity
                  onPress={handleLocation}
                  className="w-11 h-11 items-center justify-center bg-gray-100 rounded-full mb-1"
                  activeOpacity={0.7}
                >
                  <Feather name="map-pin" size={18} color="#000" />
                </TouchableOpacity>
                <Text className="text-xs text-gray-600">Location</Text>
              </View>

              {/* Share Button */}
              <View className="items-center">
                <TouchableOpacity
                  onPress={handleShare}
                  className="w-11 h-11 items-center justify-center bg-gray-100 rounded-full mb-1"
                  activeOpacity={0.7}
                >
                  <Feather name="share-2" size={18} color="#000" />
                </TouchableOpacity>
                <Text className="text-xs text-gray-600">Share</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-gray-700 text-justify leading-6 text-base">
              Sell Old Machine is a comprehensive service where we help you
              provide storage, everything from initial valuation, listing,
              negotiation, and final transfer. This service ensures a smooth,
              efficient, and quick turnaround while maximizing the value of the
              old machine.
            </Text>
          </View>

          {/* Fill the Form Button */}
          <TouchableOpacity
            onPress={() => router.push("/services/sell-machine-form")}
            className="bg-black rounded-full py-4 items-center shadow-lg mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Fill the Form
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row items-center justify-around py-3">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <Feather name="home" size={24} color="#EF4444" />
            <Text className="text-red-500 text-xs mt-1 font-medium">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/wishlist")}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <Feather name="heart" size={24} color="#6B7280" />
            <Text className="text-gray-600 text-xs mt-1">Wishlist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cart")}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <Feather name="shopping-cart" size={24} color="#6B7280" />
            <Text className="text-gray-600 text-xs mt-1">Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings")}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <Feather name="settings" size={24} color="#6B7280" />
            <Text className="text-gray-600 text-xs mt-1">Setting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
