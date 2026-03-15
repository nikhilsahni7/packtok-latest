import RazorpayCheckout from "@/components/RazorpayCheckout";
import ReviewsSection from "@/components/ReviewsSection";
import { useAuctionRealtime } from "@/hooks/useAuctionRealtime";
import {
  useAuction,
  useConfirmEnrollmentPayment,
  useEnrollInAuction,
  useMyAuctionEnrollments,
  usePlaceBid,
} from "@/hooks/useAuctions";
import { useAuthStore } from "@/store/auth-store";
import { Auction, AuctionLeaderboardSnapshot } from "@/types/auction";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// ── Currency Formatting ──────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const formatCurrency = (
  amount: string | number | null | undefined,
  currency: string
) => {
  if (!amount) return `${CURRENCY_SYMBOLS[currency] || currency} 0`;
  const numeric = typeof amount === "number" ? amount : parseFloat(amount);
  if (isNaN(numeric)) return `${currency} ${amount}`;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return `${CURRENCY_SYMBOLS[currency] || currency}${numeric.toLocaleString("en-IN")}`;
  }
};

const formatCompact = (
  amount: number,
  currency: string
) => {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  if (amount >= 100000) return `${sym}${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  if (amount >= 1000) return `${sym}${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  return `${sym}${amount.toLocaleString("en-IN")}`;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const getCurrentAmount = (
  auction: Auction | undefined | null,
  snapshot: AuctionLeaderboardSnapshot | null
): string => {
  if (snapshot?.currentAmount) return snapshot.currentAmount;
  return (
    auction?.leaderboard?.snapshot?.currentAmount ??
    auction?.startingAmount ??
    "0"
  );
};

// ── Component ────────────────────────────────────────────────────────────────

export default function AuctionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const auctionId = Array.isArray(id) ? id[0] : id;
  const user = useAuthStore((s) => s.user);

  // ── Queries & mutations ──
  const {
    data: auction,
    isLoading,
    isError,
    refetch,
  } = useAuction(auctionId);
  const { data: enrollments = [] } = useMyAuctionEnrollments();
  const { mutate: enrollInAuction, isPending: isEnrolling } =
    useEnrollInAuction();
  const { mutate: confirmPayment, isPending: isConfirming } =
    useConfirmEnrollmentPayment();
  const { mutate: placeBid, isPending: isPlacingBid } = usePlaceBid();

  // ── Local state ──
  const [snapshot, setSnapshot] = useState<AuctionLeaderboardSnapshot | null>(
    null
  );
  const [bidAmount, setBidAmount] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmBidModal, setShowConfirmBidModal] = useState(false);
  const [pendingBidAmount, setPendingBidAmount] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Razorpay checkout state
  const [razorpayProps, setRazorpayProps] = useState<{
    visible: boolean;
    razorpayKey: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    orderId: string;
    paymentIntentId: string;
  }>({
    visible: false,
    razorpayKey: "",
    razorpayOrderId: "",
    amount: 0,
    currency: "INR",
    orderId: "",
    paymentIntentId: "",
  });

  // ── Countdown ──
  const [timeRemaining, setTimeRemaining] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!auction || auction.status !== "LIVE") return;

    const tick = () => {
      const diff = Math.max(
        new Date(auction.endAt).getTime() - Date.now(),
        0
      );
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeRemaining({
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [auction?.endAt, auction?.status]);

  // ── Snapshot from initial data ──
  useEffect(() => {
    if (auction?.leaderboard?.snapshot) {
      setSnapshot(auction.leaderboard.snapshot);
    }
  }, [auction?.leaderboard?.snapshot]);

  // ── Real-time updates ──
  useAuctionRealtime(auctionId, {
    onLeaderboard: (event) => setSnapshot(event.leaderboard ?? null),
    onFinalized: () => refetch(),
    onBidPlaced: () => refetch(),
  });

  // ── Derived data ──
  const myEnrollment = useMemo(
    () => enrollments.find((e) => e.auctionId === auctionId) ?? null,
    [enrollments, auctionId]
  );
  const hasActiveEnrollment = myEnrollment?.status === "ACTIVE";
  const isLive = auction?.status === "LIVE";
  const isClosed =
    auction?.status === "CLOSED" || auction?.status === "CANCELLED";
  const isReverse = auction?.mode === "REVERSE";
  const currentAmount = getCurrentAmount(auction, snapshot);
  const bidders =
    snapshot?.bidders ?? auction?.leaderboard?.snapshot?.bidders ?? [];

  // ── Min/Max bid amount ──
  const minBidAmount = useMemo(() => {
    if (!auction) return null;
    const current = parseFloat(currentAmount);
    if (auction.mode === "FORWARD") {
      const inc = parseFloat(auction.minBidIncrement ?? "100");
      return current + inc;
    } else {
      const dec = parseFloat(auction.minBidDecrement ?? "100");
      return current - dec;
    }
  }, [auction, currentAmount]);

  // ── Bid suggestions (4 pills) ──
  const bidSuggestions = useMemo(() => {
    if (!auction || !minBidAmount) return [];
    if (auction.mode === "FORWARD") {
      const inc = parseFloat(auction.minBidIncrement ?? "100");
      return [
        minBidAmount,
        minBidAmount + inc,
        minBidAmount + inc * 2,
        minBidAmount + inc * 5,
      ].filter((v) => v > 0);
    } else {
      const dec = parseFloat(auction.minBidDecrement ?? "100");
      return [
        minBidAmount,
        minBidAmount - dec,
        minBidAmount - dec * 2,
        minBidAmount - dec * 5,
      ].filter((v) => v > 0);
    }
  }, [auction, minBidAmount]);

  // ── Handlers ──

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEnroll = () => {
    if (!auctionId) return;
    enrollInAuction(
      { auctionId },
      {
        onSuccess: (data) => {
          const { paymentIntent, razorpayOrder, razorpayKey } = data;
          setRazorpayProps({
            visible: true,
            razorpayKey,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderId: razorpayOrder.id,
            paymentIntentId: paymentIntent.id,
          });
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Enrollment Failed",
            text2:
              error?.response?.data?.message || "Failed to enroll in auction",
          });
        },
      }
    );
  };

  const handleRazorpaySuccess = (data: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) => {
    setRazorpayProps((prev) => ({ ...prev, visible: false }));
    confirmPayment(
      {
        auctionId: auctionId!,
        paymentIntentId: razorpayProps.paymentIntentId,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
      },
      {
        onSuccess: () => {
          setShowSuccessModal(true);
          refetch();
        },
        onError: () => {
          Toast.show({
            type: "error",
            text1: "Payment Error",
            text2: "Failed to confirm earnest money payment",
          });
        },
      }
    );
  };

  const handleRazorpayFailure = (error: string) => {
    setRazorpayProps((prev) => ({ ...prev, visible: false }));
    Toast.show({
      type: "error",
      text1: "Payment Failed",
      text2: error || "Payment could not be processed",
    });
  };

  const handleRazorpayClose = () => {
    setRazorpayProps((prev) => ({ ...prev, visible: false }));
  };

  const handleSelectSuggestion = (amount: number) => {
    setBidAmount(amount.toString());
  };

  const handlePlaceBid = () => {
    if (!bidAmount || !auctionId || !auction) return;
    const numericAmount = parseFloat(bidAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Bid",
        text2: "Please enter a valid amount",
      });
      return;
    }

    // Validate bid amount
    if (minBidAmount !== null) {
      if (auction.mode === "FORWARD" && numericAmount < minBidAmount) {
        Toast.show({
          type: "error",
          text1: "Bid Too Low",
          text2: `Minimum bid is ${formatCurrency(minBidAmount, auction.currency)}`,
        });
        return;
      }
      if (auction.mode === "REVERSE") {
        if (minBidAmount <= 0) {
          if (numericAmount >= parseFloat(currentAmount)) {
            Toast.show({
              type: "error",
              text1: "Bid Too High",
              text2: "Bid must be lower than the current amount",
            });
            return;
          }
        } else if (numericAmount > minBidAmount) {
          Toast.show({
            type: "error",
            text1: "Bid Too High",
            text2: `Maximum bid is ${formatCurrency(minBidAmount, auction.currency)}`,
          });
          return;
        }
      }
    }

    // Show confirmation modal
    setPendingBidAmount(bidAmount);
    setShowConfirmBidModal(true);
  };

  const confirmBidPlacement = () => {
    if (!auctionId || !pendingBidAmount) return;
    placeBid(
      { auctionId, amount: pendingBidAmount },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Bid Placed!",
            text2: "Your bid was submitted successfully",
          });
          setBidAmount("");
          setPendingBidAmount("");
          setShowConfirmBidModal(false);
          refetch();
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Bid Failed",
            text2: error?.response?.data?.message || "Failed to place bid",
          });
          setShowConfirmBidModal(false);
        },
      }
    );
  };

  // ── Loading / Error ──

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !auction) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 mt-4">
            Failed to Load Auction
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Unable to fetch auction details. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-6 bg-black px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const product = auction.product;
  const images = product?.images ?? [];
  const mainImage =
    images[selectedImageIndex] || product?.imagesThumbnail || "";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          Auction Details
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ── Image Gallery ── */}
        <View className="bg-gray-100">
          {mainImage ? (
            <Image
              source={{ uri: mainImage }}
              className="w-full h-72"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-72 items-center justify-center">
              <Feather name="image" size={64} color="#9CA3AF" />
            </View>
          )}

          {/* Status Badge */}
          <View className="absolute top-4 left-4">
            <View
              className={`px-3 py-1.5 rounded-full ${
                isLive
                  ? "bg-red-500"
                  : auction.status === "SCHEDULED"
                    ? "bg-blue-500"
                    : "bg-gray-500"
              }`}
            >
              <Text className="text-white text-xs font-bold uppercase">
                {auction.status}
              </Text>
            </View>
          </View>

          {/* Reverse Badge */}
          {isReverse && (
            <View className="absolute top-4 right-4">
              <View className="bg-red-500 px-3 py-1.5 rounded-full">
                <Text className="text-white text-[10px] font-bold">
                  REVERSE BID
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Image Thumbnails ── */}
        {images.length > 1 && (
          <View className="px-4 py-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {images.slice(0, 5).map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 mr-2 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === idx
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    source={{ uri: img }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Product Title + Rating ── */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-xl font-bold text-gray-900">
            {product?.title || "Auction Product"}
          </Text>
          {product?.manufacturer && (
            <Text className="text-sm text-gray-500 mt-1">
              {product.manufacturer}
              {product.model ? ` • ${product.model}` : ""}
              {product.year ? ` • ${product.year}` : ""}
            </Text>
          )}
        </View>

        {/* ── Dark Info Card (Figma SS 1 header) ── */}
        <View className="mx-4 bg-[#1A1A2E] rounded-2xl p-5 mt-2">
          {/* User row */}
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
              <Text className="text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
            <Text className="text-white font-semibold ml-2 flex-1">
              {product?.title || "Auction"}
            </Text>
            {isReverse && (
              <View className="bg-red-500 px-2 py-0.5 rounded">
                <Text className="text-white text-[9px] font-bold">
                  REVERSE
                </Text>
              </View>
            )}
          </View>

          {/* Prices row */}
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-gray-400 text-xs font-semibold uppercase">
                Starting price
              </Text>
              <Text className="text-white text-lg font-bold">
                {formatCurrency(auction.startingAmount, auction.currency)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs font-semibold uppercase">
                Current Bid Price
              </Text>
              <Text className="text-white text-lg font-bold">
                {formatCurrency(currentAmount, auction.currency)}
              </Text>
            </View>
          </View>

          {/* Live info row */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {/* Stacked avatars */}
              <View className="flex-row -space-x-2">
                {bidders.slice(0, 3).map((b, i) => (
                  <View
                    key={i}
                    className="w-6 h-6 rounded-full bg-gradient-to-br items-center justify-center border-2 border-[#1A1A2E]"
                    style={{
                      backgroundColor: ["#3B82F6", "#8B5CF6", "#EC4899"][i],
                      marginLeft: i > 0 ? -8 : 0,
                    }}
                  >
                    <Text className="text-white text-[8px] font-bold">
                      {b.name?.charAt(0)?.toUpperCase() || "?"}
                    </Text>
                  </View>
                ))}
              </View>
              <Text className="text-gray-300 text-xs ml-2">are Live</Text>
            </View>

            {isLive && (
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-yellow-400 rounded-full mr-1" />
                <Text className="text-gray-300 text-xs">
                  {timeRemaining.hours}:{timeRemaining.minutes}:
                  {timeRemaining.seconds} remaining
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Earnest Money Section (Not Enrolled) ── */}
        {!hasActiveEnrollment && !isClosed && (
          <View className="mx-4 mt-4">
            {/* Disclaimer */}
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
              <Text className="text-sm text-gray-800 mb-2 leading-5">
                To ensure serious participation, users must pay an initial,
                non-refundable deposit to join a bid.
              </Text>
              <Text className="text-sm text-gray-700 mb-3">
                <Text className="font-bold">Examples:</Text> ₹10,000 for a bid
                on boxes or ₹1 lakh for a bid on machinery.{" "}
              </Text>

              <View className="space-y-2">
                <Text className="text-xs text-gray-600 leading-4">
                  Only users who have paid the earnest money can actively
                  participate in the online bidding room. Their usernames will be
                  highlighted (e.g., green) to signify their active status.
                </Text>
                <Text className="text-xs text-gray-600 leading-4">
                  Users who have not paid can view the bidding room and the
                  ongoing bids but cannot place bids themselves.
                </Text>
                <Text className="text-xs text-gray-600 leading-4">
                  All bids will be initiated and configured by the Admin.
                </Text>
                <Text className="text-xs text-gray-600 leading-4">
                  Bids will have a defined time limit (e.g., 30 days), after
                  which they will automatically close.
                </Text>
                <Text className="text-xs text-gray-600 leading-4">
                  The winning bidder will be notified automatically via email
                  upon the bid's conclusion.
                </Text>
              </View>
            </View>



            {/* Earnest Money Total + CTA */}
            <View className="bg-white border border-gray-200 rounded-2xl p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-gray-500">Total</Text>
                  <Text className="text-2xl font-black text-gray-900">
                    {formatCurrency(auction.earnestAmount, auction.currency)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleEnroll}
                  disabled={isEnrolling}
                  className={`px-6 py-3 rounded-xl ${
                    isEnrolling ? "bg-gray-400" : "bg-black"
                  }`}
                >
                  {isEnrolling ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      Deposit
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── Live Auction Section (Enrolled) ── */}
        {isLive && (
          <View className="mx-4 mt-4">
            <View className="bg-white border border-gray-200 rounded-2xl p-4">
              {/* Section Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                  <Text className="font-bold text-gray-900 text-base">
                    Live Auction
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">
                  {bidders.length} Bids made
                </Text>
              </View>

              {/* Leaderboard */}
              {bidders.length > 0 && (
                <View className="mb-4">
                  {bidders.slice(0, 5).map((bid, index) => (
                    <View
                      key={bid.bidId}
                      className="flex-row items-center justify-between py-3 border-b border-gray-100"
                    >
                      <View className="flex-row items-center flex-1">
                        {bid.profile_image ? (
                          <Image
                            source={{ uri: bid.profile_image }}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <View
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{
                              backgroundColor:
                                index === 0
                                  ? "#3B82F6"
                                  : index === 1
                                    ? "#8B5CF6"
                                    : index === 2
                                      ? "#EC4899"
                                      : "#9CA3AF",
                            }}
                          >
                            <Text className="text-white text-sm font-bold">
                              {bid.name?.charAt(0)?.toUpperCase() || "?"}
                            </Text>
                          </View>
                        )}
                        <View className="ml-3 flex-1">
                          <Text className="text-sm font-semibold text-gray-900">
                            {bid.name || "Anonymous"}
                          </Text>
                          <Text className="text-xs text-gray-500 mb-0.5" numberOfLines={1}>
                            {bid.email}
                          </Text>
                          <Text className="text-[10px] text-gray-400">
                            {new Date(bid.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-sm font-bold text-gray-900">
                        {formatCurrency(bid.amount, auction.currency)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* ── Bid Input (Enrolled Only) ── */}
              {hasActiveEnrollment && (
                <View>
                  {/* Quick Bid Suggestions */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-3"
                  >
                    {bidSuggestions.map((amount, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleSelectSuggestion(amount)}
                        className={`mr-2 px-4 py-2 rounded-lg border ${
                          bidAmount === amount.toString()
                            ? "bg-gray-900 border-gray-900"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <Text
                          className={`text-sm font-bold ${
                            bidAmount === amount.toString()
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {formatCompact(amount, auction.currency)}
                        </Text>
                        {idx === 0 && (
                          <Text
                            className={`text-[9px] ${
                              bidAmount === amount.toString()
                                ? "text-gray-300"
                                : "text-gray-500"
                            }`}
                          >
                            {isReverse ? "Max Bid" : "Min Bid"}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Custom Bid Input */}
                  <View className="flex-row items-center mb-3">
                    <TextInput
                      value={bidAmount}
                      onChangeText={setBidAmount}
                      placeholder="use custom bid"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      className="flex-1 h-12 border border-gray-300 rounded-lg px-4 text-base font-semibold text-gray-900 mr-2"
                      editable={!isPlacingBid}
                    />
                    <TouchableOpacity
                      onPress={handlePlaceBid}
                      disabled={!bidAmount}
                      className={`w-10 h-10 rounded-full items-center justify-center ${
                        bidAmount ? "bg-orange-500" : "bg-gray-300"
                      }`}
                    >
                      <Feather name="check" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setBidAmount("")}
                      className="w-10 h-10 rounded-full items-center justify-center bg-gray-200 ml-2"
                    >
                      <Feather name="x" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {!hasActiveEnrollment && (
                <Text className="text-sm text-center text-gray-500 py-4">
                  Pay earnest money to start bidding
                </Text>
              )}
            </View>
          </View>
        )}

        {/* ── Product Description ── */}
        {product?.description && (
          <View className="mx-4 mt-4 bg-white border border-gray-200 rounded-2xl p-4">
            <Text className="text-base font-bold text-gray-900 mb-2">
              Description
            </Text>
            <Text className="text-sm text-gray-600 leading-5">
              {product.description}
            </Text>
          </View>
        )}

        {/* ── Specifications ── */}
        {product?.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <View className="mx-4 mt-4 bg-white border border-gray-200 rounded-2xl p-4">
              <Text className="text-base font-bold text-gray-900 mb-3">
                Technical Specs
              </Text>
              {Object.entries(product.specifications).map(([key, value]) => (
                <View
                  key={key}
                  className="flex-row justify-between py-2 border-b border-gray-100"
                >
                  <Text className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    {String(value)}
                  </Text>
                </View>
              ))}
            </View>
          )}

        {/* ── Equipment Details ── */}
        {(product?.manufacturer || product?.model || product?.condition) && (
          <View className="mx-4 mt-4 bg-white border border-gray-200 rounded-2xl p-4">
            <Text className="text-base font-bold text-gray-900 mb-3">
              Equipment Details
            </Text>
            {[
              { label: "Manufacturer", value: product.manufacturer },
              { label: "Model", value: product.model },
              { label: "Year", value: product.year?.toString() },
              { label: "Condition", value: product.condition },
            ]
              .filter((item) => item.value)
              .map((item) => (
                <View
                  key={item.label}
                  className="flex-row justify-between py-2 border-b border-gray-100"
                >
                  <Text className="text-sm text-gray-500">{item.label}</Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {/* ── FAQs ── */}
        {product?.faqs && product.faqs.length > 0 && (
          <View className="mx-4 mt-4 bg-white border border-gray-200 rounded-2xl p-4">
            <Text className="text-base font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </Text>
            {product.faqs.map((faq, idx) => (
              <View
                key={idx}
                className="py-3 border-b border-gray-100 last:border-0"
              >
                <Text className="text-sm font-semibold text-gray-900 mb-1">
                  {faq.question}
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  {faq.answer}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Documents & Media ── */}
        {(product?.pdfUrl || product?.videoUrl) && (
          <View className="mx-4 mt-4 bg-white border border-gray-200 rounded-2xl p-4">
            <Text className="text-base font-bold text-gray-900 mb-3">
              Media & Documents
            </Text>

            {product.pdfUrl && (
              <TouchableOpacity
                onPress={() => Linking.openURL(product.pdfUrl!)}
                className="flex-row items-center bg-gray-50 p-3 rounded-xl border border-gray-200 mb-2 last:mb-0"
              >
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                  <Feather name="file-text" size={20} color="#DC2626" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">
                    Product Brochure & Specs
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Tap to view PDF
                  </Text>
                </View>
                <Feather name="external-link" size={16} color="#6B7280" />
              </TouchableOpacity>
            )}

            {product.videoUrl && (
              <TouchableOpacity
                onPress={() => Linking.openURL(product.videoUrl!)}
                className="flex-row items-center bg-gray-50 p-3 rounded-xl border border-gray-200 mb-2 last:mb-0"
              >
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Feather name="youtube" size={20} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">
                    Product Video
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Watch on YouTube
                  </Text>
                </View>
                <Feather name="external-link" size={16} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── Reviews Section ── */}
        {product?.id && (
          <View className="mx-4 mt-4 mb-4 bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <ReviewsSection productId={product.id} />
          </View>
        )}

        <View className="h-32" />
      </ScrollView>

      {/* ── Bottom Action Bar ── */}
      {isLive && hasActiveEnrollment && bidAmount && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 pb-8">
          <TouchableOpacity
            onPress={handlePlaceBid}
            disabled={isPlacingBid}
            className={`h-14 rounded-xl items-center justify-center ${
              isPlacingBid ? "bg-gray-400" : "bg-orange-500"
            }`}
          >
            {isPlacingBid ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Place Bid for{" "}
                {formatCurrency(bidAmount, auction.currency)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Bottom Earnest Money Bar (Not Enrolled) ── */}
      {!hasActiveEnrollment && !isClosed && !isLive && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 pb-8">
          <TouchableOpacity
            onPress={handleEnroll}
            disabled={isEnrolling}
            className={`h-14 rounded-xl items-center justify-center ${
              isEnrolling ? "bg-gray-400" : "bg-black"
            }`}
          >
            {isEnrolling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Earnest Money
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Confirm Bid Modal (Figma SS 4) ── */}
      <Modal
        visible={showConfirmBidModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmBidModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl w-full max-w-sm p-6 items-center">
            {/* Check icon */}
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <Feather name="check-circle" size={32} color="#16A34A" />
            </View>

            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Confirm Bid
            </Text>
            <Text className="text-gray-600 text-center mb-6 leading-5">
              You have placed a bid for{" "}
              {formatCurrency(pendingBidAmount, auction.currency)}. Should we
              place this as your Bid?
            </Text>

            <TouchableOpacity
              onPress={confirmBidPlacement}
              disabled={isPlacingBid}
              className={`w-full h-12 rounded-xl items-center justify-center mb-2 ${
                isPlacingBid ? "bg-gray-400" : "bg-orange-500"
              }`}
            >
              {isPlacingBid ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Yes, Place My Bid
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowConfirmBidModal(false);
                setPendingBidAmount("");
              }}
              className="w-full h-12 rounded-xl items-center justify-center border border-gray-300"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Success Modal (Earnest Paid) ── */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl w-full max-w-sm p-6 items-center">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Feather name="check" size={32} color="#2563EB" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Done!
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Your deposit has been successfully paid. You can now place bids!
            </Text>
            <TouchableOpacity
              onPress={() => setShowSuccessModal(false)}
              className="w-full h-12 bg-blue-600 rounded-xl items-center justify-center"
            >
              <Text className="text-white font-bold text-base">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Razorpay Checkout ── */}
      <RazorpayCheckout
        visible={razorpayProps.visible}
        razorpayKey={razorpayProps.razorpayKey}
        razorpayOrderId={razorpayProps.razorpayOrderId}
        amount={razorpayProps.amount}
        currency={razorpayProps.currency}
        orderId={razorpayProps.orderId}
        userName={user?.name || ""}
        userEmail={user?.email || ""}
        onSuccess={handleRazorpaySuccess}
        onFailure={handleRazorpayFailure}
        onClose={handleRazorpayClose}
      />
    </SafeAreaView>
  );
}
