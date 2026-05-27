import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {
  MachineryInstallerFormData,
  useSubmitMachineryInstaller,
} from "../../hooks/useMachineryInstaller";

const InstallationDateTimeInput = ({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const selectedDate = value ? new Date(value) : undefined;

  const formatDate = (date?: Date) => {
    if (!date || Number.isNaN(date.getTime())) return "Select preferred date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date?: Date) => {
    if (!date || Number.isNaN(date.getTime())) return "Select preferred time";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const mergeDate = (base: Date | undefined, picked: Date) => {
    const next = new Date(base || new Date());
    next.setFullYear(
      picked.getFullYear(),
      picked.getMonth(),
      picked.getDate(),
    );
    return next;
  };

  const mergeTime = (base: Date | undefined, picked: Date) => {
    const next = new Date(base || new Date());
    next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
    return next;
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1">
        When (Preferred Installation Date & Time){" "}
        <Text className="text-red-500">*</Text>
      </Text>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className={`flex-1 bg-white border rounded-lg px-4 py-3 flex-row items-center justify-between ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`flex-1 mr-3 ${
              selectedDate ? "text-gray-900" : "text-gray-400"
            }`}
            numberOfLines={1}
          >
            {formatDate(selectedDate)}
          </Text>
          <Feather
            name="calendar"
            size={18}
            color={selectedDate ? "#111827" : "#9CA3AF"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          className={`flex-1 bg-white border rounded-lg px-4 py-3 flex-row items-center justify-between ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`flex-1 mr-3 ${
              selectedDate ? "text-gray-900" : "text-gray-400"
            }`}
            numberOfLines={1}
          >
            {formatTime(selectedDate)}
          </Text>
          <Feather
            name="clock"
            size={18}
            color={selectedDate ? "#111827" : "#9CA3AF"}
          />
        </TouchableOpacity>
      </View>

      {error && (
        <Text className="text-red-500 text-xs mt-1 font-medium">
          Please select a preferred installation date and time
        </Text>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, pickedDate) => {
            setShowDatePicker(false);
            if (event.type === "set" && pickedDate) {
              onChange(mergeDate(selectedDate, pickedDate).toISOString());
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="time"
          display="default"
          onChange={(event, pickedDate) => {
            setShowTimePicker(false);
            if (event.type === "set" && pickedDate) {
              onChange(mergeTime(selectedDate, pickedDate).toISOString());
            }
          }}
        />
      )}
    </View>
  );
};

export default function MachineryInstallerFormScreen() {
  const router = useRouter();
  const submitMutation = useSubmitMachineryInstaller();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MachineryInstallerFormData>({
    defaultValues: {
      teamMembersRequired: 1,
      machineImages: [],
      machineVideos: [],
      agreeToTerms: false,
    },
  });

  const watchImages = watch("machineImages");
  const watchVideos = watch("machineVideos");
  const watchAgreeToTerms = watch("agreeToTerms");

  const handlePickImages = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/webp"],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const currentImages = watchImages || [];
        const newImages = [...currentImages, ...result.assets];

        if (newImages.length > 3) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "You can upload a maximum of 3 images.",
          });
          return;
        }

        setValue("machineImages", newImages);
      }
    } catch (err) {
      console.error("Error picking images", err);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = watchImages || [];
    setValue(
      "machineImages",
      currentImages.filter((_, i) => i !== index),
    );
  };

  const handlePickVideos = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/mp4", "video/x-msvideo", "video/*"],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const currentVideos = watchVideos || [];
        const oversized = result.assets.find(
          (file) => file.size && file.size > 10 * 1024 * 1024,
        );

        if (oversized) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Each video must be 10MB or less.",
          });
          return;
        }

        const newVideos = [...currentVideos, ...result.assets];

        if (newVideos.length > 2) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "You can upload a maximum of 2 videos.",
          });
          return;
        }

        setValue("machineVideos", newVideos);
      }
    } catch (err) {
      console.error("Error picking videos", err);
    }
  };

  const removeVideo = (index: number) => {
    const currentVideos = watchVideos || [];
    setValue(
      "machineVideos",
      currentVideos.filter((_, i) => i !== index),
    );
  };

  const onSubmit = (data: MachineryInstallerFormData) => {
    if (!data.agreeToTerms) {
      Toast.show({
        type: "error",
        text1: "Terms & Conditions",
        text2: "You must agree to the Terms and Conditions to proceed.",
      });
      return;
    }

    // Basic validation
    if (
      !data.companyName ||
      !data.contactPerson ||
      !data.phone ||
      !data.email ||
      !data.companyAddress ||
      !data.installationTypeRequired ||
      !data.expectedTimeline ||
      !data.machineTypeModel ||
      !data.capacitySpecifications ||
      !data.fromLocation ||
      !data.preferredInstallationDateTime ||
      !data.whereLocation ||
      !data.teamMembersRequired ||
      !data.skillsExpertiseNeeded ||
      !data.onSiteSupportProvidedByClient
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all required fields.",
      });
      return;
    }

    submitMutation.mutate(data, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Your machinery installer request has been submitted.",
        });
        setTimeout(() => {
          router.back();
        }, 1500);
      },
    });
  };

  const InputField = ({
    name,
    label,
    placeholder,
    keyboardType = "default",
    multiline = false,
  }: any) => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1">
        {label} <Text className="text-red-500">*</Text>
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value?.toString() || ""}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            textAlignVertical={multiline ? "top" : "center"}
            className={`bg-white border text-gray-900 text-sm rounded-lg px-4 py-3 ${
              errors[name as keyof MachineryInstallerFormData]
                ? "border-red-500"
                : "border-gray-200"
            }`}
            style={multiline ? { minHeight: 100 } : {}}
          />
        )}
      />
      {errors[name as keyof MachineryInstallerFormData] && (
        <Text className="text-red-500 text-xs mt-1 font-medium">
          This field is required
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-gray-50"
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Feather name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          Machinery Installer
        </Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        >
          {/* Section 1: Company Details */}
          <View className="bg-white rounded-xl p-5 mb-5 border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-4 pb-3 border-b border-gray-100">
              <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
                <Text className="text-blue-600 font-bold text-xs">1</Text>
              </View>
              <Text className="font-bold text-gray-900 text-base">
                Company Details
              </Text>
            </View>

            <InputField
              name="companyName"
              label="Company Name"
              placeholder="e.g. Acme Corp"
            />
            <InputField
              name="contactPerson"
              label="Contact Person"
              placeholder="e.g. John Doe"
            />
            <InputField
              name="phone"
              label="Phone Number"
              placeholder="e.g. +1 234 567 8900"
              keyboardType="phone-pad"
            />
            <InputField
              name="email"
              label="Email Address"
              placeholder="e.g. john@acme.com"
              keyboardType="email-address"
            />
            <InputField
              name="companyAddress"
              label="Company Address"
              placeholder="Full address"
              multiline
            />
          </View>

          {/* Section 2: Requirements */}
          <View className="bg-white rounded-xl p-5 mb-5 border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-4 pb-3 border-b border-gray-100">
              <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
                <Text className="text-blue-600 font-bold text-xs">2</Text>
              </View>
              <Text className="font-bold text-gray-900 text-base">
                Customer Requirement
              </Text>
            </View>

            <InputField
              name="installationTypeRequired"
              label="Type of Installation Required"
              placeholder="e.g. Heavy Machinery Setup"
            />
            <InputField
              name="expectedTimeline"
              label="Expected Timeline"
              placeholder="e.g. 2 Weeks"
            />
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Any Specific Instructions
              </Text>
              <Controller
                control={control}
                name="specificInstructions"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ""}
                    placeholder="Provide any specific instructions..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={{ minHeight: 100 }}
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-3"
                  />
                )}
              />
            </View>
          </View>

          {/* Section 3: Machine Details */}
          <View className="bg-white rounded-xl p-5 mb-5 border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-4 pb-3 border-b border-gray-100">
              <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
                <Text className="text-blue-600 font-bold text-xs">3</Text>
              </View>
              <Text className="font-bold text-gray-900 text-base">
                Machine Details
              </Text>
            </View>

            {/* Image Upload */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Upload Machine Images (Max 3)
              </Text>
              <TouchableOpacity
                onPress={handlePickImages}
                className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center flex-row"
              >
                <Feather
                  name="image"
                  size={20}
                  color="#6B7280"
                  className="mr-2"
                />
                <Text className="text-gray-600 font-medium">Pick Images</Text>
              </TouchableOpacity>
              {watchImages && watchImages.length > 0 && (
                <View className="mt-3 space-y-2">
                  {watchImages.map((img: any, idx: number) => (
                    <View
                      key={idx}
                      className="flex-row items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200"
                    >
                      <Text
                        className="text-xs text-gray-600 flex-1 mr-2"
                        numberOfLines={1}
                      >
                        {img.name || img.fileName || "Image"}
                      </Text>
                      <TouchableOpacity onPress={() => removeImage(idx)}>
                        <Feather name="x-circle" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Video Upload */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Upload Machine Videos (Max 2, 10MB each)
              </Text>
              <TouchableOpacity
                onPress={handlePickVideos}
                className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center flex-row"
              >
                <Feather
                  name="video"
                  size={20}
                  color="#6B7280"
                  className="mr-2"
                />
                <Text className="text-gray-600 font-medium">Pick Videos</Text>
              </TouchableOpacity>
              {watchVideos && watchVideos.length > 0 && (
                <View className="mt-3 space-y-2">
                  {watchVideos.map((vid: any, idx: number) => (
                    <View
                      key={idx}
                      className="flex-row items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200"
                    >
                      <Text
                        className="text-xs text-gray-600 flex-1 mr-2"
                        numberOfLines={1}
                      >
                        {vid.name || vid.fileName || "Video"} (
                        {vid.size ? (vid.size / (1024 * 1024)).toFixed(1) : "?"}{" "}
                        MB)
                      </Text>
                      <TouchableOpacity onPress={() => removeVideo(idx)}>
                        <Feather name="x-circle" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <InputField
              name="machineTypeModel"
              label="Machine Type / Model"
              placeholder="e.g. CNC Mill Pro X"
            />
            <InputField
              name="capacitySpecifications"
              label="Capacity / Specifications"
              placeholder="Enter capacity and specs..."
              multiline
            />
          </View>

          {/* Section 4: Installation Details */}
          <View className="bg-white rounded-xl p-5 mb-5 border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-4 pb-3 border-b border-gray-100">
              <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
                <Text className="text-blue-600 font-bold text-xs">4</Text>
              </View>
              <Text className="font-bold text-gray-900 text-base">
                Installation Details
              </Text>
            </View>

            <InputField
              name="fromLocation"
              label="From Where"
              placeholder="e.g. Factory, Warehouse"
            />
            <Controller
              control={control}
              name="preferredInstallationDateTime"
              render={({ field: { onChange, value } }) => (
                <InstallationDateTimeInput
                  value={value}
                  onChange={onChange}
                  error={!!errors.preferredInstallationDateTime}
                />
              )}
            />
            <InputField
              name="whereLocation"
              label="Where"
              placeholder="Exact location for installation"
              multiline
            />
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Additional Description
              </Text>
              <Controller
                control={control}
                name="additionalDescription"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ""}
                    placeholder="Any other details..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={{ minHeight: 100 }}
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-3"
                  />
                )}
              />
            </View>
          </View>

          {/* Section 5: Team Details */}
          <View className="bg-white rounded-xl p-5 mb-5 border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-4 pb-3 border-b border-gray-100">
              <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
                <Text className="text-blue-600 font-bold text-xs">5</Text>
              </View>
              <Text className="font-bold text-gray-900 text-base">
                Team Details
              </Text>
            </View>

            <InputField
              name="teamMembersRequired"
              label="Number of Team Members Required"
              placeholder="e.g. 5"
              keyboardType="number-pad"
            />
            <InputField
              name="skillsExpertiseNeeded"
              label="Skills / Expertise Needed"
              placeholder="e.g. Mechanical, Electrical"
              multiline
            />
            <InputField
              name="onSiteSupportProvidedByClient"
              label="Any On-Site Support Provided by Client"
              placeholder="e.g. Forklifts available"
              multiline
            />
          </View>

          {/* Terms & Conditions */}
          <TouchableOpacity
            className="flex-row items-start mb-8 px-2"
            onPress={() => setValue("agreeToTerms", !watchAgreeToTerms)}
          >
            <View
              className={`w-5 h-5 rounded border items-center justify-center mt-0.5 mr-3 ${
                watchAgreeToTerms
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-300"
              }`}
            >
              {watchAgreeToTerms && (
                <Feather name="check" size={14} color="white" />
              )}
            </View>
            <Text className="text-sm text-gray-600 flex-1 leading-5">
              I agree to the{" "}
              <Text
                className="text-blue-600 underline"
                onPress={() => router.push("/terms-conditions" as any)}
              >
                Terms & Conditions
              </Text>{" "}
              and{" "}
              <Text
                className="text-blue-600 underline"
                onPress={() => router.push("/privacy-policy" as any)}
              >
                Privacy Policy
              </Text>
              . I confirm that the information provided is accurate.
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={submitMutation.isPending}
            className={`bg-blue-600 py-4 rounded-full items-center shadow-sm flex-row justify-center ${
              submitMutation.isPending ? "opacity-70" : ""
            }`}
          >
            {submitMutation.isPending ? (
              <ActivityIndicator color="white" size="small" className="mr-2" />
            ) : null}
            <Text className="text-white font-bold text-lg">Submit Request</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
