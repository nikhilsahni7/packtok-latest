import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { useConsultancySubmission } from "../../hooks/useConsultancy";
import {
  ConsultancyFormData,
  consultancySchema,
} from "../../schemas/consultancy-schema";

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
        checked ? "bg-blue-600 border-blue-600" : "border-gray-400"
      }`}
    >
      {checked && <Feather name="check" size={14} color="#fff" />}
    </View>
    <Text className="text-sm text-gray-700 flex-1">{label}</Text>
  </TouchableOpacity>
);

// DatePicker Component
const DatePickerInput = ({
  value,
  onChange,
  placeholder,
  label,
  error,
}: {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder: string;
  label: string;
  error?: string;
}) => {
  const [show, setShow] = useState(false);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-gray-700">{label}</Text>
        {value && (
          <TouchableOpacity onPress={() => onChange(undefined)}>
            <Text className="text-sm text-blue-600">Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={() => setShow(true)}
        className={`border rounded-lg px-4 py-3 flex-row justify-between items-center ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        activeOpacity={0.7}
      >
        <Text className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Feather
          name="calendar"
          size={20}
          color={value ? "#1f2937" : "#9ca3af"}
        />
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

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
                        ? "text-blue-600 font-semibold"
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
              <Text className="text-center text-blue-600 font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default function ConsultancyFormScreen() {
  const router = useRouter();
  const consultancySubmission = useConsultancySubmission();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "Please login to submit a consultancy request.",
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
  } = useForm<ConsultancyFormData>({
    resolver: zodResolver(consultancySchema),
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
    { value: "MACHINE_OPTIMIZATION", label: "Machine Optimization" },
    { value: "AUTOMATION_INTEGRATION", label: "Automation Integration" },
    { value: "MAINTENANCE_SUPPORT", label: "Maintenance Support" },
    { value: "PROCESS_IMPROVEMENT", label: "Process Improvement" },
    { value: "CUSTOM_MACHINE_DESIGN", label: "Custom Machine Design" },
    {
      value: "OPERATOR_TECHNICIAN_TRAINING",
      label: "Operator/Technician Training",
    },
    {
      value: "PREDICTIVE_MAINTENANCE_SETUP",
      label: "Predictive Maintenance Setup",
    },
    {
      value: "TECHNOLOGY_INTEGRATION_AI_IOT_ROBOTICS",
      label: "Technology Integration (AI/IoT/Robotics)",
    },
    {
      value: "ENERGY_EFFICIENCY_SUSTAINABILITY",
      label: "Energy Efficiency & Sustainability",
    },
    { value: "OTHER", label: "Other" },
  ];

  const goalOptions = [
    {
      value: "INCREASE_MACHINE_PRODUCTIVITY",
      label: "Increase Machine Productivity",
    },
    { value: "REDUCE_DOWNTIME", label: "Reduce Downtime" },
    { value: "UPGRADE_OLD_MACHINERY", label: "Upgrade Old Machinery" },
    { value: "IMPROVE_WORKER_TRAINING", label: "Improve Worker Training" },
    {
      value: "ENHANCE_ENERGY_EFFICIENCY",
      label: "Enhance Energy Efficiency",
    },
    { value: "INTEGRATE_AUTOMATION_AI", label: "Integrate Automation/AI" },
    {
      value: "COMPLY_WITH_INDUSTRY_STANDARDS",
      label: "Comply with Industry Standards",
    },
    { value: "OTHER", label: "Other" },
  ];

  const handleServiceToggle = (serviceValue: string) => {
    let updatedServices;
    if (selectedServices.includes(serviceValue)) {
      updatedServices = selectedServices.filter((s) => s !== serviceValue);
    } else {
      updatedServices = [...selectedServices, serviceValue];
    }
    setSelectedServices(updatedServices);
    setValue("servicesRequired", updatedServices as any);
  };

  const handleGoalToggle = (goalValue: string) => {
    let updatedGoals;
    if (selectedGoals.includes(goalValue)) {
      updatedGoals = selectedGoals.filter((g) => g !== goalValue);
    } else {
      updatedGoals = [...selectedGoals, goalValue];
    }
    setSelectedGoals(updatedGoals);
    setValue("projectGoals", updatedGoals as any);
  };

  const onSubmit = async (data: ConsultancyFormData) => {
    try {
      console.log("📝 Form data:", data);

      // Transform string values to integers and dates to ISO strings for the API
      const transformedData = {
        ...data,
        employeesOperatingMachines:
          data.employeesOperatingMachines &&
          data.employeesOperatingMachines.trim() !== ""
            ? parseInt(data.employeesOperatingMachines, 10)
            : undefined,
        yearsInOperation:
          data.yearsInOperation && data.yearsInOperation.trim() !== ""
            ? parseInt(data.yearsInOperation, 10)
            : undefined,
        preferredStartDate: data.preferredStartDate
          ? data.preferredStartDate.toISOString()
          : undefined,
        expectedCompletionDate: data.expectedCompletionDate
          ? data.expectedCompletionDate.toISOString()
          : undefined,
      };

      await consultancySubmission.mutateAsync(transformedData as any);
      setShowSuccessModal(true);
      reset();
      setSelectedServices([]);
      setSelectedGoals([]);
    } catch (error: any) {
      console.error("Form submission error:", error);
      let message = "Failed to submit consultancy request";

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
      <View className="bg-blue-600 pt-12 pb-6 px-5">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white/20 rounded-full mr-3"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1">
            Consultancy Request
          </Text>
        </View>
        <Text className="text-white/90 text-sm">
          Expert guidance for your machinery needs
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="p-5">
          {/* Section 1: Company Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 1: Company Information
            </Text>

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
              name="contactPerson"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter contact person name"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.contactPerson
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.contactPerson && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.contactPerson.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="designation"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Your designation"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.designation ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.designation && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.designation.message}
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
              name="companyAddress"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Company Address *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter complete company address"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.companyAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.companyAddress && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.companyAddress.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Section 2: Industry & Operations */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 2: Industry & Operations
            </Text>

            <Controller
              control={control}
              name="industryType"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Industry Type *
                  </Text>
                  <Select
                    value={value || ""}
                    onValueChange={onChange}
                    placeholder="Select industry type"
                    options={industryOptions}
                    error={errors.industryType?.message}
                  />
                  {errors.industryType && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.industryType.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="industryOther"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Industry Other (If selected Other)
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Specify your industry"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="machineTypesInUse"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Machine Types In Use * (Min 10 characters)
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="List the types of machines you currently use"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.machineTypesInUse
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.machineTypesInUse && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.machineTypesInUse.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="employeesOperatingMachines"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Number of Employees Operating Machines
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., 50"
                    keyboardType="numeric"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="yearsInOperation"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Years In Operation
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., 10"
                    keyboardType="numeric"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />
          </View>

          {/* Section 3: Services Required */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 3: Services Required
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
            {errors.servicesRequired && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.servicesRequired.message}
              </Text>
            )}
          </View>

          {/* Section 4: Challenges & Goals */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 4: Challenges & Goals
            </Text>

            <Controller
              control={control}
              name="currentChallenges"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Current Challenges * (Min 20 characters)
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Describe the challenges you're facing..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.currentChallenges
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.currentChallenges && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.currentChallenges.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Text className="text-sm font-medium text-gray-700 mb-3">
              Project Goals * (Select all that apply)
            </Text>
            {goalOptions.map((goal) => (
              <Checkbox
                key={goal.value}
                checked={selectedGoals.includes(goal.value)}
                onPress={() => handleGoalToggle(goal.value)}
                label={goal.label}
              />
            ))}
            {errors.projectGoals && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.projectGoals.message}
              </Text>
            )}
          </View>

          {/* Section 5: Timeline & Budget */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 5: Timeline & Budget
            </Text>

            <Controller
              control={control}
              name="preferredStartDate"
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  value={value}
                  onChange={onChange}
                  placeholder="Select preferred start date"
                  label="Preferred Start Date"
                  error={errors.preferredStartDate?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="expectedCompletionDate"
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  value={value}
                  onChange={onChange}
                  placeholder="Select expected completion date"
                  label="Expected Completion Date"
                  error={errors.expectedCompletionDate?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="estimatedBudget"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Estimated Budget
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., $10,000 - $50,000"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />

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
            disabled={consultancySubmission.isPending}
            className={`rounded-full py-4 items-center shadow-lg ${
              consultancySubmission.isPending ? "bg-gray-400" : "bg-blue-600"
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {consultancySubmission.isPending
                ? "Submitting..."
                : "Submit Request"}
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
                Your consultancy request has been submitted successfully.
                We&apos;ll get back to you soon.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
              className="bg-blue-600 rounded-full py-3 items-center"
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
