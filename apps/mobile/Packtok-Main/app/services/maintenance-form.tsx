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
import { useMaintenanceSubmission } from "../../hooks/useMaintenance";
import {
  MaintenanceFormData,
  maintenanceSchema,
} from "../../schemas/maintenance-schema";

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
                        ? "text-green-600 font-semibold"
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
              <Text className="text-center text-green-600 font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

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
            <Text className="text-sm text-green-600">Clear</Text>
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

export default function MaintenanceFormScreen() {
  const router = useRouter();
  const maintenanceSubmission = useMaintenanceSubmission();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "Please login to submit a maintenance request.",
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
    formState: { errors },
    reset,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
  });

  const maintenanceTypeOptions = [
    { value: "PREVENTIVE", label: "Preventive Maintenance" },
    { value: "CORRECTIVE", label: "Corrective Maintenance" },
    { value: "PREDICTIVE", label: "Predictive Maintenance" },
    { value: "EMERGENCY", label: "Emergency Maintenance" },
  ];

  const onSubmit = async (data: MaintenanceFormData) => {
    try {
      console.log("📝 Form data:", data);

      // Transform date to ISO string for the API
      const transformedData = {
        ...data,
        installationDate: data.installationDate
          ? data.installationDate.toISOString()
          : undefined,
      };

      await maintenanceSubmission.mutateAsync(transformedData as any);
      setShowSuccessModal(true);
      reset();
    } catch (error: any) {
      console.error("Form submission error:", error);
      let message = "Failed to submit maintenance request";

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
      <View className="bg-green-600 pt-12 pb-6 px-5">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white/20 rounded-full mr-3"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1">
            Maintenance Request
          </Text>
        </View>
        <Text className="text-white/90 text-sm">
          Schedule your machinery maintenance service
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="p-5">
          {/* Section 1: Maintenance Type */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 1: Maintenance Type
            </Text>

            <Controller
              control={control}
              name="maintenanceType"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Maintenance Type *
                  </Text>
                  <Select
                    value={value || ""}
                    onValueChange={onChange}
                    placeholder="Select maintenance type"
                    options={maintenanceTypeOptions}
                    error={errors.maintenanceType?.message}
                  />
                  {errors.maintenanceType && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.maintenanceType.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Section 2: Company & Location */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 2: Company & Location
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
              name="address"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter complete address"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.address && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.address.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Section 3: Machine Details */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 3: Machine Details
            </Text>

            <Controller
              control={control}
              name="machineName"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Machine Name *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., CNC Machine"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.machineName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.machineName && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.machineName.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="machineIdOrSerialNumber"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Machine ID / Serial Number *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter machine ID or serial number"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.machineIdOrSerialNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.machineIdOrSerialNumber && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.machineIdOrSerialNumber.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="locationInFacility"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Location in Facility *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., Building A, Floor 2"
                    className={`border rounded-lg px-4 py-3 ${
                      errors.locationInFacility
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.locationInFacility && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.locationInFacility.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="manufacturer"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Manufacturer
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter manufacturer name"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="installationDate"
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  value={value}
                  onChange={onChange}
                  placeholder="Select installation date"
                  label="Installation Date"
                  error={errors.installationDate?.message}
                />
              )}
            />
          </View>

          {/* Section 4: Maintenance Details */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 4: Maintenance Details
            </Text>

            <Controller
              control={control}
              name="checklistDetails"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Checklist Details
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="List maintenance checklist items..."
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
              name="partsReplaced"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Parts Replaced
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="List any parts that need replacement..."
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
              name="technicianNotes"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Technician Notes
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Additional notes for the technician..."
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
              name="supervisorApprovalName"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Supervisor Approval Name
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Supervisor's name"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={maintenanceSubmission.isPending}
            className={`rounded-full py-4 items-center shadow-lg ${
              maintenanceSubmission.isPending ? "bg-gray-400" : "bg-green-600"
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {maintenanceSubmission.isPending
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
                Your maintenance request has been submitted successfully.
                We&apos;ll get back to you soon.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
              className="bg-green-600 rounded-full py-3 items-center"
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
