import PageHeader from "@/components/PageHeader";
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
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const servicesData = [
  {
    id: 1,
    title: "Consultancy",
    image: require("@/assets/images/Consultancy1.png"),
    route: "/services/consultancy",
    bgColor: "#AE52EE",
    icon: require("@/assets/images/arrow.png"),
  },
  {
    id: 2,
    title: "Maintenance",
    image: require("@/assets/images/Maintenance.png"),
    route: "/services/maintenance",
    bgColor: "#E58510",
    icon: require("@/assets/images/arrow.png"),
  },
  {
    id: 3,
    title: "Turnkey Projects",
    image: require("@/assets/images/Turnkey.png"),
    route: "/services/turnkey-projects",
    bgColor: "#3B82F6",
    icon: require("@/assets/images/arrow.png"),
  },

  {
    id: 4,
    title: "Investment/ Takeover",
    image: require("@/assets/images/InvestmentTakeover.png"),
    route: "/services/investment-takeover",
    bgColor: "#C61B6E",
    icon: require("@/assets/images/arrow.png"),
  },
  {
    id: 5,
    title: "Sell Old Machine",
    image: require("@/assets/images/Sell.png"),
    route: "/services/sell-old-machine",
    bgColor: "#F59E0B",
    icon: require("@/assets/images/arrow.png"),
  },
  {
    id: 6,
    title: "Machinery Installer",
    image: require("@/assets/images/MachineInstaller.png"),
    route: "/services/machinery-installer",
    bgColor: "#10B981",
    icon: require("@/assets/images/arrow.png"),
  },
];

export default function ServicesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white relative" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Unified Header with bubbles, dynamic cart, notifications, voice search */}
      <PageHeader />

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
            <View className="rounded-xl">
              <View
                style={{ backgroundColor: service.bgColor }}
                className="h-[160px] p-5 rounded-xl w-full flex-row col-gap-4 justify-between"
              >
                {/* Left Side - Category Name */}
                <View className="w-[65%]">
                  <Text className="text-[30px] mt-4 mb-2 text-white font-medium">
                    {service.title}
                  </Text>
                  <Image
                    source={service.icon}
                    style={{ width: 30, height: 30 }}
                    resizeMode="cover"
                    className="rounded-[20px]"
                  />
                </View>

                {/* Right Side - Image */}
                <View className="w-[35%]">
                  <Image
                    source={service.image}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                    className="rounded-[20px]"
                  />
                </View>
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
    </SafeAreaView>
  );
}
