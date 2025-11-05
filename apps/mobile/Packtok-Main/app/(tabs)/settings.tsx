import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/auth-store";

export default function SettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending } = useLogout();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
      </View>

      <ScrollView className="flex-1">
        {/* User Profile Section */}
        {user && (
          <View className="px-5 py-6 border-b border-gray-200">
            <View className="flex-row items-center">
              {user.profile_image ? (
                <Image
                  source={{ uri: user.profile_image }}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-[#FF8C42] items-center justify-center">
                  <Text className="text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {user.name}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">{user.email}</Text>
                <Text className="text-xs text-gray-500 mt-1 capitalize">
                  {user.role}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Settings Options */}
        <View className="px-5 py-4">
          {/* Profile */}
          <TouchableOpacity
            onPress={() => router.push("/profile-edit")}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Feather name="user" size={20} color="#374151" />
              <Text className="text-base text-gray-900 ml-3">Profile</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Feather name="bell" size={20} color="#374151" />
              <Text className="text-base text-gray-900 ml-3">
                Notifications
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Orders */}
          <TouchableOpacity
            onPress={() => router.push("/orders")}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Feather name="package" size={20} color="#374151" />
              <Text className="text-base text-gray-900 ml-3">My Orders</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Service Form History */}
          <TouchableOpacity
            onPress={() => router.push("/service-history")}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Feather name="clipboard" size={20} color="#374151" />
              <Text className="text-base text-gray-900 ml-3">
                Service Form History
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Quote Requests */}
          <TouchableOpacity
            onPress={() => router.push("/quote-history")}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Feather name="file-text" size={20} color="#374151" />
              <Text className="text-base text-gray-900 ml-3">
                Quote Requests
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Address */}
          <TouchableOpacity
            onPress={() => router.push("/addresses")}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Feather name="map-pin" size={20} color="#374151" />
              <Text className="text-base text-gray-900 ml-3">
                Saved Addresses
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            onPress={() => router.push("/help-support")}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Feather name="help-circle" size={20} color="#374151" />
              <Text className="text-base text-gray-900 ml-3">
                Help & Support
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity
            onPress={() => router.push("/about")}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Feather name="info" size={20} color="#374151" />
              <Text className="text-base text-gray-900 ml-3">About</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isPending}
            className="flex-row items-center justify-center py-4 bg-red-500 rounded-2xl mt-6"
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Feather name="log-out" size={20} color="white" />
                <Text className="text-white font-semibold ml-2 text-base">
                  Logout
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            {/* Modal Content */}
            <View className="p-6 items-center">
              {/* Icon */}
              <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-4">
                <Feather name="log-out" size={36} color="#EF4444" />
              </View>

              {/* Text */}
              <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                You are going to Log Out
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-6">
                your account
              </Text>

              {/* Buttons */}
              <View className="flex-row gap-3 w-full">
                <TouchableOpacity
                  onPress={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-black rounded-xl"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmLogout}
                  className="flex-1 py-3 bg-[#EF4444] rounded-xl"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-center">
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
