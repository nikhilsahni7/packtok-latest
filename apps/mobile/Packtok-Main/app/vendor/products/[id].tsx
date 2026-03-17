import DropdownField from "@/components/DropdownField";
import VendorButton from "@/components/VendorButton";
import { useCategories } from "@/hooks/useCategories";
import { useVendorApplication } from "@/hooks/useVendorApplication";
import {
  useAdjustVendorInventory,
  useRemoveVendorProductImage,
  useSubmitVendorProduct,
  useUpdateVendorProduct,
  useUploadVendorProductMedia,
  useUpsertVendorInventory,
  useVendorInventory,
  useVendorProduct,
} from "@/hooks/useVendorProducts";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const CURRENCIES = ["INR", "USD", "AED", "EUR", "GBP", "CNY", "TWD"];
const PRODUCT_TYPES = [
  "MACHINERY",
  "SPARE_PARTS",
  "CONSUMABLES",
  "RAW_MATERIALS",
];
const CONDITIONS = ["NEW", "USED"];
const MACHINE_TYPES = ["NONE", "MONO_CARTON", "MASTER_CARTON", "BOTH", "OTHER"];
const ADJUST_REASONS = [
  "ADJUSTMENT",
  "RESTOCK",
  "SALE",
  "RESERVATION",
  "CANCELLATION",
] as const;

