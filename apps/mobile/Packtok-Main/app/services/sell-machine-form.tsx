import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { TokenStorage } from "@/lib/api";
import { useCategories } from "../../hooks/useCategories";
import { useSellMachineSubmission } from "../../hooks/useSellMachine";
import {
  SellMachineFormData,
  sellMachineSchema,
} from "../../schemas/sell-machine-schema";

// Success Modal Component
const SuccessModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-white rounded-3xl p-8 mx-8 items-center">
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
          <Feather name="check" size={40} color="#10B981" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">Success!</Text>
        <Text className="text-base text-gray-600 text-center mb-6">
          Your product has been submitted for review. We&apos;ll notify you once
          it&apos;s approved.
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="bg-green-600 px-8 py-3 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">Got it!</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

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
                        ? "text-black font-semibold"
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
              <Text className="text-center text-black font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default function SellMachineFormScreen() {
  const router = useRouter();
  const sellMachineSubmission = useSellMachineSubmission();
  const { data: categories } = useCategories();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProductType, setSelectedProductType] =
    useState<string>("MACHINERY");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Image states
  const [images, setImages] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<any>(null);
  const [pdf, setPdf] = useState<any>(null);

  // Specifications state
  const [specifications, setSpecifications] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "Please login to sell a product.",
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
    watch,
    formState: { errors },
    reset,
  } = useForm<SellMachineFormData>({
    resolver: zodResolver(sellMachineSchema),
    defaultValues: {
      productType: "MACHINERY",
      condition: "USED",
    },
  });

  const productTypeValue = watch("productType");

  useEffect(() => {
    setSelectedProductType(productTypeValue || "MACHINERY");
  }, [productTypeValue]);

  // Image picker functions
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - images.length,
    });

    if (!result.canceled && result.assets) {
      if (images.length + result.assets.length > 5) {
        Alert.alert("Limit Exceeded", "You can upload maximum 5 images.");
        return;
      }
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const pickThumbnail = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload thumbnail."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setThumbnail(result.assets[0]);
    }
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload video."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setVideo(result.assets[0]);
    }
  };

  const pickVideoThumbnail = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoThumbnail(result.assets[0]);
    }
  };

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets[0]) {
        setPdf(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking PDF:", error);
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const productTypeOptions = [
    { value: "MACHINERY", label: "Machinery" },
    { value: "SPARE_PARTS", label: "Spare Parts" },
    { value: "CONSUMABLES", label: "Consumables" },
    { value: "RAW_MATERIALS", label: "Raw Materials" },
  ];

  const machineTypeOptions = [
    { value: "MONO_CARTON", label: "Mono Carton" },
    { value: "MASTER_CARTON", label: "Master Carton" },
    { value: "BOTH", label: "Both" },
    { value: "OTHER", label: "Other" },
  ];

  const conditionOptions = [
    { value: "NEW", label: "New" },
    { value: "USED", label: "Used" },
  ];

  const categoryOptions =
    categories?.map((cat: any) => ({
      value: cat.name,
      label: cat.name,
    })) || [];

  const onSubmit = async (data: SellMachineFormData) => {
    if (!agreeToTerms) {
      Alert.alert("Error", "You must agree to the Terms and Conditions to proceed.");
      return;
    }

    try {
      console.log("=== FORM SUBMISSION START ===");
      console.log("📝 Form data:", JSON.stringify(data, null, 2));
      console.log("🖼️ Images count:", images.length);
      console.log("🖼️ Images:", images);
      console.log("📸 Thumbnail:", thumbnail);
      console.log("🎥 Video:", video);
      console.log("🖼️ Video Thumbnail:", videoThumbnail);
      console.log("📄 PDF:", pdf);
      console.log("⚙️ Specifications:", specifications);

      // Validate images
      if (images.length === 0 && !thumbnail) {
        console.log("❌ Validation failed: No images");
        Alert.alert("Images Required", "Please upload at least one image.");
        return;
      }

      // Prepare specifications
      const validSpecs = specifications.filter(
        (spec) => spec.key.trim() && spec.value.trim()
      );
      console.log("✅ Valid specifications:", validSpecs);

      const specsString =
        validSpecs.length > 0
          ? JSON.stringify(
              validSpecs.reduce(
                (acc, spec) => {
                  acc[spec.key] = spec.value;
                  return acc;
                },
                {} as Record<string, string>
              )
            )
          : undefined;

      console.log("📋 Specifications string:", specsString);

      // Prepare submission data
      const submissionData = {
        ...data,
        images: images,
        thumbnail: thumbnail || images[0],
        video: video,
        videoThumbnail: videoThumbnail,
        pdf: pdf,
        specifications: specsString,
      };

      console.log("📤 Submission data prepared:", {
        ...submissionData,
        images: `${submissionData.images.length} images`,
        thumbnail: submissionData.thumbnail ? "✓" : "✗",
        video: submissionData.video ? "✓" : "✗",
        videoThumbnail: submissionData.videoThumbnail ? "✓" : "✗",
        pdf: submissionData.pdf ? "✓" : "✗",
      });

      console.log("🚀 Calling mutation...");
      await sellMachineSubmission.mutateAsync(submissionData as any);
      console.log("✅ Mutation successful!");

      setShowSuccessModal(true);

      // Reset form and state
      reset();
      setImages([]);
      setThumbnail(null);
      setVideo(null);
      setVideoThumbnail(null);
      setPdf(null);
      setSpecifications([{ key: "", value: "" }]);
      setAgreeToTerms(false);

      console.log("=== FORM SUBMISSION END ===");
    } catch (error: any) {
      console.error("❌❌❌ FORM SUBMISSION ERROR ❌❌❌");
      console.error("Error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error response:", error?.response);
      console.error("Error response data:", error?.response?.data);
      console.error("Error response status:", error?.response?.status);
      console.error("Error config:", error?.config);
      // Error handling is done in the mutation
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.back();
        }}
      />

      {/* Header */}
      <View className="bg-black pt-12 pb-6 px-5">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white/20 rounded-full mr-3"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1">
            Sell Your Product
          </Text>
        </View>
        <Text className="text-white/80 text-sm">
          Fill in the details to list your product
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-5 py-6">
          {/* Section 1: Basic Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 1: Basic Information
            </Text>

            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., Ice Cream Making Machine"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {errors.title && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="10000.00"
                    keyboardType="decimal-pad"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {errors.price && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.price.message}
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
                    placeholder="contact@example.com"
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
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="(575) 336-4330"
                    keyboardType="phone-pad"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {errors.phoneNumber && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.phoneNumber.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="productType"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Product Type *
                  </Text>
                  <Select
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select product type"
                    options={productTypeOptions}
                    error={errors.productType?.message}
                  />
                  {errors.productType && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.productType.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {selectedProductType === "MACHINERY" && (
              <Controller
                control={control}
                name="machineType"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Machine Type
                    </Text>
                    <Select
                      value={value || ""}
                      onValueChange={onChange}
                      placeholder="Select machine type"
                      options={machineTypeOptions}
                    />
                  </View>
                )}
              />
            )}

            <Controller
              control={control}
              name="categoryName"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </Text>
                  <Select
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select category"
                    options={categoryOptions}
                    error={errors.categoryName?.message}
                  />
                  {errors.categoryName && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.categoryName.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="condition"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </Text>
                  <Select
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select condition"
                    options={conditionOptions}
                    error={errors.condition?.message}
                  />
                  {errors.condition && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.condition.message}
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
                    placeholder="e.g., ACME Corp"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="model"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Model
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., XYZ-2000"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="year"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Year
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="2024"
                    keyboardType="numeric"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Write about this product..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="border border-gray-300 rounded-lg px-4 py-3 min-h-[100px]"
                  />
                  {errors.description && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="additionalInfo"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Any additional details..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="border border-gray-300 rounded-lg px-4 py-3 min-h-[80px]"
                  />
                </View>
              )}
            />

            {/* Address Fields */}
            <Text className="text-base font-semibold text-gray-900 mt-6 mb-4">
              Business Address
            </Text>

            <Controller
              control={control}
              name="legalBusinessName"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Legal Business Name *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Company Name Ltd."
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {errors.legalBusinessName && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.legalBusinessName.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="addressLine1"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="123 Main Street"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {errors.addressLine1 && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.addressLine1.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="addressLine2"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Address Line 2 (Optional)
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Apartment, suite, etc."
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
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
                      {errors.city.message}
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
                    State/Province *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="New York"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {errors.state && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.state.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="postcodeZip"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Postcode/ZIP *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="10001"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {errors.postcodeZip && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.postcodeZip.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="United States"
                    className="border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {errors.country && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.country.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Section 2: Images */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 2: Photos & Media
            </Text>

            {/* Product Images */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Product Images (Max 5) *
              </Text>
              <TouchableOpacity
                onPress={pickImages}
                disabled={images.length >= 5}
                className={`border-2 border-dashed rounded-lg p-6 items-center ${
                  images.length >= 5
                    ? "border-gray-300 bg-gray-100"
                    : "border-gray-400"
                }`}
                activeOpacity={0.7}
              >
                <Feather
                  name="upload"
                  size={32}
                  color={images.length >= 5 ? "#9CA3AF" : "#6B7280"}
                />
                <Text className="text-gray-600 mt-2 text-center">
                  {images.length >= 5
                    ? "Maximum images uploaded"
                    : "Tap to upload images"}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {images.length}/5 images
                </Text>
              </TouchableOpacity>

              {/* Image Preview */}
              {images.length > 0 && (
                <View className="flex-row flex-wrap gap-2 mt-3">
                  {images.map((image, index) => (
                    <View key={index} className="relative">
                      <Image
                        source={{ uri: image.uri }}
                        className="w-20 h-20 rounded-lg"
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                        activeOpacity={0.7}
                      >
                        <Feather name="x" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Thumbnail */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Thumbnail (Optional)
              </Text>
              <TouchableOpacity
                onPress={pickThumbnail}
                className="border-2 border-dashed border-gray-400 rounded-lg p-4 items-center"
                activeOpacity={0.7}
              >
                {thumbnail ? (
                  <View className="items-center">
                    <Image
                      source={{ uri: thumbnail.uri }}
                      className="w-full h-40 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <Text className="text-green-600">Thumbnail selected</Text>
                  </View>
                ) : (
                  <>
                    <Feather name="image" size={24} color="#6B7280" />
                    <Text className="text-gray-600 mt-2">Upload thumbnail</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Video */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Product Video (Optional)
              </Text>
              <TouchableOpacity
                onPress={pickVideo}
                className="border-2 border-dashed border-gray-400 rounded-lg p-4 items-center"
                activeOpacity={0.7}
              >
                {video ? (
                  <View className="items-center">
                    <Feather name="video" size={32} color="#10B981" />
                    <Text className="text-green-600 mt-2">Video selected</Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      {video.fileName}
                    </Text>
                  </View>
                ) : (
                  <>
                    <Feather name="video" size={24} color="#6B7280" />
                    <Text className="text-gray-600 mt-2">Upload video</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Video Thumbnail */}
            {video && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Video Thumbnail
                </Text>
                <TouchableOpacity
                  onPress={pickVideoThumbnail}
                  className="border-2 border-dashed border-gray-400 rounded-lg p-4 items-center"
                  activeOpacity={0.7}
                >
                  {videoThumbnail ? (
                    <View className="items-center">
                      <Image
                        source={{ uri: videoThumbnail.uri }}
                        className="w-full h-32 rounded-lg mb-2"
                        resizeMode="cover"
                      />
                      <Text className="text-green-600">
                        Video thumbnail selected
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Feather name="image" size={24} color="#6B7280" />
                      <Text className="text-gray-600 mt-2">
                        Upload video thumbnail
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* PDF */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Product Document/Brochure (PDF)
              </Text>
              <TouchableOpacity
                onPress={pickPDF}
                className="border-2 border-dashed border-gray-400 rounded-lg p-4 items-center"
                activeOpacity={0.7}
              >
                {pdf ? (
                  <View className="items-center">
                    <Feather name="file-text" size={32} color="#10B981" />
                    <Text className="text-green-600 mt-2">PDF selected</Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      {pdf.name}
                    </Text>
                  </View>
                ) : (
                  <>
                    <Feather name="file-text" size={24} color="#6B7280" />
                    <Text className="text-gray-600 mt-2">Upload PDF</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 3: Specifications */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Section 3: Specifications
            </Text>

            {specifications.map((spec, index) => (
              <View key={index} className="mb-4">
                <View className="flex-row gap-2 mb-2">
                  <TextInput
                    value={spec.key}
                    onChangeText={(value) =>
                      updateSpecification(index, "key", value)
                    }
                    placeholder="e.g., Power"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                  />
                  <TextInput
                    value={spec.value}
                    onChangeText={(value) =>
                      updateSpecification(index, "value", value)
                    }
                    placeholder="e.g., 220V"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                  />
                  {specifications.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeSpecification(index)}
                      className="w-12 h-12 items-center justify-center bg-red-100 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={addSpecification}
              className="border-2 border-dashed border-gray-400 rounded-lg p-4 items-center"
              activeOpacity={0.7}
            >
              <Feather name="plus" size={24} color="#6B7280" />
              <Text className="text-gray-600 mt-2">Add Specification</Text>
            </TouchableOpacity>
          </View>

          {/* Terms & Conditions */}
          <TouchableOpacity
            className="flex-row items-start mb-6 px-1 mt-4"
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <View
              className={`w-5 h-5 rounded border items-center justify-center mr-3 mt-0.5 ${
                agreeToTerms
                  ? "bg-black border-black"
                  : "bg-white border-gray-300"
              }`}
            >
              {agreeToTerms && (
                <Feather name="check" size={14} color="white" />
              )}
            </View>
            <Text className="text-sm text-gray-600 flex-1 leading-5">
              I agree to the Terms & Conditions and Privacy Policy. I confirm
              that the information provided is accurate.
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={sellMachineSubmission.isPending}
            className={`rounded-full py-4 items-center shadow-lg ${
              sellMachineSubmission.isPending ? "bg-gray-400" : "bg-black"
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              {sellMachineSubmission.isPending
                ? "Submitting..."
                : "Submit Product"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
