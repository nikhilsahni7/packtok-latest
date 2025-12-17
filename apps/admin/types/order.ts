// Order types for admin panel
export interface OrderUser {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
}

export interface OrderProduct {
  id: string;
  title: string;
  imagesThumbnail?: string | null;
}

export interface OrderItem {
  id: string;
  productTitle: string;
  productPrice: string;
  quantity: number;
  totalPrice: string;
  currency: string;
  product?: OrderProduct;
}

export interface OrderPayment {
  id: string;
  provider: string;
  status: string;
  amount: string;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export interface OrderStatusHistory {
  id: string;
  status: string;
  notes?: string;
  createdAt: string;
  changedById?: string;
}

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
  adminNotes?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment?: OrderPayment;
  statusHistory?: OrderStatusHistory[];
  user?: OrderUser;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
}

export interface OrderStats {
  total: number;
  byStatus: {
    pending: number;
    paid: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    refunded: number;
  };
  revenue: string;
}
