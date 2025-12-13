import {
    OrderStatus,
    prisma,
    Prisma,
    StockMovementReason
} from "@packtok/db";
import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// ===== Types =====

interface UpdateOrderStatusInput {
  status: OrderStatus;
  notes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

const orderInclude = {
  items: { include: { product: { select: { id: true, title: true, imagesThumbnail: true } } } },
  payment: true,
  statusHistory: { orderBy: { createdAt: "desc" as const }, take: 10 },
  user: { select: { id: true, name: true, email: true, phone_number: true } },
} satisfies Prisma.OrderInclude;

// ===== Admin Order Controllers =====

/**
 * GET /admins/orders - List all orders with filters
 */
export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, search, limit = 50, offset = 0 } = req.query;

  const where: Prisma.OrderWhereInput = {};

  if (status && status !== "all") {
    where.status = status as OrderStatus;
  }

  if (search) {
    const searchStr = search as string;
    where.OR = [
      { orderNumber: { contains: searchStr, mode: "insensitive" } },
      { shippingName: { contains: searchStr, mode: "insensitive" } },
      { user: { email: { contains: searchStr, mode: "insensitive" } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    }),
    prisma.order.count({ where }),
  ]);

  res.json(new ApiResponse(200, { orders, total }, "Orders retrieved"));
});

/**
 * GET /admins/orders/:id - Get order details
 */
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.json(new ApiResponse(200, order, "Order retrieved"));
});

/**
 * PATCH /admins/orders/:id/status - Update order status
 */
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes, trackingNumber, trackingUrl } = req.body as UpdateOrderStatusInput;

  if (!status) {
    throw new ApiError(400, "status is required");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Validate status transition
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING_PAYMENT]: [OrderStatus.CANCELLED, OrderStatus.PAYMENT_FAILED],
    [OrderStatus.PAYMENT_FAILED]: [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.REFUND_PENDING],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED, OrderStatus.REFUND_PENDING],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [], // Final state
    [OrderStatus.CANCELLED]: [], // Final state
    [OrderStatus.REFUND_PENDING]: [OrderStatus.REFUNDED],
    [OrderStatus.REFUNDED]: [], // Final state
  };

  if (!validTransitions[order.status]?.includes(status)) {
    throw new ApiError(400, `Cannot transition from ${order.status} to ${status}`);
  }

  const updateData: Prisma.OrderUpdateInput = {
    status,
    statusHistory: {
      create: {
        status,
        notes: notes || `Status updated to ${status}`,
        changedById: req.user!.id,
      },
    },
  };

  // Handle specific status transitions
  if (status === OrderStatus.SHIPPED) {
    updateData.shippedAt = new Date();
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (trackingUrl) updateData.trackingUrl = trackingUrl;
  }

  if (status === OrderStatus.DELIVERED) {
    updateData.deliveredAt = new Date();
  }

  if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.PENDING_PAYMENT) {
    // Restore stock if order was paid
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.marketplaceProduct.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            delta: item.quantity,
            reason: StockMovementReason.CANCELLATION,
            createdById: req.user!.id,
            meta: { orderId: order.id, reason: "Admin cancelled order" },
          },
        });
      }
    });
    updateData.cancelledAt = new Date();
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: updateData,
    include: orderInclude,
  });

  res.json(new ApiResponse(200, updatedOrder, "Order status updated"));
});

/**
 * PATCH /admins/orders/:id/tracking - Update tracking info
 */
export const updateTracking = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { trackingNumber, trackingUrl, adminNotes } = req.body;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      trackingNumber: trackingNumber ?? order.trackingNumber,
      trackingUrl: trackingUrl ?? order.trackingUrl,
      adminNotes: adminNotes ?? order.adminNotes,
    },
    include: orderInclude,
  });

  res.json(new ApiResponse(200, updatedOrder, "Tracking info updated"));
});

/**
 * GET /admins/orders/stats - Get order statistics
 */
export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    total,
    pending,
    paid,
    processing,
    shipped,
    delivered,
    cancelled,
    refunded,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING_PAYMENT } }),
    prisma.order.count({ where: { status: OrderStatus.PAID } }),
    prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
    prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
    prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
    prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    prisma.order.count({ where: { status: OrderStatus.REFUNDED } }),
  ]);

  // Get revenue stats (only delivered orders)
  const revenueResult = await prisma.order.aggregate({
    where: { status: OrderStatus.DELIVERED },
    _sum: { totalAmount: true },
  });

  res.json(
    new ApiResponse(
      200,
      {
        total,
        byStatus: { pending, paid, processing, shipped, delivered, cancelled, refunded },
        revenue: revenueResult._sum.totalAmount?.toString() || "0",
      },
      "Order stats retrieved"
    )
  );
});
