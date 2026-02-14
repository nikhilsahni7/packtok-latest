// Shared order types for web app
// Used in checkout, profile/orders, and cart context

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_FAILED"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUND_PENDING"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  productTitle: string;
  productPrice: string;
  quantity: number;
  totalPrice: string;
  currency: string;
  product?: {
    id: string;
    imagesThumbnail?: string;
    category?: {
      name: string;
    };
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string;
  tax: string;
  shippingCost: string;
  totalAmount: string;
  currency: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  trackingNumber?: string;
  trackingUrl?: string;
  invoiceUrl?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  items: OrderItem[];
  statusHistory?: {
    id: string;
    createdAt: string;
    status: OrderStatus;
    notes?: string;
  }[];
}

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Order status display config
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  PAYMENT_FAILED: {
    label: "Payment Failed",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  PAID: {
    label: "Order Confirmed",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  PROCESSING: {
    label: "Processing",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  REFUND_PENDING: {
    label: "Refund Pending",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
};
