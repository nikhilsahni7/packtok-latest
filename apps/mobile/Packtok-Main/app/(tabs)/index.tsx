import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800">
            Welcome to Packtok
          </Text>
          <Text className="text-base text-gray-600 mt-2">
            Complete Packaging Solution
          </Text>
        </View>

        {/* Placeholder content - You can customize this */}
        <View className="bg-gray-100 rounded-2xl p-6 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Home Screen
          </Text>
          <Text className="text-gray-600">
            This is your home screen. Add your content here.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
