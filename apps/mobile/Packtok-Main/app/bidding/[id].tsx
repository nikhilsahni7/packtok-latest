import { useAuctionRealtime } from "@/hooks/useAuctionRealtime";
import {
  useAuction,
  useEnrollInAuction,
  usePlaceBid,
} from "@/hooks/useAuctions";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuctionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const auctionId = Array.isArray(id) ? id[0] : id;

  const { data: auction, isLoading, isError, refetch } = useAuction(auctionId);
  const { mutate: enrollInAuction, isPending: isEnrolling } =
    useEnrollInAuction();
  const { mutate: placeBid, isPending: isPlacingBid } = usePlaceBid();

  const [bidAmount, setBidAmount] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Connect to real-time updates
  useAuctionRealtime(auctionId);

  // Calculate time remaining
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>({ hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    if (!auction) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endAt).getTime();
      const diff = Math.max(endTime - now, 0);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining({
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  const handleEnroll = () => {
    if (!auctionId) return;

    setShowDepositModal(true);
  };

  const confirmDeposit = () => {
    if (!auctionId) return;

    enrollInAuction(
      { auctionId },
      {
        onSuccess: (data) => {
          setShowDepositModal(false);
          Alert.alert(
            "Enrollment Initiated",
            "Please complete the payment to participate in this auction.",
            [{ text: "OK" }]
          );
          // In a real app, you would integrate Razorpay payment here
          // using data.razorpayOrder and data.razorpayKey
        },
        onError: (error: any) => {
          setShowDepositModal(false);
          Alert.alert(
            "Enrollment Failed",
            error?.response?.data?.message || "Failed to enroll in auction",
            [{ text: "OK" }]
          );
        },
      }
    );
  };

  const handlePlaceBid = () => {
    if (!auctionId || !bidAmount) {
      Alert.alert("Invalid Bid", "Please enter a valid bid amount", [
        { text: "OK" },
      ]);
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid bid amount", [
        { text: "OK" },
      ]);
      return;
    }

    placeBid(
      { auctionId, amount: bidAmount },
      {
        onSuccess: () => {
          setBidAmount("");
          Alert.alert("Bid Placed", "Your bid has been placed successfully!", [
            { text: "OK" },
          ]);
        },
        onError: (error: any) => {
          Alert.alert(
            "Bid Failed",
            error?.response?.data?.message || "Failed to place bid",
            [{ text: "OK" }]
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (isError || !auction) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-4">
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <Text className="text-xl font-bold text-gray-900 mt-4">
          Failed to Load Auction
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          Unable to fetch auction details. Please try again.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-6 bg-black px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentBid =
    auction.leaderboard?.snapshot?.currentAmount || auction.startingAmount;
  const leadingBidder = auction.leaderboard?.snapshot?.bidders?.[0];
  const isLive = auction.status === "LIVE";
  const isClosed =
    auction.status === "CLOSED" || auction.status === "CANCELLED";

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between">
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
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Machine Image Gallery */}
        <View className="w-full h-80 bg-gray-100">
          {auction.product?.images?.[0] || auction.product?.imagesThumbnail ? (
            <Image
              source={{
                uri:
                  auction.product.images?.[0] ||
                  auction.product.imagesThumbnail ||
                  "",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
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

          {/* Image Thumbnails */}
          {auction.product?.images && auction.product.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 px-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row space-x-2"
              >
                {auction.product.images.slice(0, 4).map((img, idx) => (
                  <View
                    key={idx}
                    className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white"
                  >
                    <Image
                      source={{ uri: img }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Product Title */}
        <View className="px-4 py-6 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            {auction.product?.title || "Corrugated Machinery"}
          </Text>
        </View>

        {/* Timer Section */}
        {isLive && (
          <View className="px-4 py-6 bg-gray-50 border-b border-gray-200">
            <Text className="text-center text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Auction Ends In
            </Text>
            <View className="flex-row justify-center items-center space-x-3">
              {/* Hours */}
              <View className="items-center">
                <View className="bg-black rounded-xl px-4 py-3 min-w-[70px]">
                  <Text className="text-white text-3xl font-bold text-center">
                    {timeRemaining.hours}
                  </Text>
                </View>
                <Text className="text-gray-600 text-xs mt-2 uppercase">
                  Hours
                </Text>
              </View>

              <Text className="text-2xl font-bold text-gray-400">:</Text>

              {/* Minutes */}
              <View className="items-center">
                <View className="bg-black rounded-xl px-4 py-3 min-w-[70px]">
                  <Text className="text-white text-3xl font-bold text-center">
                    {timeRemaining.minutes}
                  </Text>
                </View>
                <Text className="text-gray-600 text-xs mt-2 uppercase">
                  Minutes
                </Text>
              </View>

              <Text className="text-2xl font-bold text-gray-400">:</Text>

              {/* Seconds */}
              <View className="items-center">
                <View className="bg-black rounded-xl px-4 py-3 min-w-[70px]">
                  <Text className="text-white text-3xl font-bold text-center">
                    {timeRemaining.seconds}
                  </Text>
                </View>
                <Text className="text-gray-600 text-xs mt-2 uppercase">
                  Seconds
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Current Bid Section */}
        <View className="px-4 py-6 border-b border-gray-200">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
                Current Bid
              </Text>
              <Text className="text-4xl font-black text-gray-900">
                ₹{parseFloat(currentBid).toLocaleString("en-IN")}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
                Total Bids
              </Text>
              <Text className="text-2xl font-bold text-gray-900">
                {auction.leaderboard?.snapshot?.bidders?.length || 0}
              </Text>
            </View>
          </View>

          {leadingBidder && (
            <View className="flex-row items-center bg-gray-50 rounded-lg p-3">
              <View className="w-10 h-10 rounded-full bg-black items-center justify-center">
                <Text className="text-white font-bold">
                  {leadingBidder.name?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-gray-900">
                  Leading Bidder
                </Text>
                <Text className="text-xs text-gray-600">
                  {leadingBidder.name || leadingBidder.email}
                </Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-bold text-green-800">
                  Leading
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Bid Input Section */}
        {isLive && !isClosed && (
          <View className="px-4 py-6 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Place Your Bid
            </Text>
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <TextInput
                  className="h-14 border-2 border-gray-300 rounded-lg px-4 text-lg font-semibold"
                  placeholder="Enter amount"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={bidAmount}
                  onChangeText={setBidAmount}
                  editable={!isPlacingBid}
                />
                <Text className="text-xs text-gray-500 mt-1">
                  Min increment: ₹
                  {parseFloat(auction.bidIncrement).toLocaleString("en-IN")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handlePlaceBid}
                disabled={isPlacingBid || !bidAmount}
                className={`h-14 px-6 rounded-lg items-center justify-center ${
                  isPlacingBid || !bidAmount ? "bg-gray-400" : "bg-black"
                }`}
              >
                {isPlacingBid ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold">Bid</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Deposit Information */}
        <View className="px-4 py-6 bg-blue-50 border-b border-gray-200">
          <View className="flex-row items-start">
            <Feather name="info" size={20} color="#3B82F6" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold text-gray-900 mb-1">
                Earnest Money Deposit
              </Text>
              <Text className="text-sm text-gray-600">
                A refundable deposit of{" "}
                <Text className="font-bold">
                  ₹{parseFloat(auction.depositAmount).toLocaleString("en-IN")}
                </Text>{" "}
                is required to participate in this auction.
              </Text>
            </View>
          </View>
        </View>

        {/* Leaderboard */}
        {auction.leaderboard?.snapshot?.bidders &&
          auction.leaderboard.snapshot.bidders.length > 0 && (
            <View className="px-4 py-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Leaderboard
              </Text>
              {auction.leaderboard.snapshot.bidders.map((bidder, index) => (
                <View
                  key={bidder.bidId}
                  className="flex-row items-center justify-between py-3 border-b border-gray-100"
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        index === 0
                          ? "bg-yellow-400"
                          : index === 1
                            ? "bg-gray-300"
                            : index === 2
                              ? "bg-orange-400"
                              : "bg-gray-200"
                      }`}
                    >
                      <Text className="text-xs font-bold text-gray-900">
                        {index + 1}
                      </Text>
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-semibold text-gray-900">
                        {bidder.name || "Anonymous"}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {new Date(bidder.createdAt).toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm font-bold text-gray-900">
                    ₹{parseFloat(bidder.amount).toLocaleString("en-IN")}
                  </Text>
                </View>
              ))}
            </View>
          )}

        <View className="h-32" />
      </ScrollView>

      {/* Bottom Action Button */}
      {!isClosed && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 pb-8">
          <TouchableOpacity
            onPress={handleEnroll}
            disabled={isEnrolling}
            className={`h-14 rounded-lg items-center justify-center shadow-lg ${
              isEnrolling ? "bg-gray-400" : "bg-black"
            }`}
          >
            {isEnrolling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Deposit ₹
                {parseFloat(auction.depositAmount).toLocaleString("en-IN")} to
                Participate
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Deposit Confirmation Modal */}
      <Modal
        visible={showDepositModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDepositModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-2xl w-full max-w-sm p-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Confirm Deposit
            </Text>
            <Text className="text-gray-600 mb-6">
              You are about to pay an earnest money deposit of{" "}
              <Text className="font-bold">
                ₹{parseFloat(auction.depositAmount).toLocaleString("en-IN")}
              </Text>{" "}
              to participate in this auction. This amount is refundable.
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowDepositModal(false)}
                disabled={isEnrolling}
                className="flex-1 h-12 rounded-lg border-2 border-gray-300 items-center justify-center"
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeposit}
                disabled={isEnrolling}
                className={`flex-1 h-12 rounded-lg items-center justify-center ${
                  isEnrolling ? "bg-gray-400" : "bg-black"
                }`}
              >
                {isEnrolling ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-white font-semibold">Proceed</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
