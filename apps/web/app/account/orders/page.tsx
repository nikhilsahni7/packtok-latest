"use client";

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
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
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.post(`/api/v1/orders/${orderId}/cancel`);
      toast.success("Order cancelled successfully");
      const res = await api.get<{ data: { orders: Order[] } }>("/api/v1/orders");
      setOrders(res.data.data?.orders || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel order");
    }
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
        <Link href="/marketplace" className="text-orange-600 hover:underline text-sm">
          Continue Shopping →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-2xl">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
          <Link href="/marketplace" className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = ORDER_STATUS_CONFIG[order.status];
            const StatusIcon = STATUS_ICONS[order.status];

            return (
              <div key={order.id} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-mono text-sm text-gray-500">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor}`}>
                      <StatusIcon className={`h-4 w-4 ${config.color}`} />
                      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                    </div>
                    <p className="font-semibold text-lg">
                      {order.currency} {parseFloat(order.totalAmount).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto py-2">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border">
                      {item.product?.imagesThumbnail ? (
                        <Image src={item.product.imagesThumbnail} alt={item.productTitle} width={56} height={56} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-sm text-gray-500">+{order.items.length - 4} more</span>
                  )}
                </div>

                {/* Tracking info */}
                {order.trackingNumber && (
                  <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-indigo-700">
                      <Truck className="h-4 w-4" />
                      <span className="font-medium text-sm">Tracking: {order.trackingNumber}</span>
                    </div>
                    {order.trackingUrl && (
                      <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm flex items-center gap-1 mt-1">
                        Track Shipment <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <button onClick={() => setSelectedOrder(order)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                    View Details
                  </button>
                  {order.invoiceUrl && (
                    <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium">
                      <Download className="h-4 w-4" /> Invoice
                    </a>
                  )}
                  {(order.status === "PAID" || order.status === "PROCESSING") && (
                    <button onClick={() => handleCancelOrder(order.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-bold text-lg">Order Details</h3>
                <p className="text-sm text-gray-500">{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Shipping Address</h4>
                <div className="text-sm bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{selectedOrder.shippingName}</p>
                  <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                  <p className="text-gray-600">{selectedOrder.shippingCity}, {selectedOrder.shippingState} {selectedOrder.shippingZip}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Items</h4>
                <div className="divide-y border rounded-lg">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                        {item.product?.imagesThumbnail ? (
                          <Image src={item.product.imagesThumbnail} alt={item.productTitle} width={48} height={48} className="w-full h-full object-cover rounded" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package className="h-4 w-4 text-gray-300" /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productTitle}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-sm">{item.currency} {parseFloat(item.totalPrice).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-orange-600">{selectedOrder.currency} {parseFloat(selectedOrder.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
