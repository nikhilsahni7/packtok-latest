import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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
import { useMyOrders, useCancelOrder, Order } from "../hooks/useOrders";

const STATUS_ICONS: Record<string, any> = {
  PENDING_PAYMENT: "clock",
  PAYMENT_FAILED: "x-circle",
  PAID: "check-circle",
  PROCESSING: "package",
  SHIPPED: "truck",
  DELIVERED: "check-circle",
  CANCELLED: "x-circle",
  REFUND_PENDING: "clock",
  REFUNDED: "check-circle",
};

const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; bgClass: string; textClass: string }
> = {
  PENDING_PAYMENT: { label: "Pending Payment", bgClass: "bg-orange-100", textClass: "text-orange-700" },
  PAID: { label: "Paid", bgClass: "bg-emerald-100", textClass: "text-emerald-700" },
  PROCESSING: { label: "Processing", bgClass: "bg-blue-100", textClass: "text-blue-700" },
  SHIPPED: { label: "Shipped", bgClass: "bg-indigo-100", textClass: "text-indigo-700" },
  DELIVERED: { label: "Delivered", bgClass: "bg-green-100", textClass: "text-green-700" },
  CANCELLED: { label: "Cancelled", bgClass: "bg-red-100", textClass: "text-red-700" },
  PAYMENT_FAILED: { label: "Payment Failed", bgClass: "bg-red-100", textClass: "text-red-700" },
  REFUND_PENDING: { label: "Refund Pending", bgClass: "bg-yellow-100", textClass: "text-yellow-700" },
  REFUNDED: { label: "Refunded", bgClass: "bg-gray-100", textClass: "text-gray-700" },
};

