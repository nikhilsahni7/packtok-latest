import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Notifications</Text>
        </View>
        {/* Settings icon for notification preferences */}
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Feather name="settings" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="px-5 py-4 flex-row gap-2 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "all" ? "bg-[#FF8C42]" : "bg-gray-100"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "all" ? "text-white" : "text-gray-600"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("unread")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "unread" ? "bg-[#FF8C42]" : "bg-gray-100"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "unread" ? "text-white" : "text-gray-600"
            }`}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Empty State */}
        <View className="flex-1 items-center justify-center px-5 py-20">
          <View className="w-24 h-24 rounded-full bg-blue-50 items-center justify-center mb-6">
            <Feather name="bell" size={48} color="#3B82F6" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-3">
            No Notifications
          </Text>
          <Text className="text-base text-gray-500 text-center mb-8 leading-6">
            {activeTab === "all"
              ? "You're all caught up!\nWe'll notify you when there's something new."
              : "You have no unread notifications.\nCheck back later for updates."}
          </Text>

          {/* Coming Soon Badge */}
          <View className="bg-purple-50 px-6 py-3 rounded-full border border-purple-200">
            <Text className="text-purple-700 font-semibold">
              🔔 Coming Soon
            </Text>
          </View>

          {/* Features Preview */}
          <View className="w-full mt-12 space-y-4">
            <View className="flex-row items-start bg-gray-50 rounded-2xl p-4">
              <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-4">
                <Feather name="shopping-bag" size={20} color="#FF8C42" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Order Updates
                </Text>
                <Text className="text-sm text-gray-600">
                  Get notified about order confirmations, shipping, and delivery
                </Text>
              </View>
            </View>

            <View className="flex-row items-start bg-gray-50 rounded-2xl p-4">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-4">
                <Feather name="tag" size={20} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Price Alerts
                </Text>
                <Text className="text-sm text-gray-600">
                  Be the first to know about price drops and special offers
                </Text>
              </View>
            </View>

            <View className="flex-row items-start bg-gray-50 rounded-2xl p-4">
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-4">
                <Feather name="file-text" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Quote & Service Updates
                </Text>
                <Text className="text-sm text-gray-600">
                  Stay updated on your quote requests and service applications
                </Text>
              </View>
            </View>

            <View className="flex-row items-start bg-gray-50 rounded-2xl p-4">
              <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center mr-4">
                <Feather name="zap" size={20} color="#EAB308" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Auction Alerts
                </Text>
                <Text className="text-sm text-gray-600">
                  Real-time notifications when you&apos;re outbid or win an
                  auction
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
