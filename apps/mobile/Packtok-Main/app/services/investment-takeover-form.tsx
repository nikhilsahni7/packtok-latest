import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { TokenStorage } from "@/lib/api";
import { useCompanyAcquisitionSubmission } from "../../hooks/useCompanyAcquisition";
import {
  CompanyAcquisitionFormData,
  companyAcquisitionSchema,
} from "../../schemas/company-acquisition-schema";

// Checkbox Component
const Checkbox = ({
  checked,
  onPress,
  label,
}: {
  checked: boolean;
  onPress: () => void;
  label: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-2"
    activeOpacity={0.7}
  >
    <View
      className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
        checked ? "bg-orange-600 border-orange-600" : "border-gray-400"
      }`}
    >
      {checked && <Feather name="check" size={14} color="#fff" />}
    </View>
    <Text className="text-sm text-gray-700 flex-1">{label}</Text>
  </TouchableOpacity>
);

// Select Component (Picker)
const Select = ({
  value,
  onValueChange,
  placeholder,
  options,
  error,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  error?: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className={`border rounded-lg px-4 py-3 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        activeOpacity={0.7}
      >
        <Text className={value ? "text-gray-900" : "text-gray-400"}>
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-[70%]">
            <View className="p-5 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                {placeholder}
              </Text>
            </View>
            <ScrollView className="p-5">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onValueChange(option.value);
                    setModalVisible(false);
                  }}
                  className="py-3 border-b border-gray-100"
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-base ${
                      value === option.value
                        ? "text-orange-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-5 border-t border-gray-200"
              activeOpacity={0.7}
            >
              <Text className="text-center text-orange-600 font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default function InvestmentTakeoverFormScreen() {
  const router = useRouter();
  const acquisitionSubmission = useCompanyAcquisitionSubmission();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "Please login to submit an investment/takeover inquiry.",
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/login" as any),
            },
            {
              text: "Cancel",
              onPress: () => router.back(),
              style: "cancel",
            },
          ],
        );
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CompanyAcquisitionFormData>({
    resolver: zodResolver(companyAcquisitionSchema),
    defaultValues: {
      advisorsEngaged: [],
      isValued: false,
      hasOngoingLitigation: false,
      hasChangeOfControlClauses: false,
      wantsNda: false,
    },
  });

  const inquirerType = watch("inquirerType");

  const inquirerTypeOptions = [
    { value: "BUYER", label: "Buyer" },
    { value: "SELLER", label: "Seller" },
    { value: "ADVISOR_CONSULTANT", label: "Advisor/Consultant" },
  ];

  const transactionTypeOptions = [
    { value: "ASSET_SALE", label: "Asset Sale" },
    { value: "STOCK_SHARE_SALE", label: "Stock/Share Sale" },
    { value: "MERGER", label: "Merger" },
    { value: "ACQUISITION_TAKEOVER", label: "Acquisition/Takeover" },
    { value: "NOT_SURE", label: "Not Sure" },
  ];

  const legalStructureOptions = [
    { value: "SOLE_PROPRIETORSHIP", label: "Sole Proprietorship" },
    { value: "PARTNERSHIP", label: "Partnership" },
    { value: "PVT_LTD", label: "Private Limited" },
    { value: "PUBLIC", label: "Public" },
    { value: "LLP", label: "LLP" },
    { value: "OTHER", label: "Other" },
  ];

  const onSubmit = async (data: CompanyAcquisitionFormData) => {
    if (!agreeToTerms) {
      Alert.alert(
        "Error",
        "You must agree to the Terms and Conditions to proceed.",
      );
      return;
    }

    try {
      // Transform string values to integers for the API and set defaults
      const transformedData = {
        ...data,
        sellerYearEstablished:
          data.sellerYearEstablished && data.sellerYearEstablished.trim() !== ""
            ? parseInt(data.sellerYearEstablished, 10)
            : undefined,
        advisorsEngaged: data.advisorsEngaged || [],
        isValued: data.isValued ?? false,
        hasOngoingLitigation: data.hasOngoingLitigation ?? false,
        hasChangeOfControlClauses: data.hasChangeOfControlClauses ?? false,
        wantsNda: data.wantsNda ?? false,
      };

      await acquisitionSubmission.mutateAsync(transformedData as any);
      setShowSuccessModal(true);
      reset();
      setAgreeToTerms(false);
    } catch (error: any) {
      let message = "Failed to submit investment/takeover inquiry";

      if (error?.response?.status === 401) {
        message = "Authentication failed. Please login again.";
      } else if (error?.response?.status === 400) {
        message =
          error?.response?.data?.message ||
          "Invalid form data. Please check your inputs.";
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }

      Alert.alert("Submission Error", message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-orange-600 pt-12 pb-6 px-5">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white/20 rounded-full mr-3"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1">
            Investment/Takeover Inquiry
          </Text>
        </View>
        <Text className="text-white/90 text-sm">
          Company acquisition and investment opportunities
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="p-5">
          {/* Section 1: Contact Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 1: Contact Information
            </Text>

            <Controller
              control={control}
              name="contactName"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your name"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.contactName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.contactName && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.contactName.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="companyName"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter company name"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.companyName && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.companyName.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="role"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Your role in the company"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.role && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.role.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="your@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="+1 234 567 8900"
                    keyboardType="phone-pad"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Section 2: Transaction Details */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 2: Transaction Details
            </Text>

            <Controller
              control={control}
              name="inquirerType"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Inquirer Type *
                  </Text>
                  <Select
                    value={value || ""}
                    onValueChange={onChange}
                    placeholder="Select inquirer type"
                    options={inquirerTypeOptions}
                    error={errors.inquirerType?.message}
                  />
                  {errors.inquirerType && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.inquirerType.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="transactionType"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Transaction Type *
                  </Text>
                  <Select
                    value={value || ""}
                    onValueChange={onChange}
                    placeholder="Select transaction type"
                    options={transactionTypeOptions}
                    error={errors.transactionType?.message}
                  />
                  {errors.transactionType && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.transactionType.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="intendedOutcome"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Intended Outcome
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Describe your intended outcome..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />
          </View>

          {/* Section 3: Seller Information (if applicable) */}
          {(inquirerType === "SELLER" ||
            inquirerType === "ADVISOR_CONSULTANT") && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Section 3: Seller Information
              </Text>

              <Controller
                control={control}
                name="sellerBusinessDescription"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Describe the business being sold..."
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="sellerLegalStructure"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Legal Structure
                    </Text>
                    <Select
                      value={value || ""}
                      onValueChange={onChange}
                      placeholder="Select legal structure"
                      options={legalStructureOptions}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="sellerIndustrySector"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Industry Sector
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="e.g., Manufacturing, Technology"
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="sellerYearEstablished"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Year Established
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="e.g., 2010"
                      keyboardType="numeric"
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="sellerAnnualRevenue"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Annual Revenue
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="e.g., $5M"
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="sellerEbitda"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      EBITDA
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="e.g., $1M"
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="sellerKeyAssets"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Key Assets
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="List key assets..."
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />
            </View>
          )}

          {/* Section 4: Buyer Information (if applicable) */}
          {(inquirerType === "BUYER" ||
            inquirerType === "ADVISOR_CONSULTANT") && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Section 4: Buyer Information
              </Text>

              <Controller
                control={control}
                name="buyerPreferredBusinessType"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Preferred Business Type
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Type of business you're looking for..."
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="buyerTargetSize"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Target Size
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="e.g., $1M - $10M revenue"
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="buyerGeographicPreference"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Geographic Preference
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Preferred location..."
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="buyerOwnershipInterest"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Ownership Interest
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="e.g., Majority stake, 100%"
                      className="border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />
            </View>
          )}

          {/* Section 5: Legal & Compliance */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 5: Legal & Compliance
            </Text>

            <Controller
              control={control}
              name="isValued"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Checkbox
                    checked={value || false}
                    onPress={() => onChange(!value)}
                    label="Business has been valued"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="hasOngoingLitigation"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Checkbox
                    checked={value || false}
                    onPress={() => onChange(!value)}
                    label="Has ongoing litigation"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="litigationDetails"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Litigation Details (if applicable)
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Provide details about any litigation..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="hasChangeOfControlClauses"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Checkbox
                    checked={value || false}
                    onPress={() => onChange(!value)}
                    label="Has change of control clauses"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="wantsNda"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Checkbox
                    checked={value || false}
                    onPress={() => onChange(!value)}
                    label="Wants NDA (Non-Disclosure Agreement)"
                  />
                </View>
              )}
            />
          </View>

          {/* Section 6: Additional Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 6: Additional Information
            </Text>

            <Controller
              control={control}
              name="additionalNotes"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Any additional information..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />
          </View>

          {/* Terms & Conditions */}
          <TouchableOpacity
            className="flex-row items-start mb-8 px-2"
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <View
              className={`w-5 h-5 rounded border items-center justify-center mt-0.5 mr-3 ${
                agreeToTerms
                  ? "bg-orange-600 border-orange-600"
                  : "bg-white border-gray-300"
              }`}
            >
              {agreeToTerms && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-sm text-gray-600 flex-1 leading-5">
              I agree to the Terms & Conditions and Privacy Policy. I confirm
              that the information provided is accurate.
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={acquisitionSubmission.isPending}
            className={`rounded-full py-4 items-center shadow-lg ${
              acquisitionSubmission.isPending ? "bg-gray-400" : "bg-orange-600"
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {acquisitionSubmission.isPending
                ? "Submitting..."
                : "Submit Inquiry"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-5">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
                <Feather name="check" size={32} color="#10B981" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Success!
              </Text>
              <Text className="text-sm text-gray-600 text-center">
                Your investment/takeover inquiry has been submitted
                successfully. We&apos;ll get back to you soon.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
              className="bg-orange-600 rounded-full py-3 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
