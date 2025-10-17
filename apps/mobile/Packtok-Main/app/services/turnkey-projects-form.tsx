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
import { useTurnkeyProjectSubmission } from "../../hooks/useTurnkeyProject";
import { TokenStorage } from "../../lib/api";
import {
  TurnkeyProjectFormData,
  turnkeyProjectSchema,
} from "../../schemas/turnkey-project-schema";

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
        checked ? "bg-purple-600 border-purple-600" : "border-gray-400"
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
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">{placeholder}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-4">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onValueChange(option.value);
                    setModalVisible(false);
                  }}
                  className={`p-4 rounded-lg mb-2 ${
                    value === option.value ? "bg-purple-100" : "bg-gray-50"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-base ${
                      value === option.value
                        ? "text-purple-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default function TurnkeyProjectFormScreen() {
  const router = useRouter();
  const turnkeySubmission = useTurnkeyProjectSubmission();
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "Please login to submit a turnkey project inquiry.",
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
          ]
        );
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TurnkeyProjectFormData>({
    resolver: zodResolver(turnkeyProjectSchema),
    defaultValues: {
      utilitiesAvailable: false,
      requiresOngoingSupport: false,
      interestedInFutureUpgrades: false,
    },
  });

  const industryOptions = [
    { value: "MANUFACTURING", label: "Manufacturing" },
    { value: "AUTOMOTIVE", label: "Automotive" },
    { value: "FOOD_PROCESSING", label: "Food Processing" },
    { value: "PHARMACEUTICALS", label: "Pharmaceuticals" },
    { value: "AGRICULTURE", label: "Agriculture" },
    { value: "CHEMICALS", label: "Chemicals" },
    { value: "PETROCHEMICALS", label: "Petrochemicals" },
    { value: "TEXTILE", label: "Textile" },
    { value: "PLASTICS_PACKAGING", label: "Plastics & Packaging" },
    { value: "ELECTRONICS", label: "Electronics" },
    { value: "OTHER", label: "Other" },
  ];

  const serviceOptions = [
    { value: "FEASIBILITY_STUDY", label: "Feasibility Study" },
    { value: "PLANT_DESIGN_ENGINEERING", label: "Plant Design & Engineering" },
    { value: "EQUIPMENT_PROCUREMENT", label: "Equipment Procurement" },
    { value: "MACHINERY_INSTALLATION", label: "Machinery Installation" },
    {
      value: "AUTOMATION_SOFTWARE_INTEGRATION",
      label: "Automation & Software Integration",
    },
    { value: "PROCESS_OPTIMIZATION", label: "Process Optimization" },
    { value: "EMPLOYEE_TRAINING", label: "Employee Training" },
    {
      value: "MAINTENANCE_AFTER_SALES_SUPPORT",
      label: "Maintenance & After-Sales Support",
    },
    {
      value: "REGULATORY_COMPLIANCE_SETUP",
      label: "Regulatory Compliance Setup",
    },
    { value: "OTHER", label: "Other" },
  ];

  const handleIndustryToggle = (industryValue: string) => {
    let updatedIndustries;
    if (selectedIndustries.includes(industryValue)) {
      updatedIndustries = selectedIndustries.filter((i) => i !== industryValue);
    } else {
      updatedIndustries = [...selectedIndustries, industryValue];
    }
    setSelectedIndustries(updatedIndustries);
    setValue("industry", updatedIndustries as any);
  };

  const handleServiceToggle = (serviceValue: string) => {
    let updatedServices;
    if (selectedServices.includes(serviceValue)) {
      updatedServices = selectedServices.filter((s) => s !== serviceValue);
    } else {
      updatedServices = [...selectedServices, serviceValue];
    }
    setSelectedServices(updatedServices);
    setValue("servicesNeeded", updatedServices as any);
  };

  const onSubmit = async (data: TurnkeyProjectFormData) => {
    try {
      console.log("📝 Form data:", data);
      await turnkeySubmission.mutateAsync(data);
      setShowSuccessModal(true);
      reset();
      setSelectedIndustries([]);
      setSelectedServices([]);
    } catch (error: any) {
      console.error("Form submission error:", error);
      let message = "Failed to submit turnkey project request";

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
      <View className="bg-purple-600 pt-12 pb-6 px-5">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white/20 rounded-full mr-3"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1">
            Turnkey Project Inquiry
          </Text>
        </View>
        <Text className="text-white/90 text-sm">
          For corrugated and packaging industry
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

            <Controller
              control={control}
              name="website"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="https://www.yourcompany.com"
                    keyboardType="url"
                    autoCapitalize="none"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />
          </View>

          {/* Section 2: Industry & Project Details */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 2: Industry & Project Details
            </Text>

            <Text className="text-sm font-medium text-gray-700 mb-3">
              Industry Type * (Select all that apply)
            </Text>
            {industryOptions.map((industry) => (
              <Checkbox
                key={industry.value}
                checked={selectedIndustries.includes(industry.value)}
                onPress={() => handleIndustryToggle(industry.value)}
                label={industry.label}
              />
            ))}
            {errors.industry && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.industry.message}
              </Text>
            )}

            <Controller
              control={control}
              name="facilityType"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4 mt-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Facility Type *
                  </Text>
                  <Select
                    value={value || ""}
                    onValueChange={onChange}
                    placeholder="Select facility type"
                    options={[
                      {
                        value: "NEW_PRODUCTION_PLANT",
                        label: "New Production Plant",
                      },
                      {
                        value: "EXPANSION_OF_EXISTING_FACILITY",
                        label: "Expansion of Existing Facility",
                      },
                      {
                        value: "MODERNIZATION_AUTOMATION",
                        label: "Modernization/Automation",
                      },
                      { value: "OTHER", label: "Other" },
                    ]}
                    error={errors.facilityType?.message}
                  />
                  {errors.facilityType && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.facilityType.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="targetProductionCapacity"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Target Production Capacity *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., 1000 units/day"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.targetProductionCapacity
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.targetProductionCapacity && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.targetProductionCapacity.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="projectDescription"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Project Description * (Min 50 characters)
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Describe your turnkey project requirements..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.projectDescription
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.projectDescription && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.projectDescription.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Section 3: Timeline & Budget */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 3: Timeline & Budget
            </Text>

            <Controller
              control={control}
              name="completionTimeline"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Completion Timeline *
                  </Text>
                  <Select
                    value={value || ""}
                    onValueChange={onChange}
                    placeholder="Select timeline"
                    options={[
                      { value: "MONTHS_0_6", label: "0-6 Months" },
                      { value: "MONTHS_6_12", label: "6-12 Months" },
                      { value: "YEARS_1_2", label: "1-2 Years" },
                      {
                        value: "FLEXIBLE_TO_BE_DISCUSSED",
                        label: "Flexible (To be discussed)",
                      },
                    ]}
                    error={errors.completionTimeline?.message}
                  />
                  {errors.completionTimeline && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.completionTimeline.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="estimatedBudget"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Estimated Budget *
                  </Text>
                  <Select
                    value={value || ""}
                    onValueChange={onChange}
                    placeholder="Select budget range"
                    options={[
                      { value: "UNDER_1M", label: "Under $1M" },
                      { value: "M1_5", label: "$1M - $5M" },
                      { value: "M5_10", label: "$5M - $10M" },
                      { value: "OVER_10M", label: "Over $10M" },
                      { value: "TO_BE_DISCUSSED", label: "To be discussed" },
                    ]}
                    error={errors.estimatedBudget?.message}
                  />
                  {errors.estimatedBudget && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.estimatedBudget.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="fundingStatus"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Funding Status *
                  </Text>
                  <Select
                    value={value || ""}
                    onValueChange={onChange}
                    placeholder="Select funding status"
                    options={[
                      { value: "FULLY_FUNDED", label: "Fully Funded" },
                      { value: "PARTIALLY_FUNDED", label: "Partially Funded" },
                      {
                        value: "SEEKING_FINANCING",
                        label: "Seeking Financing",
                      },
                      { value: "OTHER", label: "Other" },
                    ]}
                    error={errors.fundingStatus?.message}
                  />
                  {errors.fundingStatus && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.fundingStatus.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="siteAvailableStatus"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Site Available Status *
                  </Text>
                  <Select
                    value={value || ""}
                    onValueChange={onChange}
                    placeholder="Select site status"
                    options={[
                      { value: "YES", label: "Yes" },
                      { value: "NO", label: "No" },
                      { value: "IN_PLANNING", label: "In Planning" },
                    ]}
                    error={errors.siteAvailableStatus?.message}
                  />
                  {errors.siteAvailableStatus && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.siteAvailableStatus.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Section 4: Services Needed */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 4: Services Needed
            </Text>
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Select all that apply *
            </Text>
            {serviceOptions.map((service) => (
              <Checkbox
                key={service.value}
                checked={selectedServices.includes(service.value)}
                onPress={() => handleServiceToggle(service.value)}
                label={service.label}
              />
            ))}
            {errors.servicesNeeded && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.servicesNeeded.message}
              </Text>
            )}
          </View>

          {/* Section 5: Additional Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 5: Additional Information
            </Text>

            <Controller
              control={control}
              name="powerSupplyAvailable"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Power Supply Available
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., 440V, 3-phase"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="utilitiesAvailable"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Checkbox
                    checked={value || false}
                    onPress={() => onChange(!value)}
                    label="Utilities Available"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="requiresOngoingSupport"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Checkbox
                    checked={value || false}
                    onPress={() => onChange(!value)}
                    label="Requires Ongoing Support"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="interestedInFutureUpgrades"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Checkbox
                    checked={value || false}
                    onPress={() => onChange(!value)}
                    label="Interested in Future Upgrades"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="machineryPreferences"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Machinery Preferences
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Specific machinery brands or requirements..."
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
              name="specialRequirements"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Any special requirements or considerations..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={turnkeySubmission.isPending}
            className={`rounded-full py-4 items-center shadow-lg ${
              turnkeySubmission.isPending ? "bg-gray-400" : "bg-purple-600"
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {turnkeySubmission.isPending ? "Submitting..." : "Submit Inquiry"}
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
                Your turnkey project inquiry has been submitted successfully.
                We&apos;ll get back to you soon.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
              className="bg-purple-600 rounded-full py-3 items-center"
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
