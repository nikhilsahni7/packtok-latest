"use client";

import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@packtok/ui/components/dialog";
import { Input } from "@packtok/ui/components/input";
import { Label } from "@packtok/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packtok/ui/components/select";
import { Textarea } from "@packtok/ui/components/textarea";
import {
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../../lib/axios";
import { Order, OrderStatus } from "../../../../types/order";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const statusColors: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAYMENT_FAILED: "bg-red-100 text-red-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  REFUND_PENDING: "bg-orange-100 text-orange-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
};

export function OrderDetailsDialog({
  order,
  open,
  onClose,
  onRefresh,
}: OrderDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [notes, setNotes] = useState("");

  if (!order) return null;

  const availableNextStatuses = nextStatus[order.status] || [];

  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    setIsUpdating(true);
    try {
      await api.patch(`/api/v1/admins/orders/${order.id}/status`, {
        status: newStatus,
        notes,
        trackingNumber: trackingNumber || undefined,
        trackingUrl: trackingUrl || undefined,
      });
      toast.success("Order status updated");
      setNewStatus("");
      setNotes("");
      setTrackingNumber("");
      setTrackingUrl("");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateTracking = async () => {
    setIsUpdating(true);
    try {
      await api.patch(`/api/v1/admins/orders/${order.id}/tracking`, {
        trackingNumber,
        trackingUrl,
      });
      toast.success("Tracking info updated");
      onRefresh();
    } catch (error) {
      toast.error("Failed to update tracking");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-600" />
            Order {order.orderNumber}
            <Badge className={`${statusColors[order.status]} ml-2`}>
              {order.status.replace(/_/g, " ")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" /> Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Name:</span>{" "}
                <span className="font-medium">{order.shippingName}</span>
              </p>
              <p>
                <span className="text-gray-500">Email:</span>{" "}
                <span className="font-medium">{order.user?.email || "N/A"}</span>
              </p>
              <p className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-gray-400" />
                <span className="font-medium">{order.shippingPhone}</span>
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Shipping Address
            </h3>
            <div className="text-sm space-y-1">
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity}, {order.shippingState} {order.shippingZip}
              </p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
          <div className="border rounded-lg overflow-hidden">
            {order.items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 ${
                  index !== order.items.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.productTitle}</p>
                  <p className="text-sm text-gray-500">
                    {item.currency} {item.productPrice} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {item.currency} {parseFloat(item.totalPrice).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>
                {order.currency} {parseFloat(order.subtotal).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Tax</span>
              <span>
                {order.currency} {parseFloat(order.tax).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>
                {order.currency} {parseFloat(order.shippingCost).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>
                {order.currency} {parseFloat(order.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div className="mt-6 bg-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4" /> Tracking Information
            </h3>
            <p className="font-mono">{order.trackingNumber}</p>
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline text-sm flex items-center gap-1 mt-2"
              >
                Track Shipment <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {/* Invoice */}
        {order.invoiceUrl && (
          <div className="mt-4">
            <a
              href={order.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
            >
              <Download className="h-4 w-4" /> Download Invoice
            </a>
          </div>
        )}

        {/* Status Update Section */}
        {availableNextStatuses.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNextStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newStatus === "SHIPPED" && (
                <>
                  <div>
                    <Label>Tracking Number</Label>
                    <Input
                      placeholder="Enter tracking number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Tracking URL</Label>
                    <Input
                      placeholder="https://..."
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Add a note about this status change..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  onClick={handleUpdateStatus}
                  disabled={!newStatus || isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isUpdating ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Status History
            </h3>
            <div className="space-y-3">
              {order.statusHistory.map((history) => (
                <div
                  key={history.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                  <div>
                    <p className="font-medium">
                      {history.status.replace(/_/g, " ")}
                    </p>
                    <p className="text-gray-500">{history.notes}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(history.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
