import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PackagingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-white px-5 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 -ml-2"
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Packaging</Text>
          </View>
          <TouchableOpacity className="p-2" activeOpacity={0.7}>
            <Feather name="shopping-cart" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mt-4">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search packaging solutions..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-900"
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Coming Soon Banner */}
        <View className="mx-5 mt-4 mb-4 bg-[#FF8C42]/10 rounded-2xl p-6 border border-[#FF8C42]/20">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-full bg-[#FF8C42] items-center justify-center mr-4">
              <Feather name="package" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                Packaging Solutions
              </Text>
              <Text className="text-sm text-gray-600">
                Complete packaging catalog coming soon
              </Text>
            </View>
          </View>
        </View>

        {/* Categories Preview */}
        <View className="px-5 mt-2">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Packaging Categories
          </Text>

          {/* Category Cards */}
          <View className="space-y-3">
            {/* Corrugated Boxes */}
            <TouchableOpacity
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex-row"
              activeOpacity={0.7}
            >
              <View className="w-24 h-24 bg-gray-100 items-center justify-center">
                <Feather name="box" size={32} color="#FF8C42" />
              </View>
              <View className="flex-1 p-4 justify-center">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Corrugated Boxes
                </Text>
                <Text className="text-sm text-gray-600">
                  Custom sizes and designs
                </Text>
              </View>
              <View className="items-center justify-center px-4">
                <View className="bg-yellow-100 px-3 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-yellow-700">
                    Soon
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Plastic Packaging */}
            <TouchableOpacity
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex-row"
              activeOpacity={0.7}
            >
              <View className="w-24 h-24 bg-gray-100 items-center justify-center">
                <Feather name="layers" size={32} color="#FF8C42" />
              </View>
              <View className="flex-1 p-4 justify-center">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Plastic Packaging
                </Text>
                <Text className="text-sm text-gray-600">
                  Flexible and rigid options
                </Text>
              </View>
              <View className="items-center justify-center px-4">
                <View className="bg-yellow-100 px-3 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-yellow-700">
                    Soon
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Industrial Packaging */}
            <TouchableOpacity
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex-row"
              activeOpacity={0.7}
            >
              <View className="w-24 h-24 bg-gray-100 items-center justify-center">
                <Feather name="archive" size={32} color="#FF8C42" />
              </View>
              <View className="flex-1 p-4 justify-center">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Industrial Packaging
                </Text>
                <Text className="text-sm text-gray-600">
                  Heavy-duty solutions
                </Text>
              </View>
              <View className="items-center justify-center px-4">
                <View className="bg-yellow-100 px-3 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-yellow-700">
                    Soon
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Labels & Tapes */}
            <TouchableOpacity
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex-row"
              activeOpacity={0.7}
            >
              <View className="w-24 h-24 bg-gray-100 items-center justify-center">
                <Feather name="tag" size={32} color="#FF8C42" />
              </View>
              <View className="flex-1 p-4 justify-center">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Labels & Tapes
                </Text>
                <Text className="text-sm text-gray-600">
                  Adhesive solutions
                </Text>
              </View>
              <View className="items-center justify-center px-4">
                <View className="bg-yellow-100 px-3 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-yellow-700">
                    Soon
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View className="mx-5 mt-6 mb-6 bg-gray-50 rounded-2xl p-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Why Choose Our Packaging Solutions?
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-[#FF8C42] items-center justify-center mr-3 mt-0.5">
                <Feather name="check" size={14} color="white" />
              </View>
              <Text className="flex-1 text-gray-700">
                Wide range of customizable options
              </Text>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-[#FF8C42] items-center justify-center mr-3 mt-0.5">
                <Feather name="check" size={14} color="white" />
              </View>
              <Text className="flex-1 text-gray-700">
                Eco-friendly and sustainable materials
              </Text>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-[#FF8C42] items-center justify-center mr-3 mt-0.5">
                <Feather name="check" size={14} color="white" />
              </View>
              <Text className="flex-1 text-gray-700">
                Bulk ordering with competitive pricing
              </Text>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-[#FF8C42] items-center justify-center mr-3 mt-0.5">
                <Feather name="check" size={14} color="white" />
              </View>
              <Text className="flex-1 text-gray-700">
                Fast delivery and reliable service
              </Text>
            </View>
          </View>
        </View>

        {/* Contact CTA */}
        <View className="mx-5 mb-8">
          <TouchableOpacity
            className="bg-[#FF8C42] py-4 rounded-full items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Get Notified When Available
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