export default function VendorProductEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const blockedRedirectHandled = useRef(false);

  const { data: vendorApplication, isLoading: isVendorApplicationLoading } =
    useVendorApplication();

  const { data: product, isLoading } = useVendorProduct(id || "");
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
  const { data: inventory } = useVendorInventory(id || "");
  const { mutate: updateProduct, isPending: isUpdating } =
    useUpdateVendorProduct(id || "");
  const { mutate: submitProduct, isPending: isSubmitting } =
    useSubmitVendorProduct(id || "");
  const { mutate: uploadMedia, isPending: isUploadingMedia } =
    useUploadVendorProductMedia(id || "");
  const { mutate: removeImage, isPending: isRemovingImage } =
    useRemoveVendorProductImage(id || "");
  const { mutate: upsertInventory, isPending: isSavingInventory } =
    useUpsertVendorInventory(id || "");
  const { mutate: adjustInventory, isPending: isAdjustingInventory } =
    useAdjustVendorInventory(id || "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [currency, setCurrency] = useState("INR");
  const [productType, setProductType] = useState("MACHINERY");
  const [condition, setCondition] = useState("NEW");
  const [machineType, setMachineType] = useState("NONE");
  const [quantity, setQuantity] = useState("1");
  const [categoryName, setCategoryName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const [newImages, setNewImages] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const [selectedExistingImages, setSelectedExistingImages] = useState<
    string[]
  >([]);
  const [selectedPendingImages, setSelectedPendingImages] = useState<string[]>(
    [],
  );
  const [thumbnail, setThumbnail] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [video, setVideo] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [pdf, setPdf] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const [stockOnHand, setStockOnHand] = useState("0");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [adjustDelta, setAdjustDelta] = useState("0");
  const [adjustReason, setAdjustReason] = useState<
    "ADJUSTMENT" | "SALE" | "RESTOCK" | "RESERVATION" | "CANCELLATION"
  >("ADJUSTMENT");

  const selectedCategory = useMemo(
    () => categories.find((item) => item.name === categoryName),
    [categories, categoryName],
  );
  const subcategories = useMemo(
    () => selectedCategory?.subcategories ?? [],
    [selectedCategory],
  );
  const effectiveVideoUrl = video?.uri || product?.videoUrl || "";
  const videoPlayer = useVideoPlayer(effectiveVideoUrl, (player) => {
    player.loop = true;
  });
  const remainingImageSlots = Math.max(
    0,
    5 - (product?.images?.length ?? 0) - newImages.length,
  );

  useEffect(() => {
    if (isVendorApplicationLoading || blockedRedirectHandled.current) return;
    const status = vendorApplication?.status;
    if (status !== "APPROVED") {
      blockedRedirectHandled.current = true;
      Toast.show({
        type: "error",
        text1: status === "REJECTED" ? "Account rejected" : "Approval required",
        text2:
          status === "REJECTED"
            ? "Your vendor account is rejected. Re-apply from dashboard."
            : "Your account must be approved to edit products.",
        position: "top",
      });
      router.replace("/vendor/dashboard" as any);
    }
  }, [isVendorApplicationLoading, router, vendorApplication?.status]);

  useEffect(() => {
    if (!product) return;
    setTitle(product.title || "");
    setDescription(product.description || "");
    setPrice(String(product.price || "0"));
    setCurrency(product.currency || "INR");
    setProductType(product.productType || "MACHINERY");
    setCondition(product.condition || "NEW");
    setMachineType(product.machineType || "NONE");
    setQuantity(String(product.quantity ?? 1));
    setCategoryName(product.categoryName || product.category?.name || "");
    setSubCategory(product.subCategory || "");
    setManufacturer(product.manufacturer || "");
    setModel(product.model || "");
    setYear(product.year ? String(product.year) : "");
    setAdditionalInfo(product.additionalInfo || "");

    if (product.specifications && typeof product.specifications === "object") {
      const entries = Object.entries(product.specifications).filter(([k]) =>
        k.trim(),
      );
      setSpecs(
        entries.length
          ? entries.map(([key, value]) => ({ key, value: String(value) }))
          : [{ key: "", value: "" }],
      );
    } else {
      setSpecs([{ key: "", value: "" }]);
    }
  }, [product]);

  useEffect(() => {
    if (!categoryName && categories.length > 0) {
      setCategoryName(categories[0].name);
    }
  }, [categories, categoryName]);

  useEffect(() => {
    if (subCategory && !subcategories.includes(subCategory)) {
      setSubCategory("");
    }
  }, [subCategory, subcategories]);

  useEffect(() => {
    if (!inventory) return;
    setStockOnHand(String(inventory.stockOnHand ?? 0));
    setLowStockThreshold(
      typeof inventory.lowStockThreshold === "number"
        ? String(inventory.lowStockThreshold)
        : "",
    );
    setWarehouseLocation(inventory.warehouseLocation ?? "");
  }, [inventory]);

  useEffect(() => {
    if (!product?.images?.length) {
      setSelectedExistingImages([]);
      return;
    }
    setSelectedExistingImages((prev) =>
      prev.filter((url) => product.images?.includes(url)),
    );
  }, [product?.images]);

  useEffect(() => {
    if (!newImages.length) {
      setSelectedPendingImages([]);
      return;
    }
    const pendingUris = newImages.map((img) => img.uri);
    setSelectedPendingImages((prev) =>
      prev.filter((uri) => pendingUris.includes(uri)),
    );
  }, [newImages]);

  const pickImage = async (
    target: "gallery" | "thumbnail" | "videoThumbnail",
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant media permissions.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
      selectionLimit: target === "gallery" ? 5 : 1,
      allowsMultipleSelection: target === "gallery",
    });

    if (result.canceled) return;

    const mapped = result.assets.map((asset, idx) => ({
      uri: asset.uri,
      type: asset.mimeType || "image/jpeg",
      name: asset.fileName || `image-${Date.now()}-${idx}.jpg`,
    }));

    if (target === "gallery") {
      const remaining = Math.max(
        0,
        5 - (product?.images?.length ?? 0) - newImages.length,
      );
      if (mapped.length > remaining) {
        Toast.show({
          type: "info",
          text1: "Image limit reached",
          text2: `You can add ${remaining} more image(s).`,
          position: "top",
        });
      }
      setNewImages((prev) => [...prev, ...mapped.slice(0, remaining)]);
      return;
    }

    if (target === "thumbnail") {
      setThumbnail(mapped[0]);
      return;
    }

    setVideoThumbnail(mapped[0]);
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant media permissions.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return;
    const asset = result.assets[0];
    setVideo({
      uri: asset.uri,
      type: asset.mimeType || "video/mp4",
      name: asset.fileName || `video-${Date.now()}.mp4`,
    });
  };

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const file = result.assets[0];
    setPdf({
      uri: file.uri,
      type: file.mimeType || "application/pdf",
      name: file.name || `document-${Date.now()}.pdf`,
    });
  };

  const hasPendingMedia =
    !!thumbnail || newImages.length > 0 || !!video || !!videoThumbnail || !!pdf;

  const uploadPendingMedia = () => {
    if (!id || !hasPendingMedia) return;
    const fd = new FormData();
    if (thumbnail) fd.append("thumbnail", thumbnail as any);
    newImages.forEach((img) => fd.append("images", img as any));
    if (video) fd.append("video", video as any);
    if (videoThumbnail) fd.append("videoThumbnail", videoThumbnail as any);
    if (pdf) fd.append("pdf", pdf as any);

    uploadMedia(fd, {
      onSuccess: () => {
        setNewImages([]);
        setThumbnail(null);
        setVideo(null);
        setVideoThumbnail(null);
        setPdf(null);
      },
    });
  };

  const handleSaveInventory = () => {
    upsertInventory({
      stockOnHand: Number(stockOnHand || 0),
      lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : null,
      warehouseLocation: warehouseLocation || null,
    });
  };

  const handleAdjustInventory = () => {
    adjustInventory({
      delta: Number(adjustDelta || 0),
      reason: adjustReason,
    });
  };

  const toggleExistingImageSelection = (url: string) => {
    setSelectedExistingImages((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url],
    );
  };

  const togglePendingImageSelection = (uri: string) => {
    setSelectedPendingImages((prev) =>
      prev.includes(uri) ? prev.filter((item) => item !== uri) : [...prev, uri],
    );
  };

  const removeSelectedPendingImages = () => {
    if (!selectedPendingImages.length) return;
    setNewImages((prev) =>
      prev.filter((item) => !selectedPendingImages.includes(item.uri)),
    );
    setSelectedPendingImages([]);
  };

  const removeSelectedExistingImages = () => {
    if (!selectedExistingImages.length || isRemovingImage) return;
    Alert.alert(
      "Remove selected images",
      `Remove ${selectedExistingImages.length} selected image(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await Promise.allSettled(
              selectedExistingImages.map(
                (url) =>
                  new Promise<void>((resolve) => {
                    removeImage(url, {
                      onSettled: () => resolve(),
                    });
                  }),
              ),
            );
            setSelectedExistingImages([]);
          },
        },
      ],
    );
  };

  const openPdf = async () => {
    const url = pdf?.uri || product?.pdfUrl;
    if (!url) return;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Toast.show({
        type: "error",
        text1: "Cannot open PDF",
        position: "top",
      });
      return;
    }
    await Linking.openURL(url);
  };

  const handleSaveProduct = () => {
    const specObj: Record<string, string> = {};
    specs
      .filter((item) => item.key.trim())
      .forEach((item) => {
        specObj[item.key.trim()] = item.value.trim();
      });

    updateProduct(
      {
        title,
        description,
        price: Number(price || 0),
        currency,
        productType,
        condition,
        machineType:
          productType === "MACHINERY" && machineType !== "NONE"
            ? machineType
            : undefined,
        quantity: Number(quantity || 1),
        categoryName,
        subCategory: subCategory || undefined,
        manufacturer: manufacturer || undefined,
        model: model || undefined,
        year: year ? Number(year) : undefined,
        additionalInfo: additionalInfo || undefined,
        specifications: specObj,
      },
      {
        onSuccess: () => {
          if (hasPendingMedia) uploadPendingMedia();
        },
      },
    );
  };

  if (isVendorApplicationLoading || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF8C42" />
      </View>
    );
  }

  if (vendorApplication?.status !== "APPROVED") {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="small" color="#FF8C42" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="text-base text-gray-600 text-center">
          Unable to load product.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F5F6FA]">
      <StatusBar style="dark" />
      <View className="px-5 pt-12 pb-4 border-b border-gray-200 flex-row items-center justify-between bg-white">
        <Text className="text-2xl font-bold text-gray-900">Edit Product</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 180,
        }}
      >
        <View className="rounded-2xl border border-gray-200 bg-white p-4">
          {categoriesLoading && (
            <View className="flex-row items-center mb-3">
              <ActivityIndicator size="small" color="#111827" />
              <Text className="text-xs text-gray-500 ml-2">
                Loading categories...
              </Text>
            </View>
          )}
          {categoriesError && (
            <Text className="text-xs text-red-500 mb-3">
              Unable to load categories. Please try again.
            </Text>
          )}

          <TextInput
            placeholder="Product title"
            value={title}
            onChangeText={setTitle}
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 mt-3"
            placeholderTextColor="#9CA3AF"
            style={{ textAlignVertical: "top" }}
          />

          <View className="flex-row gap-2 mt-3">
            <TextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 flex-1"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 flex-1"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mt-4 gap-3">
            <DropdownField
              label="Currency"
              value={currency}
              options={CURRENCIES}
              onSelect={setCurrency}
            />
            <DropdownField
              label="Product Type"
              value={productType}
              options={PRODUCT_TYPES}
              onSelect={(next) => {
                setProductType(next);
                if (next !== "MACHINERY") {
                  setMachineType("NONE");
                }
              }}
            />
            <DropdownField
              label="Condition"
              value={condition}
              options={CONDITIONS}
              onSelect={setCondition}
            />
          </View>

          {productType === "MACHINERY" && (
            <View className="mt-3">
              <DropdownField
                label="Machine Type"
                value={machineType}
                options={MACHINE_TYPES}
                onSelect={setMachineType}
              />
            </View>
          )}

          <View className="mt-3 gap-3">
            <DropdownField
              label="Category"
              value={categoryName}
              options={categories.map((item) => item.name)}
              placeholder={
                categoriesLoading ? "Loading categories..." : "Select category"
              }
              disabled={categoriesLoading || categories.length === 0}
              onSelect={(next) => {
                setCategoryName(next);
                setSubCategory("");
              }}
            />
            <DropdownField
              label="Subcategory"
              value={subCategory}
              options={subcategories}
              placeholder={
                subcategories.length
                  ? "Select subcategory"
                  : "No subcategories available"
              }
              disabled={subcategories.length === 0}
              onSelect={setSubCategory}
            />
          </View>

          <View className="flex-row gap-2 mt-3">
            <TextInput
              placeholder="Manufacturer"
              value={manufacturer}
              onChangeText={setManufacturer}
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 flex-1"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              placeholder="Model"
              value={model}
              onChangeText={setModel}
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 flex-1"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TextInput
            placeholder="Year"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 mt-3"
            placeholderTextColor="#9CA3AF"
          />

          <Text className="text-xs font-semibold text-gray-700 mt-4 mb-2">
            Specifications
          </Text>
          <View className="gap-2">
            {specs.map((item, idx) => (
              <View key={idx} className="flex-row gap-2 items-center">
                <TextInput
                  placeholder="Key"
                  value={item.key}
                  onChangeText={(val) =>
                    setSpecs((prev) =>
                      prev.map((spec, i) =>
                        i === idx ? { ...spec, key: val } : spec,
                      ),
                    )
                  }
                  className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 flex-1"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  placeholder="Value"
                  value={item.value}
                  onChangeText={(val) =>
                    setSpecs((prev) =>
                      prev.map((spec, i) =>
                        i === idx ? { ...spec, value: val } : spec,
                      ),
                    )
                  }
                  className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 flex-1"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() =>
                    setSpecs((prev) =>
                      prev.length <= 1
                        ? prev
                        : prev.filter((_, i) => i !== idx),
                    )
                  }
                  className="w-9 h-9 rounded-lg items-center justify-center bg-red-50"
                >
                  <Feather name="trash-2" size={14} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={() =>
                setSpecs((prev) => [...prev, { key: "", value: "" }])
              }
              className="self-start px-3 py-2 rounded-lg bg-gray-100 mt-1"
            >
              <Text className="text-xs font-semibold text-gray-700">
                + Add specification
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Additional Information"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline
            numberOfLines={4}
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 mt-4"
            placeholderTextColor="#9CA3AF"
            style={{ textAlignVertical: "top" }}
          />
        </View>

        <View className="mt-5 p-4 rounded-2xl border border-gray-200 bg-white">
          <Text className="text-lg font-semibold text-gray-900">
            Media Manager
          </Text>
          <Text className="text-xs text-gray-500 mt-1 leading-5">
            Manage gallery, main thumbnail, video, video thumbnail, and PDF in
            dedicated sections.
          </Text>

          <View className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-gray-900">
                Gallery Images
              </Text>
              <VendorButton
                onPress={() => pickImage("gallery")}
                disabled={remainingImageSlots === 0}
                label={`Add (${remainingImageSlots})`}
                size="sm"
              />
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              Existing: {product.images?.length ?? 0}/5
            </Text>

            {!!product.images?.length && (
              <View className="mt-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-[11px] font-medium text-gray-600">
                    Current Gallery
                  </Text>
                  {selectedExistingImages.length > 0 && (
                    <VendorButton
                      onPress={removeSelectedExistingImages}
                      disabled={isRemovingImage}
                      loading={isRemovingImage}
                      label={`Remove (${selectedExistingImages.length})`}
                      variant="danger"
                      size="sm"
                      textClassName="text-[11px]"
                    />
                  )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2 pr-2">
                    {product.images.map((url) => {
                      const selected = selectedExistingImages.includes(url);
                      return (
                        <TouchableOpacity
                          key={url}
                          onPress={() => toggleExistingImageSelection(url)}
                          className={`relative rounded-xl border-2 ${selected ? "border-black" : "border-transparent"}`}
                        >
                          <Image
                            source={{ uri: url }}
                            style={{ width: 84, height: 84, borderRadius: 10 }}
                          />
                          <View
                            className={`absolute top-1 right-1 w-5 h-5 rounded-full items-center justify-center ${selected ? "bg-black" : "bg-black/40"}`}
                          >
                            <Feather
                              name={selected ? "check" : "circle"}
                              size={11}
                              color="#FFFFFF"
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            {newImages.length > 0 && (
              <View className="mt-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-[11px] font-medium text-gray-600">
                    Pending Upload
                  </Text>
                  {selectedPendingImages.length > 0 && (
                    <VendorButton
                      onPress={removeSelectedPendingImages}
                      label={`Remove (${selectedPendingImages.length})`}
                      variant="danger"
                      size="sm"
                      textClassName="text-[11px]"
                    />
                  )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2 pr-2">
                    {newImages.map((img) => {
                      const selected = selectedPendingImages.includes(img.uri);
                      return (
                        <TouchableOpacity
                          key={img.uri}
                          onPress={() => togglePendingImageSelection(img.uri)}
                          className={`relative rounded-xl border-2 ${selected ? "border-orange-500" : "border-transparent"}`}
                        >
                          <Image
                            source={{ uri: img.uri }}
                            style={{ width: 84, height: 84, borderRadius: 10 }}
                          />
                          <View
                            className={`absolute top-1 right-1 w-5 h-5 rounded-full items-center justify-center ${selected ? "bg-orange-500" : "bg-black/40"}`}
                          >
                            <Feather
                              name={selected ? "check" : "circle"}
                              size={11}
                              color="#FFFFFF"
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>

          <View className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-gray-900">
                Main Thumbnail
              </Text>
              <VendorButton
                onPress={() => pickImage("thumbnail")}
                label="Upload Thumbnail"
                size="sm"
              />
            </View>
            {(thumbnail || product.imagesThumbnail) && (
              <Image
                source={{
                  uri: thumbnail?.uri || product.imagesThumbnail || "",
                }}
                style={{
                  width: "100%",
                  height: 130,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              />
            )}
          </View>

          <View className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-gray-900">
                Video Upload
              </Text>
              <VendorButton
                onPress={pickVideo}
                label="Upload Video"
                size="sm"
              />
            </View>

            {video || product.videoUrl ? (
              <View className="mt-3">
                <Text className="text-[11px] text-gray-500 mb-2">
                  {video?.name || "Current video"}
                </Text>
                <View className="rounded-xl overflow-hidden border border-gray-200 bg-black">
                  <VideoView
                    style={{ width: "100%", height: 200 }}
                    player={videoPlayer}
                    allowsFullscreen
                    allowsPictureInPicture
                    contentFit="contain"
                    nativeControls
                  />
                </View>
              </View>
            ) : (
              <Text className="text-xs text-gray-500 mt-3">
                No video uploaded yet.
              </Text>
            )}
          </View>

          <View className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-gray-900">
                Video Thumbnail
              </Text>
              <VendorButton
                onPress={() => pickImage("videoThumbnail")}
                label="Upload Thumb"
                size="sm"
              />
            </View>
            {(videoThumbnail || product.videoThumbnail) && (
              <Image
                source={{
                  uri: videoThumbnail?.uri || product.videoThumbnail || "",
                }}
                style={{
                  width: "100%",
                  height: 130,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              />
            )}
          </View>

          <View className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-gray-900">
                PDF Upload
              </Text>
              <VendorButton onPress={pickPdf} label="Upload PDF" size="sm" />
            </View>

            {pdf || product.pdfUrl ? (
              <TouchableOpacity
                onPress={openPdf}
                className="mt-3 rounded-xl border border-gray-200 bg-white p-3 flex-row items-center"
              >
                <Feather name="file-text" size={18} color="#374151" />
                <Text
                  className="text-sm text-gray-700 ml-2 flex-1"
                  numberOfLines={1}
                >
                  {pdf?.name || "View attached PDF"}
                </Text>
                <Feather name="external-link" size={16} color="#6B7280" />
              </TouchableOpacity>
            ) : (
              <Text className="text-xs text-gray-500 mt-3">
                No PDF attached yet.
              </Text>
            )}
          </View>

          <Text className="text-xs text-gray-500 mt-3">
            Pending: {newImages.length} images {thumbnail ? "• thumbnail" : ""}{" "}
            {video ? "• video" : ""} {videoThumbnail ? "• video thumb" : ""}{" "}
            {pdf ? "• pdf" : ""}
          </Text>

          {isUploadingMedia && (
            <Text className="text-xs text-gray-500 mt-3">
              Uploading selected media...
            </Text>
          )}
        </View>

        <View className="mt-5 p-4 rounded-2xl border border-gray-200 bg-white">
          <Text className="text-base font-semibold text-gray-900">
            Inventory
          </Text>
          <TextInput
            placeholder="Stock on hand"
            value={stockOnHand}
            onChangeText={setStockOnHand}
            keyboardType="number-pad"
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 mt-3"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            placeholder="Low stock threshold"
            value={lowStockThreshold}
            onChangeText={setLowStockThreshold}
            keyboardType="number-pad"
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 mt-3"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            placeholder="Warehouse location"
            value={warehouseLocation}
            onChangeText={setWarehouseLocation}
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 mt-3"
            placeholderTextColor="#9CA3AF"
          />
          <VendorButton
            onPress={handleSaveInventory}
            disabled={isSavingInventory}
            loading={isSavingInventory}
            label={isSavingInventory ? "Saving Inventory..." : "Save Inventory"}
            className="mt-3"
          />

          <View className="mt-4 p-3 rounded-xl bg-gray-50">
            <Text className="text-sm font-medium text-gray-800">
              Quick Adjustment
            </Text>
            <TextInput
              placeholder="Delta (+/-)"
              value={adjustDelta}
              onChangeText={setAdjustDelta}
              keyboardType="number-pad"
              className="bg-white rounded-xl px-4 py-3 text-gray-900 mt-3"
              placeholderTextColor="#9CA3AF"
            />
            <View className="mt-3">
              <DropdownField
                label="Adjustment Reason"
                value={adjustReason}
                options={[...ADJUST_REASONS]}
                onSelect={(next) =>
                  setAdjustReason(
                    next as
                      | "ADJUSTMENT"
                      | "SALE"
                      | "RESTOCK"
                      | "RESERVATION"
                      | "CANCELLATION",
                  )
                }
              />
            </View>
            <VendorButton
              onPress={handleAdjustInventory}
              disabled={isAdjustingInventory}
              loading={isAdjustingInventory}
              label={isAdjustingInventory ? "Adjusting..." : "Apply Adjustment"}
              variant="accent"
              className="mt-3"
            />
          </View>
        </View>
      </ScrollView>

      <View className="absolute left-0 right-0 bottom-0 border-t border-gray-200 bg-white px-5 py-4">
        <View className="flex-row items-center justify-end gap-2">
          <VendorButton
            onPress={handleSaveProduct}
            disabled={isUpdating || isUploadingMedia}
            loading={isUpdating || isUploadingMedia}
            label={
              isUploadingMedia
                ? "Uploading..."
                : isUpdating
                  ? "Saving..."
                  : "Save Changes"
            }
            size="md"
            className="min-w-[138px]"
          />

          <VendorButton
            onPress={() =>
              submitProduct(undefined, {
                onSuccess: () => router.replace("/vendor/products" as any),
              })
            }
            disabled={isSubmitting || isUploadingMedia || hasPendingMedia}
            loading={isSubmitting}
            label={
              hasPendingMedia
                ? "Save Media First"
                : isSubmitting
                  ? "Submitting..."
                  : "Submit For Review"
            }
            variant="accent"
            size="md"
            className="min-w-[156px]"
          />
        </View>
      </View>
    </View>
  );
}