export default function OrdersScreen() {
  const router = useRouter();
  const { data, isLoading, refetch } = useMyOrders();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const orders = data?.orders || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCancelSubmit = (orderId: string) => {
    if (!cancelReason.trim()) return;
    cancelOrder(
      { orderId, reason: cancelReason.trim() },
      {
        onSuccess: () => {
          setCancellingId(null);
          setCancelReason("");
        },
      }
    );
  };

  const isCancellable = (status: string) => {
    return ["PENDING_PAYMENT", "PAID", "PROCESSING"].includes(status);
  };

  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = { INR: "₹", USD: "$", EUR: "€", AED: "د.إ", CNY: "¥" };
    return symbols[code] || code;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3" activeOpacity={0.7}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">My Orders</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/marketplace")}>
          <Text className="text-orange-600 font-semibold">Shop More</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#F97316" />
          </View>
        ) : orders.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Feather name="package" size={48} color="#D1D5DB" className="mb-4" />
            <Text className="text-xl font-bold text-gray-900 mb-2 mt-4">No orders yet</Text>
            <Text className="text-gray-500 text-center mb-6">Start shopping to see your orders here.</Text>
            <TouchableOpacity onPress={() => router.push("/marketplace")} className="bg-gray-900 px-8 py-3 rounded-xl shadow-sm">
              <Text className="text-white font-bold">Browse Marketplace</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            {orders.map((order) => {
              const config = ORDER_STATUS_CONFIG[order.status] || { label: order.status, bgClass: "bg-gray-100", textClass: "text-gray-700" };
              const isExpanded = expandedId === order.id;
              const isCancellingThis = cancellingId === order.id;

              return (
                <View key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
                  {/* Summary Block */}
                  <View className="p-4">
                    <View className="flex-row justify-between mb-3">
                      <View>
                        <View className="flex-row items-center mb-1">
                          <Text className="font-mono text-sm font-bold text-gray-900">{order.orderNumber}</Text>
                          <Text className="text-gray-300 mx-2">|</Text>
                          <Text className="text-xs text-gray-500 font-medium">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className={`px-2 py-1 rounded-full flex-row items-center mr-2 ${config.bgClass}`}>
                            <Feather name={STATUS_ICONS[order.status] || "info"} size={10} className={config.textClass} />
                            <Text className={`text-[10px] font-bold uppercase ml-1 tracking-wider ${config.textClass}`}>{config.label}</Text>
                          </View>
                          <Text className="text-base font-extrabold text-gray-900">
                            {getCurrencySymbol(order.currency)} {parseFloat(order.totalAmount).toLocaleString()}
                          </Text>
                        </View>
                      </View>

                      {/* Quick Item Previews */}
                      <View className="flex-row items-center">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <View
                            key={item.id}
                            className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 overflow-hidden shadow-sm"
                            style={{ marginLeft: idx > 0 ? -12 : 0, zIndex: 3 - idx }}
                          >
                            {item.productSnapshot?.imagesThumbnail ? (
                              <Image source={{ uri: item.productSnapshot.imagesThumbnail }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                              <View className="flex-1 items-center justify-center bg-gray-100"><Feather name="package" size={14} color="#9CA3AF" /></View>
                            )}
                          </View>
                        ))}
                        {order.items.length > 3 && (
                          <View className="w-10 h-10 rounded-full border-2 border-white bg-gray-900 items-center justify-center" style={{ marginLeft: -12, zIndex: 0 }}>
                            <Text className="text-white text-[10px] font-bold">+{order.items.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Tracking Widget */}
                    {order.trackingNumber && (
                      <View className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-4 flex-row justify-between items-center">
                        <View className="flex-row items-center flex-1">
                          <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
                            <Feather name="truck" size={16} color="#4F46E5" />
                          </View>
                          <View>
                            <Text className="text-[10px] uppercase font-bold text-indigo-400">Tracking Number</Text>
                            <Text className="text-sm font-bold text-indigo-700">{order.trackingNumber}</Text>
                          </View>
                        </View>
                        {order.trackingUrl && (
                          <TouchableOpacity 
                            onPress={() => Linking.openURL(order.trackingUrl!)}
                            className="bg-indigo-600 px-3 py-1.5 rounded-lg flex-row items-center"
                          >
                            <Text className="text-white text-[11px] font-bold mr-1">Track</Text>
                            <Feather name="external-link" size={12} color="white" />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}

                    {/* Action Buttons Row */}
                    <View className="flex-row flex-wrap border-t border-gray-100 pt-3 gap-2">
                      <TouchableOpacity
                        onPress={() => setExpandedId(isExpanded ? null : order.id)}
                        className="bg-gray-900 px-4 py-2 rounded-lg flex-row items-center shadow-sm"
                      >
                        <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color="white" className="mr-1.5" />
                        <Text className="text-white text-xs font-bold">{isExpanded ? "Hide Details" : "Order Details"}</Text>
                      </TouchableOpacity>

                      {order.invoiceUrl && (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(order.invoiceUrl!)}
                          className="bg-blue-50 px-4 py-2 rounded-lg flex-row items-center"
                        >
                          <Feather name="download" size={14} color="#1D4ED8" className="mr-1.5" />
                          <Text className="text-blue-700 text-xs font-bold">Invoice</Text>
                        </TouchableOpacity>
                      )}

                      {isCancellable(order.status) && (
                        <TouchableOpacity
                          onPress={() => setCancellingId(isCancellingThis ? null : order.id)}
                          className="bg-red-50 px-4 py-2 rounded-lg flex-row items-center ml-auto"
                        >
                          <Feather name="x-circle" size={14} color="#DC2626" className="mr-1.5" />
                          <Text className="text-red-600 text-xs font-bold">Cancel Order</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Cancel Dialog */}
                  {isCancellingThis && (
                    <View className="px-4 pb-4">
                      <View className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                        <Text className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Reason for Cancellation</Text>
                        <TextInput
                          value={cancelReason}
                          onChangeText={setCancelReason}
                          placeholder="Please tell us why..."
                          placeholderTextColor="#9CA3AF"
                          multiline
                          numberOfLines={3}
                          className="bg-white border border-red-200 rounded-lg p-3 text-sm text-gray-900 font-medium mb-3 h-20 text-left items-start justify-start"
                        />
                        <View className="flex-row justify-end space-x-2">
                          <TouchableOpacity
                            onPress={() => {
                              setCancellingId(null);
                              setCancelReason("");
                            }}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg mr-2"
                          >
                            <Text className="text-gray-600 text-xs font-bold">Don't Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleCancelSubmit(order.id)}
                            disabled={isCancelling || !cancelReason.trim()}
                            className={`px-4 py-2.5 bg-red-600 rounded-lg flex-row items-center ${(!cancelReason.trim() || isCancelling) ? "opacity-50" : ""}`}
                          >
                            {isCancelling ? (
                              <ActivityIndicator size="small" color="white" />
                            ) : (
                              <>
                                <Feather name="send" size={14} color="white" className="mr-2" />
                                <Text className="text-white text-xs font-bold">Confirm</Text>
                              </>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <View className="bg-gray-50 border-t border-gray-200 p-4 space-y-6">
                      
                      {/* Shipping Details */}
                      <View>
                        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Details</Text>
                        <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                          <Text className="font-bold text-sm text-gray-900 mb-1">{order.shippingName}</Text>
                          <Text className="text-sm text-gray-600 leading-5">{order.shippingAddress}</Text>
                          <Text className="text-sm text-gray-600 font-medium">{order.shippingCity}, {order.shippingState} {order.shippingZip}</Text>
                          {order.shippingPhone && (
                            <Text className="text-xs text-gray-400 mt-2">📞 {order.shippingPhone}</Text>
                          )}
                        </View>
                      </View>

                      {/* Status Timeline */}
                      {order.statusHistory && order.statusHistory.length > 0 && (
                        <View>
                          <View className="flex-row items-center mb-2">
                            <Feather name="clock" size={12} color="#9CA3AF" className="mr-1.5" />
                            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">Activity Timeline</Text>
                          </View>
                          <View className="space-y-3 pb-2">
                            {order.statusHistory.map((history, idx) => {
                              const cfg = ORDER_STATUS_CONFIG[history.status] || { label: history.status, bgClass: "bg-gray-200", textClass: "text-gray-700" };
                              // Latest item is at the top usually based on backend sort, assuming chronological map
                              const isLast = idx === order.statusHistory!.length - 1;
                              
                              return (
                                <View key={history.id} className="flex-row relative">
                                  {!isLast && <View className="absolute left-[11px] top-6 bottom-[-16px] w-0.5 bg-gray-200 z-0" />}
                                  
                                  <View className={`w-6 h-6 rounded-full border-2 border-white items-center justify-center z-10 ${cfg.bgClass}`}>
                                    <View className={`w-1.5 h-1.5 rounded-full ${cfg.textClass.replace('text-', 'bg-')}`} />
                                  </View>
                                  
                                  <View className="ml-3 flex-1 pb-1">
                                    <View className="flex-row items-center">
                                      <Text className="text-xs flex-1 font-bold text-gray-800">{cfg.label}</Text>
                                      <Text className="text-[10px] text-gray-400">
                                        {new Date(history.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                      </Text>
                                    </View>
                                    {history.notes && (
                                      <View className="bg-white border border-gray-100 rounded-md px-2 py-1 mt-1 self-start shadow-sm">
                                        <Text className="text-[10px] text-gray-500">{history.notes}</Text>
                                      </View>
                                    )}
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      )}

                      {/* Items */}
                      <View>
                        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Items ({order.items.length})</Text>
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-1">
                          {order.items.map((item, idx) => (
                            <View key={item.id} className={`flex-row items-center p-2.5 ${idx !== 0 ? "border-t border-gray-50" : ""}`}>
                              <View className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 mr-3">
                                {item.productSnapshot?.imagesThumbnail ? (
                                  <Image source={{ uri: item.productSnapshot.imagesThumbnail }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                  <View className="flex-1 items-center justify-center"><Feather name="package" size={16} color="#D1D5DB" /></View>
                                )}
                              </View>
                              <View className="flex-1 justify-center">
                                <Text className="text-sm font-bold text-gray-900" numberOfLines={1}>{item.productTitle}</Text>
                                <Text className="text-xs text-gray-500 mt-0.5">
                                  {getCurrencySymbol(item.currency)}{parseFloat(item.productPrice).toLocaleString()} × {item.quantity}
                                </Text>
                              </View>
                              <Text className="text-sm font-extrabold text-gray-900 ml-2">
                                {getCurrencySymbol(item.currency)}{parseFloat(item.totalPrice).toLocaleString()}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Totals Calculation */}
                      <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <View className="flex-row justify-between mb-2">
                          <Text className="text-sm font-medium text-gray-500">Subtotal</Text>
                          <Text className="text-sm font-bold text-gray-900">{getCurrencySymbol(order.currency)} {parseFloat(order.subtotal).toLocaleString()}</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                          <Text className="text-sm font-medium text-gray-500">Tax</Text>
                          <Text className="text-sm font-bold text-gray-900">{getCurrencySymbol(order.currency)} {parseFloat(order.tax).toLocaleString()}</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                          <Text className="text-sm font-medium text-gray-500">Shipping</Text>
                          <Text className="text-sm font-bold text-gray-900">{getCurrencySymbol(order.currency)} {parseFloat(order.shippingCost).toLocaleString()}</Text>
                        </View>
                        <View className="h-px bg-gray-100 mb-3" />
                        <View className="flex-row justify-between items-center">
                          <Text className="text-sm font-extrabold text-gray-900">Total Amount</Text>
                          <Text className="text-lg font-black text-orange-600">{getCurrencySymbol(order.currency)} {parseFloat(order.totalAmount).toLocaleString()}</Text>
                        </View>
                      </View>

                      {order.customerNotes && (
                        <View className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                          <Text className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-1">Your Notes</Text>
                          <Text className="text-xs text-yellow-800 italic">"{order.customerNotes}"</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
