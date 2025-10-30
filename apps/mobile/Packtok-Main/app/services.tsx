import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
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

const servicesData = [
  {
    id: 1,
    title: "Consultancy",
    image: require("@/assets/images/Consultancy1.png"),
    route: "/services/turnkey-projects",
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
    title: "Machine Installer",
    image: require("@/assets/images/MachineInstaller.png"),
    route: "/services/consultancy",
    bgColor: "#D4C522",
    icon: require("@/assets/images/arrow.png"),
  },
  {
    id: 4,
    title: "Turnkey",
    image: require("@/assets/images/Turnkey1.png"),
    route: "/services/consultancy",
    bgColor: "#15A41D",
    icon: require("@/assets/images/arrow.png"),
  },

  {
    id: 5,
    title: "Sell",
    image: require("@/assets/images/Sell.png"),
    route: "/services/consultancy",
    bgColor: "#1B96C6",
    icon: require("@/assets/images/arrow.png"),
  },

  {
    id: 6,
    title: "Investment/ Takeover",
    image: require("@/assets/images/InvestmentTakeover.png"),
    route: "/services/consultancy",
    bgColor: "#C61B6E",
    icon: require("@/assets/images/arrow.png"),
  },

];

export default function ServicesScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header with Logo and Bubbles */}
      <View className="px-5 pt-12 pb-6 relative">
        {/* Background Bubbles */}
        {/* Orange Bubble - Top Left */}
        <Image
          source={require("@/assets/images/bubble 01.png")}
          className="absolute z-10"
          style={{
            top: -width * 0.1,
            left: -width * 0.25,
            width: width * 0.7,
            height: width * 0.9,
          }}
          resizeMode="contain"
        />

        {/* Blue Bubble - Top Right */}
        <Image
          source={require("@/assets/images/bubble 02.png")}
          className="absolute"
          style={{
            top: -width * 0.1,
            left: -width * 0.25,
            width: width * 1,
            height: width * 0.9,
          }}
          resizeMode="contain"
        />


        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Menu Icon */}
          <TouchableOpacity className="p-2 relative z-20">
            <Feather
              name="menu"
              size={24}
              color="black"
              style={{ backgroundColor: "white" }}
              className="p-2 rounded-full"
            />
          </TouchableOpacity>

          <Image
            source={require("@/assets/images/logo-removebg.png")}
            style={{ width: 200, height: 100 }}
            resizeMode="contain"
          />

          {/* Right Icons */}
          <View className="flex-row items-center space-x-3">
            {/* Notification Bell with Badge */}
            <TouchableOpacity className="relative">
              <Feather name="bell" size={20} color="black" />
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full text-blac w-4 h-4 items-center justify-center">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
            </TouchableOpacity>

            {/* Shopping Cart */}
            <TouchableOpacity className="ml-3">
              <Feather name="shopping-cart" size={20} color="black" />
            </TouchableOpacity>


          </View>

        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border  rounded-full px-4 py-3 z-10">
          <Feather name="search" size={20} color="#9CA3AF" className="" />
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

      {/* All Services Title */}
      <View className="px-5 relative z-10 py-4">
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
            <View className={`  rounded-xl `}>
              <View style={{ backgroundColor: service.bgColor }} className={` h-[160px] p-5 rounded-xl w-full flex-row col-gap-4   justify-between`} >
                {/* Left Side - Category Name */}
                <View className="w-[65%]">
                  < Text className="text-[30px] mt-4 mb-2 text-white font-medium">{service.title}</Text>
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
    </View>
  );
}
