import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCreateAddress } from "@/hooks/useAddresses";

interface AddAddressModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddAddressModal({
  visible,
  onClose,
}: AddAddressModalProps) {
  const [label, setLabel] = useState("Home");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [landmark, setLandmark] = useState("");

  const createAddressMutation = useCreateAddress();

  const isFormValid =
    label.trim() &&
    fullName.trim() &&
    phoneNumber.trim() &&
    addressLine1.trim() &&
    city.trim() &&
    state.trim() &&
    postalCode.trim();

  const handleSubmit = () => {
    if (!isFormValid) return;

    createAddressMutation.mutate(
      {
        label: label.trim(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: "IN",
        landmark: landmark.trim() || undefined,
        isDefault: true, // Make first/new address default for ease
      },
      {
        onSuccess: () => {
          // Reset form
          setLabel("Home");
          setFullName("");
          setPhoneNumber("");
          setAddressLine1("");
          setAddressLine2("");
          setCity("");
          setState("");
          setPostalCode("");
          setLandmark("");
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Add New Address</Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 items-center justify-center bg-gray-100 rounded-full"
          >
            <Feather name="x" size={18} color="#111827" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4 space-y-4" keyboardShouldPersistTaps="handled">
          <View>
            <Text className="text-gray-700 font-semibold mb-1">Label (e.g. Home, Office) *</Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="Home"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-semibold mb-1">Full Name *</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-semibold mb-1">Phone Number *</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+91 9876543210"
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-semibold mb-1">Address Line 1 *</Text>
            <TextInput
              value={addressLine1}
              onChangeText={setAddressLine1}
              placeholder="Street address, P.O. box, company name"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-semibold mb-1">Address Line 2 (Optional)</Text>
            <TextInput
              value={addressLine2}
              onChangeText={setAddressLine2}
              placeholder="Apartment, suite, unit, building, floor, etc."
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-gray-700 font-semibold mb-1">City *</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="City"
                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 font-semibold mb-1">State *</Text>
              <TextInput
                value={state}
                onChangeText={setState}
                placeholder="State"
                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              />
            </View>
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-gray-700 font-semibold mb-1">Postal Code *</Text>
              <TextInput
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="123456"
                keyboardType="numeric"
                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 font-semibold mb-1">Landmark (Optional)</Text>
              <TextInput
                value={landmark}
                onChangeText={setLandmark}
                placeholder="Near the park"
                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              />
            </View>
          </View>

          <View className="h-10" />
        </ScrollView>

        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormValid || createAddressMutation.isPending}
            className={`py-4 rounded-xl items-center justify-center ${
              !isFormValid || createAddressMutation.isPending
                ? "bg-gray-300"
                : "bg-orange-500"
            }`}
          >
            {createAddressMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Save Address</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
