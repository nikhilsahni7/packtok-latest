import VendorButton from "@/components/VendorButton";
import { useVendorApplication } from "@/hooks/useVendorApplication";
import {
  useDeleteVendorProduct,
  useSubmitVendorProduct,
  useVendorProducts,
} from "@/hooks/useVendorProducts";
import { useMyVendorSubscription } from "@/hooks/useVendorSubscription";
import api from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const tabs = [
  { key: "all", label: "All" },
  { key: "drafts", label: "Drafts" },
  { key: "released", label: "Released" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function VendorProductsScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [isBulkPublishing, setIsBulkPublishing] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    if (
      params.tab === "drafts" ||
      params.tab === "released" ||
      params.tab === "all"
    ) {
      setActiveTab(params.tab);
    }
  }, [params.tab]);

  const filters = useMemo(() => {
    if (activeTab === "drafts") return { status: "DRAFT" };
    if (activeTab === "released") return { submissionStatus: "APPROVED" };
    return undefined;
  }, [activeTab]);

  const {
    data: products = [],
    isLoading,
    refetch,
    isFetching,
  } = useVendorProducts(filters);
  const { data: vendorApp, refetch: refetchVendorApplication } =
    useVendorApplication();
  const { data: subInfo, refetch: refetchVendorSubscription } =
    useMyVendorSubscription();
  const { mutate: deleteProduct, isPending: isDeleting } =
    useDeleteVendorProduct();

  const openCreateDraft = async () => {
    const [applicationResult, subscriptionResult] = await Promise.allSettled([
      refetchVendorApplication(),
      refetchVendorSubscription(),
    ]);

    const latestVendorApplication =
      applicationResult.status === "fulfilled"
        ? (applicationResult.value.data ?? vendorApp)
        : vendorApp;
    const latestSubscriptionInfo =
      subscriptionResult.status === "fulfilled"
        ? (subscriptionResult.value.data ?? subInfo)
        : subInfo;

    const isApproved = latestVendorApplication?.status === "APPROVED";
    if (!isApproved) {
      Toast.show({
        type: "error",
        text1:
          latestVendorApplication?.status === "REJECTED"
            ? "Account rejected"
            : "Vendor approval required",
        text2:
          latestVendorApplication?.status === "REJECTED"
            ? "Your account was rejected by admin. Re-apply from dashboard."
            : "Your account must be approved before adding products.",
        position: "top",
      });
      if (latestVendorApplication?.status === "REJECTED") {
        router.push("/vendor/dashboard" as any);
      }
      return;
    }

    if (!latestSubscriptionInfo?.canCreateProduct) {
      Toast.show({
        type: "error",
        text1: "Product limit reached",
        text2: "Upgrade your subscription to add more products.",
        position: "top",
      });
      router.push("/vendor/subscription" as any);
      return;
    }

    router.push("/vendor/products/new" as any);
  };

  useEffect(() => {
    setSelected([]);
  }, [activeTab]);

  const stats = useMemo(() => {
    const total = products.length;
    const drafts = products.filter((p) => p.status === "DRAFT").length;
    const pending = products.filter(
      (p) => p.submissionStatus === "PENDING_APPROVAL",
    ).length;
    const approved = products.filter(
      (p) => p.submissionStatus === "APPROVED",
    ).length;
    return { total, drafts, pending, approved };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [
        product.title,
        product.description,
        product.categoryName ?? "",
        product.currency,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [products, search]);

  const heading =
    activeTab === "drafts"
      ? "Drafts"
      : activeTab === "released"
        ? "Released"
        : "Products";

  const toggleSelected = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const openDelete = (id: string, title: string) => {
    Alert.alert(
      "Delete Product",
      `Delete ${title}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteProduct(id),
        },
      ],
    );
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    Alert.alert(
      "Delete selected products",
      `Delete ${selected.length} selected product(s)? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsBulkDeleting(true);
            try {
              await Promise.allSettled(
                selected.map((id) =>
                  api.delete(`/api/v1/vendors/products/${id}`),
                ),
              );
              setSelected([]);
              await refetch();
              qc.invalidateQueries({ queryKey: ["vendor-products"] });
              qc.invalidateQueries({ queryKey: ["vendor-subscription-info"] });
              Toast.show({
                type: "success",
                text1: "Products deleted",
                position: "top",
              });
            } catch {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: "Please try again.",
                position: "top",
              });
            } finally {
              setIsBulkDeleting(false);
            }
          },
        },
      ],
    );
  };

  const handleBulkPublish = async () => {
    if (selected.length === 0) return;
    setIsBulkPublishing(true);
    try {
      await Promise.allSettled(
        selected.map((id) => api.post(`/api/v1/vendors/products/${id}/submit`)),
      );
      setSelected([]);
      await refetch();
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      Toast.show({
        type: "success",
        text1: "Submitted for review",
        text2: "Selected drafts have been submitted.",
        position: "top",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Publish failed",
        text2: "Please try again.",
        position: "top",
      });
    } finally {
      setIsBulkPublishing(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F4F4F4]">
      <StatusBar style="dark" />

      <View className="px-5 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-4xl font-bold text-gray-900">{heading}</Text>
          <VendorButton
            onPress={openCreateDraft}
            label="New"
            size="sm"
            className="h-10"
          />
        </View>

        <View className="flex-row mt-4 bg-white rounded-xl p-1 border border-gray-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`flex-1 rounded-lg py-2 items-center ${isActive ? "bg-gray-900" : ""}`}
              >
                <Text
                  className={`text-xs font-semibold ${isActive ? "text-white" : "text-gray-500"}`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="flex-row items-center mt-3 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
          <Feather name="search" size={16} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search product"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm text-gray-900"
          />
        </View>

        <View className="flex-row mt-4 gap-2">
          <View className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <Text className="text-[10px] text-gray-500">Total</Text>
            <Text className="text-sm font-semibold text-gray-900 mt-0.5">
              {stats.total}
            </Text>
          </View>
          <View className="flex-1 bg-amber-50 rounded-xl p-3 border border-amber-100">
            <Text className="text-[10px] text-amber-700">Pending</Text>
            <Text className="text-sm font-semibold text-amber-900 mt-0.5">
              {stats.pending}
            </Text>
          </View>
          <View className="flex-1 bg-green-50 rounded-xl p-3 border border-green-100">
            <Text className="text-[10px] text-green-700">Live</Text>
            <Text className="text-sm font-semibold text-green-900 mt-0.5">
              {stats.approved}
            </Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF8C42" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor="#FF8C42"
            />
          }
        >
          <View className="px-5 py-5">
            {filteredProducts.length === 0 ? (
              <View className="bg-gray-50 rounded-2xl p-6 items-center">
                <Feather name="inbox" size={26} color="#9CA3AF" />
                <Text className="text-sm text-gray-500 mt-2">
                  No products found for this tab.
                </Text>
              </View>
            ) : (
              filteredProducts.map((product, index) => {
                const isDraft = product.status === "DRAFT";
                const isApproved = product.submissionStatus === "APPROVED";
                const isRejected = product.submissionStatus === "REJECTED";
                const isPending =
                  product.submissionStatus === "PENDING_APPROVAL";
                const isSelected = selected.includes(product.id);
                const showSelectionControls =
                  activeTab === "drafts" || activeTab === "released";

                return (
                  <TouchableOpacity
                    key={product.id}
                    activeOpacity={0.9}
                    onPress={() =>
                      showSelectionControls
                        ? toggleSelected(product.id)
                        : router.push(`/vendor/products/${product.id}` as any)
                    }
                    className={`bg-white rounded-2xl border p-4 mb-3 ${isSelected ? "border-gray-900" : "border-gray-200"}`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-row flex-1 pr-3">
                        <View className="w-[56px] h-[56px] rounded-lg overflow-hidden bg-gray-100 items-center justify-center">
                          {product.imagesThumbnail ? (
                            <Image
                              source={{ uri: product.imagesThumbnail }}
                              style={{ width: "100%", height: "100%" }}
                              resizeMode="cover"
                            />
                          ) : (
                            <Feather name="image" size={18} color="#9CA3AF" />
                          )}
                        </View>
                        <View className="flex-1 ml-3">
                          <Text
                            className="text-base font-semibold text-gray-900"
                            numberOfLines={2}
                          >
                            {product.title}
                          </Text>
                          <Text className="text-sm font-semibold text-gray-900 mt-1">
                            {product.currency}{" "}
                            {Number.parseFloat(product.price).toLocaleString()}
                          </Text>
                          <Text className="text-xs text-gray-500 mt-1">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>

                      <View className="items-end">
                        {showSelectionControls && (
                          <View
                            className={`w-5 h-5 rounded border items-center justify-center ${isSelected ? "bg-gray-900 border-gray-900" : "border-gray-300 bg-white"}`}
                          >
                            {isSelected ? (
                              <Feather name="check" size={12} color="#fff" />
                            ) : null}
                          </View>
                        )}
                        {!showSelectionControls && (
                          <TouchableOpacity
                            onPress={() =>
                              openDelete(product.id, product.title)
                            }
                            disabled={isDeleting}
                          >
                            <Feather name="trash-2" size={18} color="#DC2626" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    <View className="flex-row items-center mt-3 gap-2 flex-wrap">
                      <View
                        className={`px-2 py-1 rounded-full ${isDraft ? "bg-gray-100" : "bg-blue-50"}`}
                      >
                        <Text className="text-[10px] text-gray-700">
                          {product.status}
                        </Text>
                      </View>
                      {isPending && (
                        <View className="px-2 py-1 rounded-full bg-amber-100">
                          <Text className="text-[10px] text-amber-700">
                            Pending Review
                          </Text>
                        </View>
                      )}
                      {isApproved && (
                        <View className="px-2 py-1 rounded-full bg-green-100">
                          <Text className="text-[10px] text-green-700">
                            Active
                          </Text>
                        </View>
                      )}
                      {isRejected && (
                        <View className="px-2 py-1 rounded-full bg-red-100">
                          <Text className="text-[10px] text-red-700">
                            Rejected
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-row gap-2 mt-4">
                      <VendorButton
                        onPress={() =>
                          router.push(`/vendor/products/${product.id}` as any)
                        }
                        label="Edit"
                        variant="secondary"
                        className="flex-1"
                      />
                      {isDraft && <SubmitButton productId={product.id} />}
                      {isApproved && (
                        <View className="flex-1 py-2.5 rounded-xl bg-green-100 items-center">
                          <Text className="text-sm font-medium text-green-700">
                            Live
                          </Text>
                        </View>
                      )}
                    </View>

                    {product.reviewNotes ? (
                      <Text
                        className="text-xs text-red-600 mt-2"
                        numberOfLines={2}
                      >
                        Review: {product.reviewNotes}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      {(selected.length > 0 || isBulkDeleting || isBulkPublishing) && (
        <View className="px-5 py-3 border-t border-gray-200 bg-white">
          <Text className="text-xs text-gray-500 mb-2">
            {selected.length} product{selected.length === 1 ? "" : "s"} selected
          </Text>
          <View className="flex-row gap-2">
            <VendorButton
              onPress={handleBulkDelete}
              disabled={isBulkDeleting || isBulkPublishing}
              loading={isBulkDeleting}
              label={isBulkDeleting ? "Deleting..." : "Delete"}
              variant="secondary"
              className="flex-1"
            />
            <VendorButton
              onPress={handleBulkPublish}
              disabled={
                isBulkPublishing || isBulkDeleting || activeTab !== "drafts"
              }
              loading={isBulkPublishing}
              label={isBulkPublishing ? "Publishing..." : "Publish now"}
              className="flex-1"
            />
          </View>
        </View>
      )}
    </View>
  );
}

function SubmitButton({ productId }: { productId: string }) {
  const { mutate: submit, isPending } = useSubmitVendorProduct(productId);

  return (
    <VendorButton
      onPress={() => submit()}
      disabled={isPending}
      loading={isPending}
      label={isPending ? "Submitting..." : "Submit"}
      className="flex-1"
    />
  );
}
