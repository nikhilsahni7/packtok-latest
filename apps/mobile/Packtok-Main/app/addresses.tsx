import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Address,
  useDeleteAddress,
  useMyAddresses,
  useSetDefaultAddress,
} from "../hooks/useAddresses";

export default function AddressesScreen() {
  const router = useRouter();
  const { data: addresses, isLoading, refetch } = useMyAddresses();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();
  const { mutate: setDefault, isPending: isSettingDefault } =
    useSetDefaultAddress();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDelete = (addressId: string, label: string) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete "${label}" address?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAddress(addressId),
        },
      ]
    );
  };

  const handleSetDefault = (addressId: string) => {
    setDefault(addressId);
  };

  const renderAddressCard = (address: Address) => {
    return (
      <View
        key={address.id}
        className="bg-white border border-gray-200 rounded-2xl p-4 mb-3"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-[#FF8C42]/10 items-center justify-center mr-3">
              <Feather
                name={
                  address.label.toLowerCase() === "home"
                    ? "home"
                    : address.label.toLowerCase() === "office"
                      ? "briefcase"
                      : "map-pin"
                }
                size={20}
                color="#FF8C42"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                {address.label}
              </Text>
              {address.isDefault && (
                <View className="bg-green-100 px-2 py-1 rounded-full mt-1 self-start">
                  <Text className="text-xs font-medium text-green-800">
                    DEFAULT
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/address-form",
                  params: { id: address.id },
                })
              }
              className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center"
              activeOpacity={0.7}
            >
              <Feather name="edit-2" size={16} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(address.id, address.label)}
              disabled={isDeleting}
              className="w-8 h-8 rounded-full bg-red-50 items-center justify-center"
              activeOpacity={0.7}
            >
              <Feather name="trash-2" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View className="mb-3">
          <Text className="text-sm font-semibold text-gray-900 mb-1">
            {address.fullName}
          </Text>
          <Text className="text-sm text-gray-600">{address.phoneNumber}</Text>
        </View>

        {/* Address */}
        <View className="bg-gray-50 rounded-xl p-3 mb-3">
          <Text className="text-sm text-gray-700 leading-5">
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ""}
            {"\n"}
            {address.city}, {address.state} - {address.postalCode}
            {"\n"}
            {address.country}
            {address.landmark ? `\nLandmark: ${address.landmark}` : ""}
          </Text>
        </View>

        {/* Set as Default Button */}
        {!address.isDefault && (
          <TouchableOpacity
            onPress={() => handleSetDefault(address.id)}
            disabled={isSettingDefault}
            className="border border-[#FF8C42] py-2 rounded-xl flex-row items-center justify-center"
            activeOpacity={0.7}
          >
            {isSettingDefault ? (
              <ActivityIndicator size="small" color="#FF8C42" />
            ) : (
              <>
                <Feather name="check-circle" size={16} color="#FF8C42" />
                <Text className="text-[#FF8C42] font-semibold ml-2 text-sm">
                  Set as Default
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
          <Text className="text-xl font-bold text-gray-900">
            Saved Addresses
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/address-form")}
          className="bg-[#FF8C42] px-4 py-2 rounded-xl flex-row items-center"
          activeOpacity={0.7}
        >
          <Feather name="plus" size={18} color="#FFF" />
          <Text className="text-white font-semibold ml-1 text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF8C42"
            colors={["#FF8C42"]}
          />
        }
      >
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#FF8C42" />
            <Text className="text-gray-500 mt-4">Loading addresses...</Text>
          </View>
        ) : addresses && addresses.length > 0 ? (
          <View className="pb-6">{addresses.map(renderAddressCard)}</View>
        ) : (
          <View className="items-center justify-center py-12">
            <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
              <Feather name="map-pin" size={32} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              No Addresses Saved
            </Text>
            <Text className="text-sm text-gray-500 text-center px-8 mb-6">
              Add your shipping addresses for faster checkout
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/address-form")}
              className="bg-[#FF8C42] px-6 py-3 rounded-xl"
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold">
                Add Your First Address
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
