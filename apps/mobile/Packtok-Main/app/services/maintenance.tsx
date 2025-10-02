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
  Linking,
} from "react-native";

const { width } = Dimensions.get("window");

export default function MaintenanceScreen() {
  const router = useRouter();

  const handleCall = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleLocation = () => {
    // Handle location navigation
    Linking.openURL("https://maps.google.com");
  };

  const handleShare = () => {
    // Handle share functionality
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
            source={require("@/assets/images/maintainance.png")}
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
        <View className="bg-white rounded-t-3xl -mt-6 px-5 pt-6">
          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Maintenance
          </Text>

          {/* Action Buttons */}
          <View className="flex-row items-start justify-between mb-6">
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

            {/* Rating */}
            <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full">
              <Feather name="star" size={14} color="#3B82F6" />
              <Text className="text-blue-600 font-semibold ml-1 text-sm">
                4.1
              </Text>
              <Text className="text-blue-600 text-xs ml-1">45 ratings</Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-gray-700 leading-6 text-base">
              A turnkey project is a contract-based solution where the
              contractor manages everything from design and procurement to
              construction, installation, and final commissioning. For your
              project, Packtok will ensure client involvement is day-to-day
              management and ensures efficiency, quality, and timely completion
              of project.
            </Text>
          </View>

          {/* Fill the Form Button */}
          <TouchableOpacity
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
