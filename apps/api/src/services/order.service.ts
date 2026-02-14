import {
  MarketplaceProductStatus,
  Order,
  OrderItem,
  OrderPayment,
  OrderStatus,
  PaymentIntentStatus,
  PaymentProvider,
  Prisma,
  prisma,
  StockMovementReason
} from "@packtok/db";
import { ApiError } from "../utils/apiError";
import { clearCart, validateCartForCheckout } from "./cart.service";
import { generateInvoicePdf, uploadInvoiceToSupabase } from "./invoice.service";
import {
  createOrder as createRazorpayOrder,
  getRazorpayPublishableKey,
  RazorpayOrderSummary,
  verifyPaymentSignature,
} from "./payments/razorpay.service";

// ===== Types =====

export interface CreateOrderInput {
  addressId: string;
  customerNotes?: string;
}

export interface VerifyPaymentInput {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface OrderWithDetails extends Order {
  items: OrderItem[];
  payment: OrderPayment | null;
}

// ===== Helpers =====

const generateOrderNumber = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const count = await prisma.order.count({
    where: { createdAt: { gte: startOfDay } },
  });

  return `PKT-${dateStr}-${String(count + 1).padStart(4, "0")}`;
};

const toMinorUnits = (amount: Prisma.Decimal, currency: string): number => {
  // Most currencies use 2 decimal places (100 minor units = 1 major unit)
  return Math.round(amount.toNumber() * 100);
};

const orderInclude = {
  items: { include: { product: { select: { id: true, title: true, imagesThumbnail: true, category: { select: { name: true } } } } } },
  payment: true,
  statusHistory: { orderBy: { createdAt: "desc" as const }, take: 5 },
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.OrderInclude;

// ===== Order Service Functions =====

/**
 * Create order from cart and initiate Razorpay payment
 */
export const createOrderFromCart = async (
  userId: string,
  input: CreateOrderInput
): Promise<{
  order: Order;
  razorpayOrder: RazorpayOrderSummary;
  razorpayKey: string;
}> => {
  const { addressId, customerNotes } = input;

  // Validate address
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new ApiError(404, "Shipping address not found");
  }

  // Validate cart
  const { cart, validItems, currency, subtotal } = await validateCartForCheckout(userId);

  // Calculate totals
  const tax = new Prisma.Decimal(0); // TODO: Calculate tax based on region
  const shippingCost = new Prisma.Decimal(0); // TODO: Calculate shipping
  const totalAmount = subtotal.add(tax).add(shippingCost);

  const razorpayKey = getRazorpayPublishableKey();

  // Create order in transaction
  const result = await prisma.$transaction(async (tx) => {
    const orderNumber = await generateOrderNumber();

    // Create order
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: OrderStatus.PENDING_PAYMENT,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        currency,
        shippingName: address.fullName,
        shippingPhone: address.phoneNumber,
        shippingAddress: `${address.addressLine1}${address.addressLine2 ? ", " + address.addressLine2 : ""}`,
        shippingCity: address.city,
        shippingState: address.state,
        shippingZip: address.postalCode,
        shippingCountry: address.country,
        customerNotes,
        statusHistory: {
          create: {
            status: OrderStatus.PENDING_PAYMENT,
            notes: "Order created, awaiting payment",
          },
        },
      },
    });

    // Create order items with product snapshots
    for (const item of validItems) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          productTitle: item.product.title,
          productPrice: item.product.price,
          quantity: item.quantity,
          totalPrice: item.product.price.mul(item.quantity),
          currency: item.product.currency,
          productSnapshot: {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price.toString(),
            imagesThumbnail: item.product.imagesThumbnail,
          },
        },
      });
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amountInPaise: toMinorUnits(totalAmount, currency),
      currency,
      receipt: order.orderNumber,
      notes: { orderId: order.id, userId },
    });

    // Create payment record
    await tx.orderPayment.create({
      data: {
        orderId: order.id,
        provider: PaymentProvider.RAZORPAY,
        status: PaymentIntentStatus.CREATED,
        amount: totalAmount,
        currency,
        razorpayOrderId: razorpayOrder.id,
        metadata: {
          razorpayOrderStatus: razorpayOrder.status,
          receipt: razorpayOrder.receipt,
        },
      },
    });

    return { order, razorpayOrder };
  });

  return { ...result, razorpayKey };
};

/**
 * Verify Razorpay payment and complete order
 */
