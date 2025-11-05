import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useManpowerHiringSubmission } from "../../hooks/useManpowerHiring";
import {
  manpowerHiringSchema,
  type ManpowerHiringFormData,
} from "../../schemas/manpower-hiring-schema";

// DatePicker Component
const DatePickerInput = ({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (date?: Date) => void;
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
    <>
      <TouchableOpacity
        onPress={() => setShow(true)}
        className="border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
        activeOpacity={0.7}
      >
        <Text className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? formatDate(value) : "Select date"}
        </Text>
        <Feather
          name="calendar"
          size={20}
          color={value ? "#1f2937" : "#9ca3af"}
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={new Date()}
        />
      )}
    </>
  );
};

// Select Component
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

export default function ManpowerHiringFormScreen() {
  const router = useRouter();
  const manpowerSubmission = useManpowerHiringSubmission();
  const [selectedManpowerTypes, setSelectedManpowerTypes] = useState<string[]>(
    []
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ManpowerHiringFormData>({
    resolver: zodResolver(manpowerHiringSchema),
    defaultValues: {
      skilledWorkersRequired: "0",
      semiSkilledWorkersRequired: "0",
      unskilledWorkersRequired: "0",
      manpowerType: [],
    },
  });

  const industryOptions = [
    { label: "Manufacturing", value: "MANUFACTURING" },
    { label: "Automotive", value: "AUTOMOTIVE" },
    { label: "Food Processing", value: "FOOD_PROCESSING" },
    { label: "Pharmaceuticals", value: "PHARMACEUTICALS" },
    { label: "Agriculture", value: "AGRICULTURE" },
    { label: "Chemicals", value: "CHEMICALS" },
    { label: "Petrochemicals", value: "PETROCHEMICALS" },
    { label: "Textile", value: "TEXTILE" },
    { label: "Plastics & Packaging", value: "PLASTICS_PACKAGING" },
    { label: "Electronics", value: "ELECTRONICS" },
    { label: "Other", value: "OTHER" },
  ];

  const manpowerOptions = [
    { label: "Machine Operators", value: "MACHINE_OPERATORS" },
    { label: "Technicians", value: "TECHNICIANS" },
    { label: "Maintenance Workers", value: "MAINTENANCE_WORKERS" },
    { label: "Supervisors", value: "SUPERVISORS" },
    { label: "Other", value: "OTHER" },
  ];

  const hiringDurationOptions = [
    { label: "Permanent", value: "PERMANENT" },
    { label: "Contract", value: "CONTRACT" },
  ];

  const urgencyOptions = [
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" },
  ];

  const toggleManpowerType = (value: string) => {
    const newTypes = selectedManpowerTypes.includes(value)
      ? selectedManpowerTypes.filter((t) => t !== value)
      : [...selectedManpowerTypes, value];

    setSelectedManpowerTypes(newTypes);
    setValue("manpowerType", newTypes as any);
  };

  const onSubmit = async (data: ManpowerHiringFormData) => {
    try {
      await manpowerSubmission.mutateAsync(data);
      reset();
      setSelectedManpowerTypes([]);
      router.back();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-5">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 w-10 h-10 items-center justify-center bg-white/20 rounded-full"
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1">
            Hiring Partner Form
          </Text>
        </View>
        <Text className="text-white/90 text-sm ml-14">
          Find the right talent for your industry
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Company Information */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Company Information
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
                  className="border border-gray-300 rounded-lg px-4 py-3"
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
                  className="border border-gray-300 rounded-lg px-4 py-3"
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
                  placeholder="e.g., HR Manager"
                  className="border border-gray-300 rounded-lg px-4 py-3"
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
            name="phone"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="+1 234 567 8900"
                  keyboardType="phone-pad"
                  className="border border-gray-300 rounded-lg px-4 py-3"
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
            name="email"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="company@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="border border-gray-300 rounded-lg px-4 py-3"
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
            name="companyAddress"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Company Address *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter full address"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="border border-gray-300 rounded-lg px-4 py-3 min-h-[80px]"
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

        {/* Job Details */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Job Details
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
                  value={value}
                  onValueChange={onChange}
                  placeholder="Select industry"
                  options={industryOptions}
                  error={errors.industryType?.message}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="machineryInvolved"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Machinery Involved *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Describe the machinery..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="border border-gray-300 rounded-lg px-4 py-3 min-h-[80px]"
                />
                {errors.machineryInvolved && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.machineryInvolved.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="workLocation"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Work Location *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., New York, NY"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.workLocation && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.workLocation.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="workingHours"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Working Hours *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., 9 AM - 5 PM"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.workingHours && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.workingHours.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Manpower Type (Multi-select) */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Manpower Type * (Select all that apply)
            </Text>
            <View className="space-y-2">
              {manpowerOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => toggleManpowerType(option.value)}
                  className={`flex-row items-center border rounded-lg px-4 py-3 mb-2 ${
                    selectedManpowerTypes.includes(option.value)
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                      selectedManpowerTypes.includes(option.value)
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-400"
                    }`}
                  >
                    {selectedManpowerTypes.includes(option.value) && (
                      <Feather name="check" size={14} color="white" />
                    )}
                  </View>
                  <Text className="text-sm text-gray-800">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.manpowerType && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.manpowerType.message}
              </Text>
            )}
          </View>
        </View>

        {/* Worker Requirements */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Worker Requirements
          </Text>

          <Controller
            control={control}
            name="skilledWorkersRequired"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Skilled Workers Required
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="0"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="semiSkilledWorkersRequired"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Semi-Skilled Workers Required
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="0"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="unskilledWorkersRequired"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Unskilled Workers Required
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="0"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
              </View>
            )}
          />
        </View>

        {/* Hiring Details */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Hiring Details
          </Text>

          <Controller
            control={control}
            name="hiringDuration"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Hiring Duration *
                </Text>
                <Select
                  value={value}
                  onValueChange={onChange}
                  placeholder="Select duration"
                  options={hiringDurationOptions}
                  error={errors.hiringDuration?.message}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="contractDurationDetails"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Contract Duration Details (if applicable)
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., 6 months, 1 year"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="requiredCertsAndExp"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Required Certifications & Experience
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="List any required certifications..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="border border-gray-300 rounded-lg px-4 py-3 min-h-[80px]"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="expectedJoiningDate"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Expected Joining Date *
                </Text>
                <DatePickerInput value={value} onChange={onChange} />
                {errors.expectedJoiningDate && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.expectedJoiningDate.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="hiringUrgency"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Hiring Urgency *
                </Text>
                <Select
                  value={value}
                  onValueChange={onChange}
                  placeholder="Select urgency"
                  options={urgencyOptions}
                  error={errors.hiringUrgency?.message}
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
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="border border-gray-300 rounded-lg px-4 py-3 min-h-[100px]"
                />
              </View>
            )}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`rounded-lg py-4 items-center shadow-md ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600"
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg">
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
