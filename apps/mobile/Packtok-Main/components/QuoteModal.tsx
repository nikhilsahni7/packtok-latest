import { useCreateQuote } from "@/hooks/useCreateQuote";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

interface QuoteModalProps {
  visible: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
}

// Validation helpers
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidPhone = (phone: string) => {
  const digits = phone.replace(/[\s\-\(\)\+]/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^\d+$/.test(digits);
};

export default function QuoteModal({
  visible,
  onClose,
  productId,
  productTitle,
}: QuoteModalProps) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    phoneNo?: string;
    email?: string;
  }>({});

  const createQuoteMutation = useCreateQuote();

  const validate = (): boolean => {
    const newErrors: { phoneNo?: string; email?: string } = {};

    if (phoneNo.trim() && !isValidPhone(phoneNo)) {
      newErrors.phoneNo = "Enter a valid phone number (7-15 digits)";
    }

    if (email.trim() && !isValidEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    companyName.trim() &&
    phoneNo.trim() &&
    email.trim() &&
    address.trim() &&
    message.trim() &&
    agreeToTerms;

  const handleSubmit = () => {
    if (!isFormValid || !validate()) return;

    createQuoteMutation.mutate(
      {
        productId,
        companyName: companyName.trim(),
        PhoneNo: phoneNo.trim(),
        Email: email.trim().toLowerCase(),
        address: address.trim(),
        message: message.trim(),
        additionalInfo: additionalInfo.trim() || undefined,
      },
      {
        onSuccess: () => {
          setCompanyName("");
          setPhoneNo("");
          setEmail("");
          setAddress("");
          setMessage("");
          setAdditionalInfo("");
          setAgreeToTerms(false);
          setErrors({});
          setTimeout(() => onClose(), 1500);
        },
      },
    );
  };

  const handleClose = () => {
    if (!createQuoteMutation.isPending) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 pt-12 pb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              Request Quote
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              disabled={createQuoteMutation.isPending}
              className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full"
            >
              <Feather name="x" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="p-4 space-y-4">
            {/* Product Info */}
            <View className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <Text className="text-xs text-orange-600 font-semibold mb-1">
                PRODUCT
              </Text>
              <Text className="text-gray-900 font-semibold text-base">
                {productTitle}
              </Text>
            </View>

            {/* Company Name */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Company Name *
              </Text>
              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Enter your company name"
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base"
                editable={!createQuoteMutation.isPending}
              />
            </View>

            {/* Phone Number */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Phone No. *
              </Text>
              <TextInput
                value={phoneNo}
                onChangeText={(text) => {
                  setPhoneNo(text);
                  if (errors.phoneNo)
                    setErrors((e) => ({ ...e, phoneNo: undefined }));
                }}
                placeholder="Your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                className={`bg-gray-50 border rounded-xl px-4 py-3 text-gray-900 text-base ${
                  errors.phoneNo ? "border-red-400" : "border-gray-200"
                }`}
                editable={!createQuoteMutation.isPending}
              />
              {errors.phoneNo && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.phoneNo}
                </Text>
              )}
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Email *
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email)
                    setErrors((e) => ({ ...e, email: undefined }));
                }}
                placeholder="Your email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                className={`bg-gray-50 border rounded-xl px-4 py-3 text-gray-900 text-base ${
                  errors.email ? "border-red-400" : "border-gray-200"
                }`}
                editable={!createQuoteMutation.isPending}
              />
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Address */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Address *
              </Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your business address"
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base"
                editable={!createQuoteMutation.isPending}
              />
            </View>

            {/* Message */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Message *
              </Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Describe your requirements, quantity needed, timeline, etc."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base min-h-[100px]"
                editable={!createQuoteMutation.isPending}
              />
            </View>

            {/* Additional Info */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Additional Information
              </Text>
              <TextInput
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                placeholder="Any additional details, special requirements, etc."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base min-h-[80px]"
                editable={!createQuoteMutation.isPending}
              />
            </View>

            {/* Terms & Conditions */}
            <TouchableOpacity
              className="flex-row items-start mb-2 mt-4 px-1"
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              disabled={createQuoteMutation.isPending}
            >
              <View
                className={`w-5 h-5 rounded border items-center justify-center mr-3 mt-0.5 ${
                  agreeToTerms
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {agreeToTerms && (
                  <Feather name="check" size={14} color="white" />
                )}
              </View>
              <Text className="text-sm text-gray-600 flex-1 leading-5">
                I agree to the{" "}
                <Text
                  className="text-orange-600 underline"
                  onPress={() => router.push("/terms-conditions" as any)}
                >
                  Terms & Conditions
                </Text>{" "}
                and{" "}
                <Text
                  className="text-orange-600 underline"
                  onPress={() => router.push("/privacy-policy" as any)}
                >
                  Privacy Policy
                </Text>
                . I confirm that the information provided is accurate.
              </Text>
            </TouchableOpacity>

            <View className="h-4" />
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={handleClose}
              disabled={createQuoteMutation.isPending}
              className="flex-1 bg-gray-100 rounded-xl py-4 items-center justify-center"
            >
              <Text className="text-gray-700 font-bold text-base">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={createQuoteMutation.isPending || !isFormValid}
              className={`flex-1 rounded-xl py-4 items-center justify-center ${
                createQuoteMutation.isPending || !isFormValid
                  ? "bg-gray-300"
                  : "bg-orange-500"
              }`}
            >
              {createQuoteMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Send Quote
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