export const verifyPaymentAndCompleteOrder = async (
  userId: string,
  input: VerifyPaymentInput
): Promise<OrderWithDetails> => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

  // Verify signature
  const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!isValid) {
    // Mark payment as failed
    await prisma.orderPayment.updateMany({
      where: { razorpayOrderId },
      data: { status: PaymentIntentStatus.FAILED },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAYMENT_FAILED,
        statusHistory: {
          create: { status: OrderStatus.PAYMENT_FAILED, notes: "Payment signature verification failed" },
        },
      },
    });

    throw new ApiError(400, "Invalid payment signature");
  }

  // Process successful payment in transaction
  const order = await prisma.$transaction(async (tx) => {
    // Get order with items
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true, payment: true },
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.userId !== userId) {
      throw new ApiError(403, "Unauthorized");
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new ApiError(400, "Order is not pending payment");
    }

    // Update payment
    await tx.orderPayment.update({
      where: { orderId },
      data: {
        status: PaymentIntentStatus.CAPTURED,
        razorpayPaymentId,
        razorpaySignature,
        metadata: {
          ...(order.payment?.metadata as object || {}),
          paymentId: razorpayPaymentId,
          capturedAt: new Date().toISOString(),
        },
      },
    });

    // Deduct stock for each item
    for (const item of order.items) {
      // Update product quantity
      const updatedProduct = await tx.marketplaceProduct.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });

      // Auto-set OUT_OF_STOCK when quantity reaches 0
      if (updatedProduct.quantity <= 0) {
        await tx.marketplaceProduct.update({
          where: { id: item.productId },
          data: { status: MarketplaceProductStatus.OUT_OF_STOCK },
        });
      }

      // Record stock movement
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          delta: -item.quantity,
          reason: StockMovementReason.SALE,
          createdById: userId,
          meta: { orderId: order.id, orderNumber: order.orderNumber },
        },
      });
    }

    // Update order status
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAID,
        statusHistory: {
          create: { status: OrderStatus.PAID, notes: "Payment received successfully" },
        },
      },
      include: orderInclude,
    });

    return updatedOrder;
  });

  // Clear cart after successful payment
  await clearCart(userId);

  // Generate and upload invoice (async, non-blocking)
  generateAndUploadInvoice(order.id).catch((err) => {
    console.error("Failed to generate invoice:", err);
  });

  return order as OrderWithDetails;
};

/**
 * Generate invoice PDF and upload to Supabase
 */
const generateAndUploadInvoice = async (orderId: string): Promise<void> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: { select: { name: true, email: true } } },
  });

  if (!order) return;

  try {
    const pdfBuffer = await generateInvoicePdf(order);
    const invoiceUrl = await uploadInvoiceToSupabase(order.orderNumber, pdfBuffer);

    await prisma.order.update({
      where: { id: orderId },
      data: { invoiceUrl },
    });
  } catch (err) {
    console.error("Invoice generation failed:", err);
  }
};

/**
 * Get user's orders
 */
export const getUserOrders = async (
  userId: string,
  options: { status?: OrderStatus; limit?: number; offset?: number } = {}
): Promise<{ orders: Order[]; total: number }> => {
  const { status, limit = 20, offset = 0 } = options;

  const where: Prisma.OrderWhereInput = { userId };
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
};

/**
 * Get order by ID
 */
export const getOrderById = async (userId: string, orderId: string): Promise<Order> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw new ApiError(403, "Unauthorized");
  }

  return order;
};

/**
 * Cancel order (only before shipment)
 */
export const cancelOrder = async (userId: string, orderId: string, reason?: string): Promise<Order> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw new ApiError(403, "Unauthorized");
  }

  // Can only cancel before shipment
  const cancellableStatuses: OrderStatus[] = [OrderStatus.PENDING_PAYMENT, OrderStatus.PAID, OrderStatus.PROCESSING];
  if (!cancellableStatuses.includes(order.status)) {
    throw new ApiError(400, "Order cannot be cancelled after shipment");
  }

  const cancelNote = reason
    ? `Cancelled by customer: ${reason}`
    : "Cancelled by customer";

  return prisma.$transaction(async (tx) => {
    // If order was paid, restore stock
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      for (const item of order.items) {
        const updatedProduct = await tx.marketplaceProduct.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        });

        // Auto-restore to AVAILABLE if product was OUT_OF_STOCK
        if (
          updatedProduct.quantity > 0 &&
          updatedProduct.status === MarketplaceProductStatus.OUT_OF_STOCK
        ) {
          await tx.marketplaceProduct.update({
            where: { id: item.productId },
            data: { status: MarketplaceProductStatus.AVAILABLE },
          });
        }

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            delta: item.quantity,
            reason: StockMovementReason.CANCELLATION,
            createdById: userId,
            meta: { orderId: order.id, reason: cancelNote },
          },
        });
      }
    }

    // Update order status
    return tx.order.update({
      where: { id: orderId },
      data: {
        status: order.status === OrderStatus.PENDING_PAYMENT
          ? OrderStatus.CANCELLED
          : OrderStatus.REFUND_PENDING,
        cancelledAt: new Date(),
        statusHistory: {
          create: {
            status: order.status === OrderStatus.PENDING_PAYMENT
              ? OrderStatus.CANCELLED
              : OrderStatus.REFUND_PENDING,
            notes: cancelNote,
            changedById: userId,
          },
        },
      },
      include: orderInclude,
    });
  });
};
