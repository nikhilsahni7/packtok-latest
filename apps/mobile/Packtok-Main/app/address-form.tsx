import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CreateAddressPayload,
  useAddressDetails,
  useCreateAddress,
  useUpdateAddress,
} from "../hooks/useAddresses";

export default function AddressFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;

  const { data: address, isLoading: isFetchingAddress } = useAddressDetails(
    id || ""
  );
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress(
    id || ""
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateAddressPayload>({
    defaultValues: {
      label: "",
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "IN",
      landmark: "",
      isDefault: false,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (address && isEditMode) {
      setValue("label", address.label);
      setValue("fullName", address.fullName);
      setValue("phoneNumber", address.phoneNumber);
      setValue("addressLine1", address.addressLine1);
      setValue("addressLine2", address.addressLine2 || "");
      setValue("city", address.city);
      setValue("state", address.state);
      setValue("postalCode", address.postalCode);
      setValue("country", address.country);
      setValue("landmark", address.landmark || "");
      setValue("isDefault", address.isDefault);
    }
  }, [address, isEditMode, setValue]);

  const onSubmit = (data: CreateAddressPayload) => {
    if (isEditMode) {
      updateAddress(data, {
        onSuccess: () => {
          router.back();
        },
      });
    } else {
      createAddress(data, {
        onSuccess: () => {
          router.back();
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  if (isEditMode && isFetchingAddress) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF8C42" />
          <Text className="text-gray-500 mt-4">Loading address...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text className="text-xl font-bold text-gray-900">
          {isEditMode ? "Edit Address" : "Add New Address"}
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        {/* Label */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Address Label *
          </Text>
          <Controller
            control={control}
            name="label"
            rules={{ required: "Label is required" }}
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-2">
                {["Home", "Office", "Other"].map((label) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() => onChange(label)}
                    className={`flex-1 py-3 rounded-xl border ${
                      value === label
                        ? "bg-[#FF8C42] border-[#FF8C42]"
                        : "bg-white border-gray-300"
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        value === label ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.label && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.label.message}
            </Text>
          )}
        </View>

        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </Text>
          <Controller
            control={control}
            name="fullName"
            rules={{ required: "Full name is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Enter full name"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
          {errors.fullName && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.fullName.message}
            </Text>
          )}
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </Text>
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Enter 10-digit phone number"
                keyboardType="phone-pad"
                maxLength={10}
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
          {errors.phoneNumber && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.phoneNumber.message}
            </Text>
          )}
        </View>

        {/* Address Line 1 */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Address Line 1 *
          </Text>
          <Controller
            control={control}
            name="addressLine1"
            rules={{ required: "Address is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="House No., Building Name"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
          {errors.addressLine1 && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.addressLine1.message}
            </Text>
          )}
        </View>

        {/* Address Line 2 */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Address Line 2
          </Text>
          <Controller
            control={control}
            name="addressLine2"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Road Name, Area, Colony"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
        </View>

        {/* City and State */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              City *
            </Text>
            <Controller
              control={control}
              name="city"
              rules={{ required: "City is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="City"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
            {errors.city && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.city.message}
              </Text>
            )}
          </View>

          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              State *
            </Text>
            <Controller
              control={control}
              name="state"
              rules={{ required: "State is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="State"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
            {errors.state && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.state.message}
              </Text>
            )}
          </View>
        </View>

        {/* Postal Code */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Postal Code *
          </Text>
          <Controller
            control={control}
            name="postalCode"
            rules={{
              required: "Postal code is required",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Please enter a valid 6-digit postal code",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Enter 6-digit postal code"
                keyboardType="number-pad"
                maxLength={6}
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
          {errors.postalCode && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.postalCode.message}
            </Text>
          )}
        </View>

        {/* Landmark */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Landmark (Optional)
          </Text>
          <Controller
            control={control}
            name="landmark"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Nearby landmark"
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
        </View>

        {/* Set as Default */}
        <View className="mb-6">
          <Controller
            control={control}
            name="isDefault"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                onPress={() => onChange(!value)}
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <View
                  className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
                    value ? "bg-[#FF8C42] border-[#FF8C42]" : "border-gray-300"
                  }`}
                >
                  {value && <Feather name="check" size={16} color="#FFF" />}
                </View>
                <Text className="text-sm text-gray-700">
                  Set as default address
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          className="bg-[#FF8C42] py-4 rounded-xl mb-6"
          activeOpacity={0.7}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-center text-base">
              {isEditMode ? "Update Address" : "Save Address"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
