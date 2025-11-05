import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrdersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">My Orders</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Empty State */}
        <View className="flex-1 items-center justify-center px-5 py-20">
          <View className="w-24 h-24 rounded-full bg-orange-50 items-center justify-center mb-6">
            <Feather name="package" size={48} color="#FF8C42" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-3">
            No Orders Yet
          </Text>
          <Text className="text-base text-gray-500 text-center mb-8 leading-6">
            When you place orders, they will appear here.{"\n"}
            You can track your orders and view order history.
          </Text>

          {/* Coming Soon Badge */}
          <View className="bg-blue-50 px-6 py-3 rounded-full border border-blue-200">
            <Text className="text-blue-700 font-semibold">🚀 Coming Soon</Text>
          </View>

          {/* Features Preview */}
          <View className="w-full mt-12 space-y-4">
            <View className="flex-row items-start bg-gray-50 rounded-2xl p-4">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-4">
                <Feather name="check-circle" size={20} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Order Tracking
                </Text>
                <Text className="text-sm text-gray-600">
                  Track your orders in real-time from placement to delivery
                </Text>
              </View>
            </View>

            <View className="flex-row items-start bg-gray-50 rounded-2xl p-4">
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-4">
                <Feather name="clock" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Order History
                </Text>
                <Text className="text-sm text-gray-600">
                  View all your past orders and reorder with one tap
                </Text>
              </View>
            </View>

            <View className="flex-row items-start bg-gray-50 rounded-2xl p-4">
              <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-4">
                <Feather name="file-text" size={20} color="#A855F7" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Invoices & Returns
                </Text>
                <Text className="text-sm text-gray-600">
                  Download invoices and manage returns easily
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
