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

export default function InvestmentTakeoverScreen() {
  const router = useRouter();

  const handleCall = () => {
    void openSupportPhone();
  };

  const handleLocation = () => {
    void openSupportLocation();
  };

  const handleShare = () => {
    void shareServiceDetails({
      title: "Acquisition & Takeover",
      description:
        "Packtok supports business acquisition and takeover opportunities across industrial and manufacturing sectors.",
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
            source={require("@/assets/images/investment.png")}
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
            Acquisition & Takeover
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
              Acquisition and takeover are strategic business arrangements where
              one company or investor gains control of another business. This
              service facilitates valuation, negotiation, due diligence, and
              final handover. We ensure a smooth transition while maximizing the
              value of the enterprise.
            </Text>
          </View>

          {/* Fill the Form Button */}
          <TouchableOpacity
            onPress={() =>
              router.push("/services/investment-takeover-form" as any)
            }
            className="bg-black rounded-full py-4 items-center shadow-lg mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Fill the Form
            </Text>
          </TouchableOpacity>

          <View className="mt-4 mb-6 rounded-3xl border border-gray-200 p-5 bg-[#F8FAFC]">
            <View className="self-start px-3 py-1 rounded-full bg-gray-900 mb-3">
              <Text className="text-[11px] font-semibold text-white uppercase tracking-wide">
                New
              </Text>
            </View>

            <Text className="text-xl font-bold text-gray-900 uppercase leading-7">
              Explore Premium Industrial Facilities
            </Text>

            <Text className="text-gray-600 text-sm mt-3 leading-5">
              Discover high-value manufacturing plants and warehouses,
              production-ready with turnkey operations for immediate
              acquisition.
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push("/services/acquisition-facilities" as any)
              }
              className="mt-4 bg-black rounded-full py-3.5 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-sm">
                Browse Facilities & Send Query
              </Text>
            </TouchableOpacity>
          </View>
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
