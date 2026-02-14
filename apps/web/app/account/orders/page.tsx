"use client";

import api from "@/lib/axios";
import { Order, ORDER_STATUS_CONFIG } from "@/types/order";
import {
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Download,
    ExternalLink,
    History,
    Loader2,
    Package,
    Send,
    Truck,
    XCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const STATUS_ICONS = {
  PENDING_PAYMENT: Clock,
  PAYMENT_FAILED: XCircle,
  PAID: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  REFUND_PENDING: Clock,
  REFUNDED: CheckCircle,
} as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await api.get<{ data: { orders: Order[] } }>("/api/v1/orders");
      setOrders(res.data.data?.orders || []);
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    setIsCancelling(true);
    try {
      await api.post(`/api/v1/orders/${orderId}/cancel`, {
        reason: cancelReason.trim(),
      });
      toast.success("Order cancelled successfully");
      setCancellingId(null);
      setCancelReason("");
      fetchOrders();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const isCancellable = (status: string) => {
    return ["PENDING_PAYMENT", "PAID", "PROCESSING"].includes(status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <Link
          href="/marketplace"
          className="text-orange-600 hover:underline text-sm font-medium"
        >
          Continue Shopping →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Start shopping to see your orders here
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black text-sm font-bold shadow-sm"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = ORDER_STATUS_CONFIG[order.status];
            const StatusIcon = STATUS_ICONS[order.status];
            const isExpanded = expandedId === order.id;
            const isCancellingThis = cancellingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white border rounded-xl overflow-hidden transition-all hover:shadow-sm"
              >
                {/* Order Summary Line */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-gray-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bgColor} ${config.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                        <span className="text-lg font-extrabold text-gray-900">
                          {order.currency}{" "}
                          {parseFloat(order.totalAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quick Preview Icons */}
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={item.id}
                          className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex-shrink-0 overflow-hidden shadow-sm"
                          style={{ zIndex: 3 - idx }}
                        >
                          {item.product?.imagesThumbnail ? (
                            <Image
                              src={item.product.imagesThumbnail}
                              alt={item.productTitle}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-gray-300" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-[10px] font-bold text-white z-0">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracking Widget */}
                  {order.trackingNumber && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Truck className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                            Tracking Number
                          </p>
                          <p className="text-sm font-bold text-indigo-700">
                            {order.trackingNumber}
                          </p>
                        </div>
                      </div>
                      {order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-[11px] font-bold transition-all"
                        >
                          Track <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black text-xs font-bold transition-all"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3.5 w-3.5" /> Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3.5 w-3.5" /> Order Details
                        </>
                      )}
                    </button>

                    {order.invoiceUrl && (
                      <a
                        href={order.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-xs font-bold transition-all"
                      >
                        <Download className="h-3.5 w-3.5" /> Invoice
                      </a>
                    )}

                    {isCancellable(order.status) && (
                      <button
                        onClick={() =>
                          setCancellingId(isCancellingThis ? null : order.id)
                        }
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-bold transition-all"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Cancel Dialog */}
                {isCancellingThis && (
                  <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-inner">
                      <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                        Reason for Cancellation
                      </label>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Please tell us why you're cancelling this order..."
                        rows={3}
                        className="w-full border border-red-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none bg-white"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={isCancelling}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-bold shadow-sm disabled:opacity-50"
                        >
                          {isCancelling ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                          Confirm Cancellation
                        </button>
                        <button
                          onClick={() => {
                            setCancellingId(null);
                            setCancelReason("");
                          }}
                          className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-bold"
                        >
                          Don&apos;t Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed View */}
                {isExpanded && (
                  <div className="border-t bg-gray-50/50 p-5 space-y-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: Shipping & Billing */}
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Shipping Details
                          </h5>
                          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <p className="font-bold text-sm text-gray-900 mb-1">
                              {order.shippingName}
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {order.shippingAddress}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">
                              {order.shippingCity}, {order.shippingState}{" "}
                              {order.shippingZip}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                              📞 {order.shippingPhone}
                            </p>
                          </div>
                        </div>

                        {/* Order Timeline */}
                        {order.statusHistory && order.statusHistory.length > 0 && (
                          <div>
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <History className="h-3 w-3" /> Activity Timeline
                            </h5>
                            <div className="space-y-3">
                              {order.statusHistory.map((history, idx) => {
                                const cfg = ORDER_STATUS_CONFIG[history.status];
                                return (
                                  <div
                                    key={history.id}
                                    className="flex gap-3 relative"
                                  >
                                    {/* Timeline line */}
                                    {idx !== order.statusHistory!.length - 1 && (
                                      <div className="absolute left-[11px] top-6 bottom-[-12px] w-[2px] bg-gray-100" />
                                    )}

                                    <div
                                      className={`h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-white shadow-sm ${cfg.bgColor} ${cfg.color}`}
                                    >
                                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                    </div>
                                    <div className="pb-2">
                                      <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-gray-800">
                                          {cfg.label}
                                        </p>
                                        <span className="text-[10px] text-gray-400">
                                          {new Date(
                                            history.createdAt
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                          ,{" "}
                                          {new Date(
                                            history.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      {history.notes && (
                                        <p className="text-xs text-gray-500 mt-0.5 mt-1 bg-white inline-block px-2 py-1 rounded border border-gray-50">
                                          {history.notes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Items & Totals */}
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Order Items ({order.items.length})
                          </h5>
                          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            {order.items.map((item, idx) => (
                              <div
                                key={item.id}
                                className={`flex items-center gap-4 p-3 ${
                                  idx !== 0 ? "border-t border-gray-50" : ""
                                }`}
                              >
                                <div className="w-12 h-12 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden border">
                                  {item.product?.imagesThumbnail ? (
                                    <Image
                                      src={item.product.imagesThumbnail}
                                      alt={item.productTitle}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="h-5 w-5 text-gray-300" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">
                                    {item.productTitle}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {item.currency}{" "}
                                    {parseFloat(item.productPrice).toLocaleString()}{" "}
                                    × {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-extrabold text-gray-900">
                                    {item.currency}{" "}
                                    {parseFloat(item.totalPrice).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Calculation */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-2.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">
                              Subtotal
                            </span>
                            <span className="text-gray-900 font-bold">
                              {order.currency}{" "}
                              {parseFloat(order.subtotal).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Tax</span>
                            <span className="text-gray-900 font-bold">
                              {order.currency}{" "}
                              {parseFloat(order.tax).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">
                              Shipping
                            </span>
                            <span className="text-gray-900 font-bold">
                              {order.currency}{" "}
                              {parseFloat(order.shippingCost).toLocaleString()}
                            </span>
                          </div>
                          <div className="h-px bg-gray-100 my-1" />
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-sm font-extrabold text-gray-900">
                              Total Amount
                            </span>
                            <span className="text-lg font-black text-orange-600">
                              {order.currency}{" "}
                              {parseFloat(order.totalAmount).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {order.customerNotes && (
                          <div className="bg-yellow-50/50 border border-yellow-100 rounded-lg p-3">
                            <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-1">
                              Your Notes
                            </p>
                            <p className="text-xs text-yellow-800 italic">
                              &ldquo;{order.customerNotes}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
