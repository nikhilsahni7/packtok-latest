import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  QuoteStatus,
  useCancelQuoteRequest,
  useQuoteRequestDetails,
} from "../hooks/useQuoteRequests";
import { useQuoteSocket } from "../hooks/useQuoteSocket";
import { useAuthStore } from "../store/auth-store";

export default function QuoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const { data: quote, isLoading, refetch } = useQuoteRequestDetails(id || "");
  const { mutate: cancelQuote, isPending: isCancelling } =
    useCancelQuoteRequest();
  const [refreshing, setRefreshing] = useState(false);

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelSubmit = () => {
    if (!cancelReason.trim() || !quote?.id) return;
    cancelQuote(
      { id: quote.id, reason: cancelReason.trim() },
      {
        onSuccess: () => {
          setCancellingId(null);
          setCancelReason("");
        },
      }
    );
  };

  // Connect to socket for real-time updates
  useQuoteSocket(user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusBadgeStyle = (status: QuoteStatus) => {
    const statusStyles: Record<
      QuoteStatus,
      { bg: string; text: string; label: string }
    > = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "PENDING",
      },
      REVIEWED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "REVIEWED",
      },
      COMPLETED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "COMPLETED",
      },
      CANCELLED: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "CANCELLED",
      },
    };
    return statusStyles[status] || statusStyles.PENDING;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewProduct = () => {
    if (quote?.productId && quote?.product?.productType) {
      // Map ProductType to route format
      const productTypeMap: Record<string, string> = {
        MACHINERY: "machinery",
        SPARE_PARTS: "spare-parts",
        CONSUMABLES: "consumables",
        RAW_MATERIALS: "raw-material",
      };
      const category = productTypeMap[quote.product.productType];
      if (category) {
        router.push(`/marketplace/${category}/${quote.productId}` as any);
      }
    }
  };

  const handleContactSupport = async () => {
    const email = "Packtok01@gmail.com";
    const subject = `Quote Request #${quote?.id.slice(0, 8)}`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF8C42" />
          <Text className="text-gray-500 mt-4">Loading quote details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!quote) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 items-center justify-center px-5">
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">
            Quote Not Found
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            The quote request you&apos;re looking for doesn&apos;t exist or has
            been removed.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#FF8C42] px-6 py-3 rounded-xl"
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusBadgeStyle(quote.status);
  const productImage = quote.product?.images?.[0];
  const productTypeMap: Record<string, string> = {
    MACHINERY: "machinery",
    SPARE_PARTS: "spare-parts",
    CONSUMABLES: "consumables",
    RAW_MATERIALS: "raw-material",
  };
  const hasRoutableProduct =
    Boolean(quote.productId) &&
    Boolean(quote.product?.productType) &&
    Boolean(productTypeMap[quote.product.productType]);
  const unavailableStatuses = new Set(["OUT_OF_STOCK", "DRAFT", "SOLD"]);
  const isExplicitlyUnavailable = quote.product?.status
    ? unavailableStatuses.has(quote.product.status)
    : false;
  const isProductAvailable = hasRoutableProduct && !isExplicitlyUnavailable;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Quote Details</Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF8C42"
            colors={["#FF8C42"]}
          />
        }
      >
        {/* Status Section */}
        <View className="px-5 py-6 bg-gray-50 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm text-gray-600">Request ID</Text>
            <Text className="text-sm font-mono text-gray-900">
              #{quote.id.slice(0, 8)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">Status</Text>
            <View className={`${statusStyle.bg} px-4 py-2 rounded-full`}>
              <Text className={`text-sm font-semibold ${statusStyle.text}`}>
                {statusStyle.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Product Section */}
        <View className="px-5 py-6 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Product</Text>
          <View className="bg-white border border-gray-200 rounded-2xl p-4">
            <View className="flex-row items-start mb-3">
              {productImage ? (
                <Image
                  source={{ uri: productImage }}
                  className="w-20 h-20 rounded-lg mr-4"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-20 h-20 rounded-lg bg-gray-100 items-center justify-center mr-4">
                  <Feather name="package" size={28} color="#9CA3AF" />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  {quote.product?.title || "Product"}
                </Text>
                {quote.product?.manufacturer && (
                  <Text className="text-sm text-gray-600 mb-2">
                    {quote.product.manufacturer}
                  </Text>
                )}
                {quote.product?.description && (
                  <Text className="text-sm text-gray-500" numberOfLines={2}>
                    {quote.product.description}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={isProductAvailable ? handleViewProduct : undefined}
              disabled={!isProductAvailable}
              className={`py-3 rounded-xl flex-row items-center justify-center ${
                isProductAvailable ? "bg-[#FF8C42]" : "bg-gray-300"
              }`}
              activeOpacity={0.7}
            >
              <Feather
                name={isProductAvailable ? "external-link" : "slash"}
                size={18}
                color="#FFF"
              />
              <Text className="text-white font-semibold ml-2">
                {isProductAvailable
                  ? "View Product in App"
                  : "Product Not Available"}
              </Text>
            </TouchableOpacity>
            {!isProductAvailable && (
              <Text className="text-xs text-red-500 mt-2">
                This product is currently unavailable.
              </Text>
            )}
          </View>
        </View>

        {/* Quote Request Details */}
        <View className="px-5 py-6 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Request Details
          </Text>

          <View className="space-y-4">
            {/* Company Name */}
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">Company Name</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base text-gray-900">
                  {quote.companyName}
                </Text>
              </View>
            </View>

            {/* Contact Details */}
            {(quote.phone || quote.email) && (
              <View className="mb-4 flex-row justify-between">
                {quote.phone && (
                  <View className="flex-1 mr-2">
                    <Text className="text-sm text-gray-600 mb-2">Phone</Text>
                    <View className="bg-gray-50 rounded-xl p-4">
                      <Text className="text-base text-gray-900">
                        {quote.phone}
                      </Text>
                    </View>
                  </View>
                )}
                {quote.email && (
                  <View className="flex-1 ml-2">
                    <Text className="text-sm text-gray-600 mb-2">Email</Text>
                    <View className="bg-gray-50 rounded-xl p-4">
                      <Text className="text-xs text-gray-900">
                        {quote.email}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Address */}
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">Address</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base text-gray-900">{quote.address}</Text>
              </View>
            </View>

            {/* Message */}
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">Message</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-base text-gray-900 leading-6">
                  {quote.message}
                </Text>
              </View>
            </View>

            {/* Additional Info */}
            {quote.additionalInfo && (
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">
                  Additional Information
                </Text>
                <View className="bg-gray-50 rounded-xl p-4">
                  <Text className="text-base text-gray-900 leading-6">
                    {quote.additionalInfo}
                  </Text>
                </View>
              </View>
            )}

            {/* Cancellation Reason warning */}
            {quote.status === "CANCELLED" && quote.cancellationReason && (
              <View className="mt-2 bg-red-50 border border-red-100 rounded-xl p-4 flex-row items-start">
                <Feather
                  name="alert-triangle"
                  size={16}
                  color="#EF4444"
                  className="mt-0.5 mr-3"
                />
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">
                    Cancellation Reason
                  </Text>
                  <Text className="text-sm text-red-600">
                    {quote.cancellationReason}
                  </Text>
                </View>
              </View>
            )}

            {/* Admin Response Block */}
            {quote.response && (
              <View className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                    Response from Packtok
                  </Text>
                  {quote.respondedAt && (
                    <Text className="text-[10px] text-orange-400 font-bold">
                      {new Date(quote.respondedAt).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                <Text className="text-sm text-orange-900 leading-relaxed">
                  {quote.response}
                </Text>
              </View>
            )}

            {/* Actions Row */}
            {quote.status === "PENDING" && !cancellingId && (
              <View className="mt-4 flex-row">
                <TouchableOpacity
                  onPress={() => setCancellingId(quote.id)}
                  className="bg-red-50 px-5 py-3 rounded-xl flex-row items-center border border-red-100"
                >
                  <Feather
                    name="x-circle"
                    size={16}
                    color="#DC2626"
                    className="mr-2"
                  />
                  <Text className="text-red-600 font-bold">
                    Withdraw Request
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Cancel Dialog */}
            {cancellingId === quote.id && (
              <View className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                <Text className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                  Reason for Withdrawal
                </Text>
                <TextInput
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  placeholder="Please tell us why you're cancelling..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  className="bg-white border border-red-200 rounded-lg p-3 text-sm text-gray-900 font-medium mb-3 h-24 text-left items-start justify-start"
                  textAlignVertical="top"
                />
                <View className="flex-row justify-end space-x-2">
                  <TouchableOpacity
                    onPress={() => {
                      setCancellingId(null);
                      setCancelReason("");
                    }}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg mr-2"
                  >
                    <Text className="text-gray-600 text-xs font-bold">
                      Keep Request
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancelSubmit}
                    disabled={isCancelling || !cancelReason.trim()}
                    className={`px-4 py-3 bg-red-600 rounded-lg flex-row items-center ${!cancelReason.trim() || isCancelling ? "opacity-50" : ""}`}
                  >
                    {isCancelling ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Feather
                          name="send"
                          size={14}
                          color="white"
                          className="mr-2"
                        />
                        <Text className="text-white text-xs font-bold">
                          Confirm
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Timeline */}
        <View className="px-5 py-6 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Timeline</Text>

          <View className="space-y-4">
            {/* Created */}
            <View className="flex-row">
              <View className="items-center mr-4">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                  <Feather name="check" size={20} color="#22C55E" />
                </View>
                <View className="w-0.5 h-12 bg-gray-200 my-1" />
              </View>
              <View className="flex-1 pb-4">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Quote Request Submitted
                </Text>
                <Text className="text-sm text-gray-500">
                  {formatDate(quote.createdAt)}
                </Text>
              </View>
            </View>

            {/* Updated */}
            {quote.updatedAt !== quote.createdAt && (
              <View className="flex-row">
                <View className="items-center mr-4">
                  <View
                    className={`w-10 h-10 rounded-full ${
                      quote.status === "REVIEWED"
                        ? "bg-blue-100"
                        : quote.status === "COMPLETED"
                          ? "bg-green-100"
                          : "bg-gray-100"
                    } items-center justify-center`}
                  >
                    <Feather
                      name="clock"
                      size={20}
                      color={
                        quote.status === "REVIEWED"
                          ? "#3B82F6"
                          : quote.status === "COMPLETED"
                            ? "#22C55E"
                            : "#9CA3AF"
                      }
                    />
                  </View>
                  {quote.status === "COMPLETED" && (
                    <View className="w-0.5 h-12 bg-gray-200 my-1" />
                  )}
                </View>
                <View className="flex-1 pb-4">
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    Status Updated
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {formatDate(quote.updatedAt)}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    Current status: {statusStyle.label}
                  </Text>
                </View>
              </View>
            )}

            {/* Completed */}
            {quote.status === "COMPLETED" && (
              <View className="flex-row">
                <View className="items-center mr-4">
                  <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                    <Feather name="check-circle" size={20} color="#22C55E" />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    Quote Completed
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {formatDate(quote.updatedAt)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Support Section */}
        <View className="px-5 py-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Need Help?
          </Text>
          <TouchableOpacity
            onPress={handleContactSupport}
            className="bg-white border-2 border-[#FF8C42] py-4 rounded-xl flex-row items-center justify-center"
            activeOpacity={0.7}
          >
            <Feather name="mail" size={20} color="#FF8C42" />
            <Text className="text-[#FF8C42] font-semibold ml-2 text-base">
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
