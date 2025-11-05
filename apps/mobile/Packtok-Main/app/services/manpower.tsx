import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ManpowerScreen() {
  const router = useRouter();

  const handleCall = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleLocation = () => {
    Linking.openURL("https://maps.google.com");
  };

  const handleShare = () => {
    // Handle share functionality
  };

  const handleHiringPartnerForm = () => {
    // Navigate to hiring partner form
    router.push("/services/manpower-hiring-form");
  };

  const handleEmployerForm = () => {
    // Navigate to job seeker form
    router.push("/services/job-seeker-form");
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
            source={require("@/assets/images/manpower.jpg")}
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
            Manpower
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
            <View className="flex-column items-center">
              <View className="flex-row items-center border border-[#0063F7] px-3 py-1.5 rounded-[10px]">
                <Feather name="star" size={14} color="#2563EB" />
                <Text className="text-blue-600 text-xs ml-1 font-medium">
                  4.8
                </Text>
              </View>

              <View className="mt-1">
                <Text className="text-blue-600 text-xs ml-1">45 ratings</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-gray-700 leading-6 text-justify text-base">
              Connect employers with qualified industrial talent. Whether
              you&apos;re looking to hire skilled workers or seeking employment
              opportunities in manufacturing and industrial sectors, we bridge
              the gap between talent and opportunity.
            </Text>
          </View>

          {/* Choose Your Path Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Choose Your Path
            </Text>

            {/* Hiring Partner Card */}
            <TouchableOpacity
              onPress={handleHiringPartnerForm}
              activeOpacity={0.8}
              className="bg-orange-50 rounded-2xl p-5 mb-4 border border-orange-200"
            >
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-[#FF6B35] rounded-xl items-center justify-center mr-3">
                  <MaterialCommunityIcons
                    name="briefcase-account"
                    size={24}
                    color="black"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    Hiring Partner
                  </Text>
                  <Text className="text-xs text-gray-600">For Businesses</Text>
                </View>
                <Feather name="arrow-right" size={20} color="#FF6B35" />
              </View>

              <Text className="text-sm text-gray-700 leading-5 mb-3">
                Grow your workforce with qualified industrial talent. Connect
                with pre-screened machine operators, warehouse staff, and
                skilled tradespeople.
              </Text>

              <View className="flex-row flex-wrap gap-2">
                <View className="flex-row items-center bg-white px-3 py-1.5 rounded-full">
                  <Feather name="check" size={12} color="#10B981" />
                  <Text className="text-xs text-gray-700 ml-1">
                    Pre-screened
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-3 py-1.5 rounded-full">
                  <Feather name="check" size={12} color="#10B981" />
                  <Text className="text-xs text-gray-700 ml-1">
                    Fast Hiring
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-3 py-1.5 rounded-full">
                  <Feather name="check" size={12} color="#10B981" />
                  <Text className="text-xs text-gray-700 ml-1">
                    Specialists
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Job Seeker Card */}
            <TouchableOpacity
              onPress={handleEmployerForm}
              activeOpacity={0.8}
              className="bg-blue-50 rounded-2xl p-5 border border-blue-200"
            >
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-[#4A90E2] rounded-xl items-center justify-center mr-3">
                  <MaterialCommunityIcons
                    name="account-hard-hat"
                    size={24}
                    color="black"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    Job Seeker
                  </Text>
                  <Text className="text-xs text-gray-600">
                    For Professionals
                  </Text>
                </View>
                <Feather name="arrow-right" size={20} color="#4A90E2" />
              </View>

              <Text className="text-sm text-gray-700 leading-5 mb-3">
                Launch your career with top manufacturers in your area.
                Production, assembly, and warehouse jobs with competitive pay
                and benefits.
              </Text>

              <View className="flex-row flex-wrap gap-2">
                <View className="flex-row items-center bg-white px-3 py-1.5 rounded-full">
                  <Feather name="check" size={12} color="#10B981" />
                  <Text className="text-xs text-gray-700 ml-1">
                    Top Companies
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-3 py-1.5 rounded-full">
                  <Feather name="check" size={12} color="#10B981" />
                  <Text className="text-xs text-gray-700 ml-1">
                    Good Salary
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-3 py-1.5 rounded-full">
                  <Feather name="check" size={12} color="#10B981" />
                  <Text className="text-xs text-gray-700 ml-1">
                    Career Growth
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Fill the Form Button */}
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
