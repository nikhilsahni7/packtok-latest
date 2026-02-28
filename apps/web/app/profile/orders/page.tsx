"use client";

import Protected from "@/components/auth/protected";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import api from "@/lib/axios";
import { Order, ORDER_STATUS_CONFIG } from "@/types/order";
import {
    CheckCircle,
    Clock,
    Download,
    ExternalLink,
    Loader2,
    Package,
    Truck,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Status icons mapping (icons need to be in component since they're React components)
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

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelOrderTarget, setCancelOrderTarget] = useState<{ id: string; orderNumber: string } | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get<{ data: { orders: Order[] } }>("/api/v1/orders");
        setOrders(res.data.data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  useEffect(() => {
    const successOrder = searchParams.get("success");
    const orderNumber = searchParams.get("order");
    if (successOrder === "true" && orderNumber) {
      toast.success(`Order ${orderNumber} placed successfully!`, {
        duration: 5000,
        icon: "🎉",
      });
      // Clear the URL params
      router.replace("/profile/orders");
    }
  }, [searchParams, router]);

  const handleCancelOrder = async (orderId: string) => {
    setCancelOrderTarget(null);
    try {
      await api.post(`/api/v1/orders/${orderId}/cancel`);
      toast.success("Order cancelled successfully");
      // Refresh orders
      const res = await api.get<{ data: { orders: Order[] } }>("/api/v1/orders");
      setOrders(res.data.data.orders || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel order");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-500 mb-8">Track and manage your orders</p>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-6">
              When you place an order, it will appear here
            </p>
            <a
              href="/marketplace"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = ORDER_STATUS_CONFIG[order.status];
              const StatusIcon = STATUS_ICONS[order.status];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm text-gray-500">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}
                      >
                        <StatusIcon className={`h-4 w-4 ${config.color}`} />
                        <span className={`text-sm font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-lg font-semibold">
                        {order.currency} {parseFloat(order.totalAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden"
                        >
                          {item.product?.imagesThumbnail ? (
                            <Image
                              src={item.product.imagesThumbnail}
                              alt={item.productTitle}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Tracking & Actions */}
                  {order.trackingNumber && (
                    <div className="px-6 pb-4">
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-indigo-700 mb-1">
                          <Truck className="h-4 w-4" />
                          <span className="font-medium">Tracking</span>
                        </div>
                        <p className="font-mono text-sm">{order.trackingNumber}</p>
                        {order.trackingUrl && (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-sm mt-2"
                          >
                            Track Shipment <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="px-6 pb-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>

                    {order.invoiceUrl && (
                      <a
                        href={order.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Download className="h-4 w-4" />
                        Invoice
                      </a>
                    )}

                    {(order.status === "PAID" || order.status === "PROCESSING") && (
                      <button
                        onClick={() => setCancelOrderTarget({ id: order.id, orderNumber: order.orderNumber })}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Order Details</h2>
                <p className="text-sm text-gray-500">{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{selectedOrder.shippingName}</p>
                  <p>{selectedOrder.shippingAddress}</p>
                  <p>
                    {selectedOrder.shippingCity}, {selectedOrder.shippingState}{" "}
                    {selectedOrder.shippingZip}
                  </p>
                  <p>{selectedOrder.shippingCountry}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="divide-y border rounded-lg">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
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
                            <Package className="h-4 w-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productTitle}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">
                        {item.currency} {parseFloat(item.totalPrice).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {selectedOrder.currency}{" "}
                    {parseFloat(selectedOrder.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirm Modal */}
      <ConfirmModal
        open={!!cancelOrderTarget}
        onConfirm={() => cancelOrderTarget && handleCancelOrder(cancelOrderTarget.id)}
        onCancel={() => setCancelOrderTarget(null)}
        title="Cancel Order"
        description={
          <>
            <p>Are you sure you want to cancel order</p>
            <p className="font-semibold text-gray-900 mt-1">{cancelOrderTarget?.orderNumber}</p>
            <p className="mt-2 text-xs text-red-500">This action cannot be undone.</p>
          </>
        }
        confirmLabel="Cancel Order"
        variant="danger"
      />
    </div>
  );
}

// Wrap with Protected to handle auth properly (waits for hydration)
export default function ProfileOrdersPage() {
  return (
    <Protected redirectTo="/auth/signin?redirect=/profile/orders">
      <OrdersContent />
    </Protected>
  );
}
