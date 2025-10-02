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
import { useCreateQuote } from "@/hooks/useCreateQuote";

interface QuoteModalProps {
  visible: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
}

export default function QuoteModal({
  visible,
  onClose,
  productId,
  productTitle,
}: QuoteModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const createQuoteMutation = useCreateQuote();

  const handleSubmit = () => {
    if (!companyName.trim() || !address.trim() || !message.trim()) {
      return;
    }

    createQuoteMutation.mutate(
      {
        productId,
        companyName: companyName.trim(),
        address: address.trim(),
        message: message.trim(),
        additionalInfo: additionalInfo.trim() || undefined,
      },
      {
        onSuccess: () => {
          // Reset form
          setCompanyName("");
          setAddress("");
          setMessage("");
          setAdditionalInfo("");
          // Close modal after a short delay
          setTimeout(() => {
            onClose();
          }, 1500);
        },
      }
    );
  };

  const handleClose = () => {
    if (!createQuoteMutation.isPending) {
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

            <View className="h-4" />
          </View>
        </ScrollView>

        {/* Footer Buttons */}
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
              disabled={
                createQuoteMutation.isPending ||
                !companyName.trim() ||
                !address.trim() ||
                !message.trim()
              }
              className={`flex-1 rounded-xl py-4 items-center justify-center ${
                createQuoteMutation.isPending ||
                !companyName.trim() ||
                !address.trim() ||
                !message.trim()
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
