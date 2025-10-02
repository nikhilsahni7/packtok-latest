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

const servicesData = [
  {
    id: 1,
    title: "Turnkey Projects",
    image: require("@/assets/images/tunkery.png"),
    route: "/services/turnkey-projects",
  },
  {
    id: 2,
    title: "Maintenance",
    image: require("@/assets/images/maintainance.png"),
    route: "/services/maintenance",
  },
  {
    id: 3,
    title: "Consultancy",
    image: require("@/assets/images/consultancy.png"),
    route: "/services/consultancy",
  },
];

export default function ServicesScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header with Logo and Bubbles */}
      <View className="bg-white relative overflow-hidden">
        {/* Background Bubbles */}
        {/* Orange Bubble - Top Left */}
        <Image
          source={require("@/assets/images/bubble 01.png")}
          className="absolute"
          style={{
            top: -width * 0.2,
            left: -width * 0.3,
            width: width * 0.6,
            height: width * 0.6,
            opacity: 0.5,
          }}
          resizeMode="contain"
        />

        {/* Blue Bubble - Below Orange on Left */}
        <Image
          source={require("@/assets/images/bubble 02.png")}
          className="absolute"
          style={{
            top: width * 0.15,
            left: -width * 0.25,
            width: width * 0.55,
            height: width * 0.55,
            opacity: 0.4,
          }}
          resizeMode="contain"
        />

        {/* Header Content */}
        <View className="px-5 pt-12 pb-4 z-10">
          {/* Top Bar with Back Button */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center bg-white/80 rounded-full shadow-sm"
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>

            <View className="flex-row items-center space-x-3">
              {/* Notification Bell */}
              <TouchableOpacity className="relative">
                <Feather name="bell" size={22} color="#000" />
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">2</Text>
                </View>
              </TouchableOpacity>

              {/* Shopping Cart */}
              <TouchableOpacity className="ml-3">
                <Feather name="shopping-cart" size={22} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logo */}
          <View className="items-center mb-3">
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: width * 0.8, height: 150 }}
              resizeMode="contain"
            />
          </View>

          {/* Search Bar */}
          <View className="bg-white rounded-full px-4 py-3 flex-row items-center shadow-sm">
            <Feather name="search" size={18} color="#9CA3AF" />
            <Text className="ml-3 text-gray-400 flex-1">
              Search any Product..
            </Text>
            <Feather name="mic" size={18} color="#9CA3AF" />
          </View>
        </View>
      </View>

      {/* All Services Title */}
      <View className="px-5 py-4">
        <Text className="text-2xl font-bold text-gray-900">All Services</Text>
      </View>

      {/* Services List */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {servicesData.map((service) => (
          <TouchableOpacity
            key={service.id}
            onPress={() => router.push(service.route as any)}
            activeOpacity={0.9}
            className="mb-5"
          >
            <View className="bg-white rounded-3xl overflow-hidden shadow-md">
              <Image
                source={service.image}
                style={{ width: "100%", height: 180 }}
                resizeMode="cover"
              />
              <View className="absolute bottom-0 left-0 right-0 bg-black/40 py-4 px-5">
                <Text className="text-white text-lg font-semibold">
                  {service.title}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Placeholder for more services */}
        <View className="mt-4 mb-6 items-center">
          <Text className="text-gray-500 text-sm">
            More services coming soon
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
