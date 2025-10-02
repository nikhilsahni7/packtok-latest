import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBackHandler } from "../../hooks/useBackHandler";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/auth-store";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending } = useLogout();

  // Handle Android back button
  useBackHandler("home");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView className="flex-1 px-6 pt-12">
        {/* Header with Logout Button */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-gray-800">
              Welcome to Packtok
            </Text>
            <Text className="text-base text-gray-600 mt-2">
              Complete Packaging Solution
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isPending}
            className="bg-red-500 rounded-xl px-4 py-2 flex-row items-center"
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Feather name="log-out" size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Logout</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        {user && (
          <View className="bg-blue-50 rounded-2xl p-6 mb-4 border border-blue-200">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              User Information
            </Text>
            <View className="space-y-2">
              <View className="flex-row">
                <Text className="text-gray-600 font-medium w-20">Name:</Text>
                <Text className="text-gray-800 flex-1">{user.name}</Text>
              </View>
              <View className="flex-row">
                <Text className="text-gray-600 font-medium w-20">Email:</Text>
                <Text className="text-gray-800 flex-1">{user.email}</Text>
              </View>
              <View className="flex-row">
                <Text className="text-gray-600 font-medium w-20">Role:</Text>
                <Text className="text-gray-800 flex-1">{user.role}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Placeholder content */}
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
