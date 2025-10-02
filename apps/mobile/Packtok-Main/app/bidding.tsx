import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BiddingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-white px-5 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Bidding</Text>
        </View>
      </View>

      {/* Coming Soon Content - Scrollable */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-8 py-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content */}
        <View className="items-center relative">
          {/* Bidding Icon */}
          <View className="w-32 h-32 rounded-full bg-[#FF8C42]/10 items-center justify-center mb-6">
            <Feather name="briefcase" size={64} color="#FF8C42" />
          </View>

          {/* Coming Soon Badge */}
          <View className="bg-[#FF8C42] px-6 py-2 rounded-full mb-4">
            <Text className="text-white font-bold text-sm">COMING SOON</Text>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Bidding Platform
          </Text>

          {/* Description */}
          <Text className="text-base text-gray-600 text-center leading-6 mb-8">
            We&apos;re working hard to bring you an exciting bidding experience.
            Stay tuned for updates!
          </Text>

          {/* Features Preview */}
          <View className="w-full bg-gray-50 rounded-2xl p-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              What to expect:
            </Text>

            <View>
              <View className="flex-row items-start mb-3">
                <View className="w-6 h-6 rounded-full bg-[#FF8C42] items-center justify-center mr-3 mt-0.5">
                  <Feather name="check" size={14} color="white" />
                </View>
                <Text className="flex-1 text-gray-700">
                  Real-time bidding on machinery and equipment
                </Text>
              </View>

              <View className="flex-row items-start mb-3">
                <View className="w-6 h-6 rounded-full bg-[#FF8C42] items-center justify-center mr-3 mt-0.5">
                  <Feather name="check" size={14} color="white" />
                </View>
                <Text className="flex-1 text-gray-700">
                  Competitive pricing and transparent process
                </Text>
              </View>

              <View className="flex-row items-start">
                <View className="w-6 h-6 rounded-full bg-[#FF8C42] items-center justify-center mr-3 mt-0.5">
                  <Feather name="check" size={14} color="white" />
                </View>
                <Text className="flex-1 text-gray-700">
                  Secure transactions and verified sellers
                </Text>
              </View>
            </View>
          </View>

          {/* Notify Me Button */}
          <TouchableOpacity
            className="w-full bg-[#FF8C42] py-4 rounded-full items-center mb-6"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Notify Me When Available
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
