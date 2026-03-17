import RazorpayCheckout from "@/components/RazorpayCheckout";
import { useMyAddresses } from "@/hooks/useAddresses";
import {
  useCartQuery,
  useCartTotalsByCurrency,
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/hooks/useCart";
import { useCreateOrder, useVerifyPayment } from "@/hooks/useOrders";
import { useAuthStore } from "@/store/auth-store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const totalsByCurrency = useCartTotalsByCurrency();
  const updateQuantity = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const { data: addresses, isLoading: isAddressesLoading } = useMyAddresses();
  const defaultAddress = addresses?.find((a) => a.isDefault) || addresses?.[0];

  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();
  const [razorpayProps, setRazorpayProps] = useState<{
    visible: boolean;
    razorpayKey: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    orderId: string;
  }>({
    visible: false,
    razorpayKey: "",
    razorpayOrderId: "",
    amount: 0,
    currency: "",
    orderId: "",
  });

  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      AED: "د.إ",
      CNY: "¥",
    };
    return symbols[code] || code;
  };

  const handleCheckout = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!defaultAddress) {
      router.push("/addresses");
      return;
    }

    createOrder.mutate(
      { addressId: defaultAddress.id },
      {
        onSuccess: (data) => {
          const { order, razorpayOrder, razorpayKey } = data;
          setRazorpayProps({
            visible: true,
            razorpayKey,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount, // already in paise
            currency: razorpayOrder.currency,
            orderId: order.id,
          });
        },
      }
    );
  };

  const handlePaymentSuccess = (paymentData: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) => {
    setRazorpayProps((prev) => ({ ...prev, visible: false }));
    verifyPayment.mutate(
      {
        orderId: razorpayProps.orderId,
        razorpayOrderId: paymentData.razorpayOrderId,
        razorpayPaymentId: paymentData.razorpayPaymentId,
        razorpaySignature: paymentData.razorpaySignature,
      },
      {
        onSuccess: () => {
          // Navigating implicitly handled by the hook toast?
          // Optionally route to success screen
          Toast.show({ type: "success", text1: "Order Placed Successfully!" });
        },
      }
    );
  };

  const handlePaymentFailure = (errorMsg: string) => {
    setRazorpayProps((prev) => ({ ...prev, visible: false }));
    Toast.show({
      type: "error",
      text1: "Payment Failed",
      text2: errorMsg,
    });
  };

  const handlePaymentClose = () => {
    setRazorpayProps((prev) => ({ ...prev, visible: false }));
    Toast.show({
      type: "info",
      text1: "Payment Cancelled",
    });
  };

  const confirmRemove = (productId: string, productTitle: string) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove "${productTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromCart.mutate(productId),
        },
      ]
    );
  };

  const openProductFromCart = (productId: string, productType?: string) => {
    if (productType === "MACHINERY") {
      router.push(`/marketplace/machinery/${productId}` as any);
      return;
    }
    if (productType === "SPARE_PARTS") {
      router.push(`/marketplace/spare-parts/${productId}` as any);
      return;
    }
    if (productType === "CONSUMABLES") {
      router.push(`/marketplace/consumables/${productId}` as any);
      return;
    }
    if (productType === "RAW_MATERIALS") {
      router.push(`/marketplace/raw-material/${productId}` as any);
      return;
    }

    router.push("/marketplace");
  };

  if (!user) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-8">
        <Feather name="shopping-cart" size={64} color="#E5E7EB" />
        <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">
          Please Sign In
        </Text>
        <Text className="text-gray-500 text-center mb-6">
          Sign in to view your cart items and checkout
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="bg-orange-500 px-8 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCartLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Cart</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isEmpty ? (
          <View className="flex-1 items-center justify-center py-32 px-8">
            <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-4">
              <Feather name="shopping-bag" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-bold text-gray-900 mb-2">
              Your cart is empty
            </Text>
            <Text className="text-gray-500 text-center">
              Looks like you haven't added anything yet.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/marketplace")}
              className="mt-8 bg-orange-500 px-8 py-3 rounded-full shadow-lg shadow-orange-500/30"
            >
              <Text className="text-white font-bold">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="p-4 space-y-6">
            {/* Address Selection */}
            <View className="bg-gray-50 p-5 rounded-2xl mb-2">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-bold text-gray-900">
                  Shipping Address
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/addresses")}
                  className="bg-black w-8 h-8 rounded-full items-center justify-center shadow-sm"
                >
                  <Feather name="edit-2" size={14} color="white" />
                </TouchableOpacity>
              </View>
              {isAddressesLoading ? (
                <ActivityIndicator size="small" color="#F97316" />
              ) : defaultAddress ? (
                <View>
                  <Text className="text-gray-900 font-medium mb-1">
                    {defaultAddress.fullName}
                  </Text>
                  <Text className="text-gray-600 text-sm leading-5">
                    {defaultAddress.addressLine1}
                    {defaultAddress.addressLine2
                      ? `, ${defaultAddress.addressLine2}`
                      : ""}
                    {`, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.postalCode}`}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {defaultAddress.phoneNumber}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => router.push("/addresses")}
                  className="py-2"
                >
                  <Text className="text-orange-500 font-semibold text-sm">
                    + Add a shipping address
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Cart Items */}
            <View className="space-y-4">
              {cart.items.map((item) => (
                <View
                  key={item.id}
                  className="bg-white px-4 py-4 rounded-2xl shadow-sm border border-gray-100 mb-2"
                >
                  {/* Top: Image & Info */}
                  <TouchableOpacity
                    className="flex-row mb-4"
                    activeOpacity={0.8}
                    onPress={() =>
                      openProductFromCart(
                        item.productId,
                        item.product.productType
                      )
                    }
                  >
                    <View className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden items-center justify-center mr-4">
                      {item.product.imagesThumbnail ? (
                        <Image
                          source={{ uri: item.product.imagesThumbnail }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Feather name="package" size={24} color="#9CA3AF" />
                      )}
                    </View>

                    <View className="flex-1 justify-center">
                      <View className="flex-row justify-between items-start pr-2">
                        <Text
                          className="font-bold text-gray-900 text-[15px] flex-1 pr-2 leading-5"
                          numberOfLines={2}
                        >
                          {item.product.title}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            confirmRemove(item.product.id, item.product.title)
                          }
                          className="p-1"
                        >
                          <Feather name="x" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                      </View>

                      {/* Fake Variations/Rating matching Figma (or real if available) */}
                      <View className="flex-row items-center mt-2">
                        <Text className="text-xs text-gray-800 font-medium mr-2">
                          Condition:
                        </Text>
                        <View className="border border-gray-300 rounded px-2 py-0.5 mr-1">
                          <Text className="text-[10px] text-gray-600">
                            {item.product.status}
                          </Text>
                        </View>
                      </View>

                      {/* Pricing block matching Figma */}
                      <View className="flex-row items-center mt-3">
                        <View className="border border-gray-200 rounded-lg px-3 py-1.5 flex-row items-center">
                          <Text className="font-bold text-lg text-gray-900">
                            {getCurrencySymbol(item.product.currency)}{" "}
                            {parseFloat(item.product.price).toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Bottom: Quantity & Total matching Figma style */}
                  <View className="border-t border-gray-100 pt-3 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Text className="text-sm font-medium text-gray-800 mr-3">
                        Total Order:
                      </Text>
                      {/* Embedded Quantity Controls */}
                      <View className="flex-row items-center border border-gray-200 rounded-lg h-8">
                        <TouchableOpacity
                          onPress={() =>
                            updateQuantity.mutate({
                              productId: item.productId,
                              quantity: item.quantity - 1,
                            })
                          }
                          disabled={
                            item.quantity <= 1 || updateQuantity.isPending
                          }
                          className={`w-8 h-full items-center justify-center ${item.quantity <= 1 ? "opacity-50" : ""}`}
                        >
                          <Feather name="minus" size={14} color="#374151" />
                        </TouchableOpacity>
                        <Text className="w-6 text-center font-semibold text-gray-900 text-sm">
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            updateQuantity.mutate({
                              productId: item.productId,
                              quantity: item.quantity + 1,
                            })
                          }
                          disabled={
                            item.quantity >= item.product.quantity ||
                            updateQuantity.isPending
                          }
                          className={`w-8 h-full items-center justify-center ${item.quantity >= item.product.quantity ? "opacity-30" : ""}`}
                        >
                          <Feather name="plus" size={14} color="#374151" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="items-end">
                      {item.product.quantity <= 0 ? (
                        <Text className="text-red-500 font-bold text-xs">
                          Out of Stock
                        </Text>
                      ) : (
                        <Text className="text-sm font-bold text-gray-900">
                          {getCurrencySymbol(item.product.currency)}{" "}
                          {(
                            parseFloat(item.product.price) * item.quantity
                          ).toLocaleString()}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View className="h-6" />
          </View>
        )}
      </ScrollView>

      {/* Cart Footer / Checkout */}
      {!isEmpty && (
        <View className="bg-gray-50 border-t border-gray-200 pt-4 pb-8 px-6 flex-row items-center justify-between shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
          <View className="flex-row items-center">
            <Text className="text-gray-900 text-xl font-bold mr-2">Total</Text>
            {Object.entries(totalsByCurrency).map(([cur, amount]) => (
              <Text key={cur} className="text-xl font-bold text-gray-900">
                {getCurrencySymbol(cur)}
                {amount.toLocaleString()}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleCheckout}
            disabled={createOrder.isPending || verifyPayment.isPending}
            className={`py-4 px-10 rounded-2xl items-center justify-center flex-row shadow-sm ${
              createOrder.isPending || verifyPayment.isPending
                ? "bg-gray-400"
                : "bg-black"
            }`}
          >
            {createOrder.isPending || verifyPayment.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Checkout</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <RazorpayCheckout
        {...razorpayProps}
        userName={user?.name || ""}
        userEmail={user?.email || ""}
        userPhone={defaultAddress?.phoneNumber || ""}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        onClose={handlePaymentClose}
      />
    </View>
  );
}
