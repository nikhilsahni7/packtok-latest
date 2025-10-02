import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";

export default function CartScreen() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Cart</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Empty State */}
        <View className="flex-1 items-center justify-center px-8 py-20">
          <Feather name="shopping-cart" size={64} color="#E5E7EB" />
          <Text className="text-lg font-semibold text-gray-900 mt-4">
            Your cart is empty
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-2">
            Add items to your cart to get started
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
