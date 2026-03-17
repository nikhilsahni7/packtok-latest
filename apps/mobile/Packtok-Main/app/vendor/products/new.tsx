import DropdownField from "@/components/DropdownField";
import VendorButton from "@/components/VendorButton";
import { useCategories } from "@/hooks/useCategories";
import { useVendorApplication } from "@/hooks/useVendorApplication";
import { useCreateVendorProductDraft } from "@/hooks/useVendorProducts";
import { useMyVendorSubscription } from "@/hooks/useVendorSubscription";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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

export default function VendorNewProductScreen() {
  const router = useRouter();
  const { mutate: createDraft, isPending } = useCreateVendorProductDraft();
  const {
    data: vendorApp,
    isLoading: appLoading,
    refetch: refetchVendorApplication,
  } = useVendorApplication();
  const {
    data: subInfo,
    isLoading: subLoading,
    refetch: refetchVendorSubscription,
  } = useMyVendorSubscription();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

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

  const selectedCategory = useMemo(
    () => categories.find((item) => item.name === categoryName),
    [categories, categoryName],
  );
  const subcategories = selectedCategory?.subcategories ?? [];
  const isApproved = vendorApp?.status === "APPROVED";
  const canCreate = subInfo?.canCreateProduct ?? false;
  const productCount = subInfo?.productCount ?? 0;
  const productLimit = subInfo?.productLimit ?? 0;
  const planName = subInfo?.subscription?.planNameSnapshot ?? "Free";
  const usagePercent =
    productLimit > 0 ? Math.min(100, (productCount / productLimit) * 100) : 0;

  useFocusEffect(
    useCallback(() => {
      void refetchVendorApplication();
      void refetchVendorSubscription();
      return undefined;
    }, [refetchVendorApplication, refetchVendorSubscription]),
  );

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

  const addSpec = () => setSpecs((prev) => [...prev, { key: "", value: "" }]);
  const removeSpec = (idx: number) => {
    setSpecs((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx),
    );
  };

  const onCreate = () => {
    if (!isApproved) {
      Toast.show({
        type: "error",
        text1: "Vendor approval required",
        text2: "Your account must be approved before creating products.",
        position: "top",
      });
      return;
    }

    if (!canCreate) {
      Toast.show({
        type: "error",
        text1: "Product limit reached",
        text2: "Upgrade your subscription to add more products.",
        position: "top",
      });
      return;
    }

    if (title.trim().length < 3) {
      Toast.show({
        type: "error",
        text1: "Title is too short",
        text2: "Enter at least 3 characters.",
        position: "top",
      });
      return;
    }
    if (description.trim().length < 10) {
      Toast.show({
        type: "error",
        text1: "Description is too short",
        text2: "Enter at least 10 characters.",
        position: "top",
      });
      return;
    }
    if (!categoryName) {
      Toast.show({
        type: "error",
        text1: "Category is required",
        text2: "Select a category before creating a draft.",
        position: "top",
      });
      return;
    }

    const parsedPrice = Number(price || 0);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      Toast.show({
        type: "error",
        text1: "Invalid price",
        text2: "Enter a valid non-negative price.",
        position: "top",
      });
      return;
    }

    const parsedQuantity = Number(quantity || 0);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      Toast.show({
        type: "error",
        text1: "Invalid quantity",
        text2: "Quantity must be at least 1.",
        position: "top",
      });
      return;
    }

    const specObj: Record<string, string> = {};
    specs
      .filter((s) => s.key.trim())
      .forEach((s) => {
        specObj[s.key.trim()] = s.value.trim();
      });

    createDraft(
      {
        title,
        description,
        price: parsedPrice,
        currency,
        productType,
        condition,
        machineType:
          productType === "MACHINERY" && machineType !== "NONE"
            ? machineType
            : undefined,
        quantity: parsedQuantity,
        categoryName,
        subCategory: subCategory || undefined,
        manufacturer: manufacturer || undefined,
        model: model || undefined,
        year: year ? Number(year) : undefined,
        additionalInfo: additionalInfo || undefined,
        specifications: specObj,
      },
      {
        onSuccess: (result: any) => {
          if (result?.id) {
            router.replace(`/vendor/products/${result.id}` as any);
            return;
          }
          router.replace("/vendor/products" as any);
        },
      },
    );
  };

  if (appLoading || subLoading) {
    return (
      <View className="flex-1 bg-[#F5F6FA] items-center justify-center">
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (!isApproved) {
    return (
      <View className="flex-1 bg-[#F5F6FA]">
        <StatusBar style="dark" />
        <View className="px-5 pt-12 pb-4 border-b border-gray-200 flex-row items-center justify-between bg-white">
          <Text className="text-2xl font-bold text-gray-900">Create Draft</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" size={22} color="#111827" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 px-5 py-6">
          <View className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <Text className="text-lg font-bold text-amber-900">
              Vendor Account Not Approved
            </Text>
            <Text className="text-sm text-amber-800 mt-2 leading-5">
              {vendorApp?.status === "PENDING"
                ? "Your vendor application is under review. You can add products after approval."
                : vendorApp?.status === "REJECTED"
                  ? "Your vendor application was rejected. Please reapply from the dashboard."
                  : "Your vendor profile needs admin approval before adding products."}
            </Text>
            <VendorButton
              onPress={() => router.replace("/vendor/dashboard" as any)}
              label="Go To Dashboard"
              variant="info"
              className="mt-5"
            />
          </View>
        </View>
      </View>
    );
  }

  if (!canCreate) {
    return (
      <View className="flex-1 bg-[#F5F6FA]">
        <StatusBar style="dark" />
        <View className="px-5 pt-12 pb-4 border-b border-gray-200 flex-row items-center justify-between bg-white">
          <Text className="text-2xl font-bold text-gray-900">Create Draft</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" size={22} color="#111827" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 px-5 py-6">
          <View className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <Text className="text-lg font-bold text-orange-900">
              Product Limit Reached
            </Text>
            <Text className="text-sm text-orange-800 mt-2 leading-5">
              You used {productCount} of {productLimit} products on the{" "}
              {planName} plan.
            </Text>
            <View className="mt-4 h-2.5 rounded-full bg-orange-200 overflow-hidden">
              <View
                className="h-2.5 bg-orange-500"
                style={{ width: `${usagePercent}%` }}
              />
            </View>
            <VendorButton
              onPress={() => router.push("/vendor/subscription" as any)}
              label="Upgrade Plan"
              variant="accent"
              className="mt-5"
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F5F6FA]">
      <StatusBar style="dark" />
      <View className="px-5 pt-12 pb-4 border-b border-gray-200 flex-row items-center justify-between bg-white">
        <Text className="text-2xl font-bold text-gray-900">Create Draft</Text>
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
          paddingBottom: 140,
        }}
      >
        <View className="rounded-2xl border border-blue-200 bg-blue-50 p-4 mb-4">
          <Text className="text-sm text-blue-900 font-semibold">
            {planName} Plan
          </Text>
          <Text className="text-xs text-blue-800 mt-1">
            {productCount}/{productLimit} products used
          </Text>
          <View className="mt-3 h-2 rounded-full bg-blue-200 overflow-hidden">
            <View
              className="h-2 bg-blue-500"
              style={{ width: `${usagePercent}%` }}
            />
          </View>
        </View>

        <View className="rounded-2xl border border-gray-200 bg-white p-4">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            Product Details
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            Fill all required details. Media and inventory can be added after
            draft creation.
          </Text>

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
                  onPress={() => removeSpec(idx)}
                  className="w-9 h-9 rounded-lg items-center justify-center bg-red-50"
                >
                  <Feather name="trash-2" size={14} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={addSpec}
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
      </ScrollView>

      <View className="absolute left-0 right-0 bottom-0 border-t border-gray-200 bg-white px-5 py-4">
        <VendorButton
          onPress={onCreate}
          disabled={isPending}
          loading={isPending}
          label={isPending ? "Creating Draft..." : "Create Draft"}
          variant="primary"
          size="lg"
        />
      </View>
    </View>
  );
}
