import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useJobSeekerSubmission } from "../../hooks/useJobSeeker";
import { jobSeekerSchema } from "../../schemas/job-seeker-schema";

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
        className="border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center bg-white"
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
          maximumDate={new Date()}
        />
      )}
    </>
  );
};

export default function JobSeekerFormScreen() {
  const router = useRouter();
  const jobSeekerSubmission = useJobSeekerSubmission();
  const [cvFile, setCvFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(jobSeekerSchema),
    defaultValues: {
      hasPreviouslyWorkedWithUs: false,
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      stateOfResidence: "",
      phone: "",
      positionSought: "",
      preferredWorkingMode: "",
    },
  } as any);

  const hasPreviousWork = watch("hasPreviouslyWorkedWithUs");

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // Check file size (5MB limit)
        if (file.size && file.size > 5 * 1024 * 1024) {
          Alert.alert("File Too Large", "File size must be less than 5MB");
          return;
        }

        setCvFile({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/pdf",
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const removeCv = () => {
    setCvFile(null);
  };

  const onSubmit = async (data: any) => {
    if (!cvFile) {
      Alert.alert("CV Required", "Please upload your CV/Resume to continue");
      return;
    }

    try {
      const submissionData = {
        ...data,
        cv: cvFile,
      };

      await jobSeekerSubmission.mutateAsync(submissionData);
      reset();
      setCvFile(null);
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
            Job Seeker Application
          </Text>
        </View>
        <Text className="text-white/90 text-sm ml-14">
          Apply for your dream industrial job
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Personal Information */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Personal Information
          </Text>

          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter first name"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.firstName && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.firstName.message)}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter last name"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.lastName && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.lastName.message)}
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
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.phone && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.phone.message)}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="alternatePhone"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Alternate Phone (Optional)
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="+1 234 567 8900"
                  keyboardType="phone-pad"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
              </View>
            )}
          />
        </View>

        {/* Address Information */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Address Information
          </Text>

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="123 Main Street"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.address && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.address.message)}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  City *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="New York"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.city && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.city.message)}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  State *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="New York"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.state && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.state.message)}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="postalCode"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="10001"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.postalCode && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.postalCode.message)}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="stateOfResidence"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  State of Residence *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="New York"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.stateOfResidence && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.stateOfResidence.message)}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Job Preferences */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Job Preferences
          </Text>

          <Controller
            control={control}
            name="positionSought"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Position Sought *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., Machine Operator"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.positionSought && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.positionSought.message)}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="otherPosition"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Other Position (Optional)
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Specify other position"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="preferredWorkingMode"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Preferred Working Mode *
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., Full-time, Part-time, Contract"
                  className="border border-gray-300 rounded-lg px-4 py-3"
                />
                {errors.preferredWorkingMode && (
                  <Text className="text-red-500 text-xs mt-1">
                    {String(errors.preferredWorkingMode.message)}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Previous Work */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Previous Work Experience
          </Text>

          <Controller
            control={control}
            name="hasPreviouslyWorkedWithUs"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <TouchableOpacity
                  onPress={() => onChange(!value)}
                  className="flex-row items-center"
                  activeOpacity={0.7}
                >
                  <View
                    className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                      value ? "bg-blue-600 border-blue-600" : "border-gray-400"
                    }`}
                  >
                    {value && <Feather name="check" size={16} color="white" />}
                  </View>
                  <Text className="text-sm text-gray-700">
                    I have previously worked with this company
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {hasPreviousWork && (
            <Controller
              control={control}
              name="previousWorkEndDate"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Previous Work End Date
                  </Text>
                  <DatePickerInput value={value} onChange={onChange} />
                </View>
              )}
            />
          )}
        </View>

        {/* CV Upload */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Upload CV/Resume *
          </Text>

          {!cvFile ? (
            <TouchableOpacity
              onPress={pickDocument}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
              activeOpacity={0.7}
            >
              <Feather name="upload-cloud" size={48} color="#9CA3AF" />
              <Text className="text-gray-700 font-medium mt-3">
                Upload CV/Resume
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                PDF, DOC, DOCX, or TXT (Max 5MB)
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="border border-green-300 bg-green-50 rounded-lg p-4 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Feather name="file-text" size={24} color="#10B981" />
                <View className="ml-3 flex-1">
                  <Text className="text-gray-900 font-medium" numberOfLines={1}>
                    {cvFile.name}
                  </Text>
                  <Text className="text-gray-500 text-xs">CV Uploaded</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={removeCv}
                className="ml-2 w-8 h-8 items-center justify-center bg-red-100 rounded-full"
                activeOpacity={0.7}
              >
                <Feather name="x" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
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
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
