import {
    Auction,
    AuctionBid,
    AuctionBidType,
    AuctionEnrollment,
    AuctionEnrollmentStatus,
    AuctionResult,
    AuctionStatus,
    PaymentIntent,
    PaymentIntentStatus,
    PaymentProvider,
    PaymentRefund,
    Prisma,
    prisma,
} from "@packtok/db";
import {
    publishAuctionFinalized,
    publishBidPlaced,
    publishLeaderboardSnapshot,
} from "../realtime/auction.publisher";
import { ApiError } from "../utils/apiError";
import {
    createOrder as createRazorpayOrder,
    getRazorpayPublishableKey,
    RazorpayOrderSummary,
    verifyPaymentSignature,
} from "./payments/razorpay.service";

interface CreateAuctionInput {
  productId: string;
  mode: AuctionBidType;
  startAt: Date;
  endAt: Date;
  startingAmount: Prisma.Decimal | number | string;
  earnestAmount: Prisma.Decimal | number | string;
  currency?: string;
  minBidIncrement?: Prisma.Decimal | number | string | null;
  minBidDecrement?: Prisma.Decimal | number | string | null;
  reservePrice?: Prisma.Decimal | number | string | null;
  maxWinners?: number;
  notes?: string | null;
  status?: AuctionStatus;
}

interface UpdateAuctionInput {
  mode?: AuctionBidType;
  startAt?: Date;
  endAt?: Date;
  startingAmount?: Prisma.Decimal | number | string;
  earnestAmount?: Prisma.Decimal | number | string;
  currency?: string;
  minBidIncrement?: Prisma.Decimal | number | string | null;
  minBidDecrement?: Prisma.Decimal | number | string | null;
  reservePrice?: Prisma.Decimal | number | string | null;
  maxWinners?: number;
  notes?: string | null;
  status?: AuctionStatus;
}

interface PlaceBidInput {
  clientSequence?: number;
  metadata?: Prisma.JsonValue;
}

export type { CreateAuctionInput, UpdateAuctionInput };

export type EnrollmentInitiationResult = {
  enrollment: AuctionEnrollment;
  paymentIntent: PaymentIntent;
  razorpayOrder: RazorpayOrderSummary;
  razorpayKey: string;
};

type ConfirmEnrollmentPaymentInput = {
  paymentIntentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

type ConfirmEnrollmentPaymentResult = {
  paymentIntent: PaymentIntent;
  enrollment: AuctionEnrollment;
};

const toMinorUnits = (value: Prisma.Decimal | number | string): number => {
  const decimalValue =
    value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);
  return decimalValue.mul(100).toNumber();
};

const toDecimal = (
  value: Prisma.Decimal | number | string | null | undefined,
  field: string,
  allowNull = false
): Prisma.Decimal | null => {
  if (value === null || value === undefined) {
    if (allowNull) return null;
    throw new ApiError(400, `${field} is required`);
  }
  try {
    return value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);
  } catch {
    throw new ApiError(400, `${field} must be a valid decimal number`);
  }
};

const ensureTemporalOrder = (startAt: Date, endAt: Date) => {
  if (startAt >= endAt) {
    throw new ApiError(400, "Auction end time must be after start time");
  }
};

const ensureAuctionEditable = (auction: Auction) => {
  if (NON_EDITABLE_AUCTION_STATUSES.includes(auction.status)) {
    throw new ApiError(409, "Auction can no longer be modified");
  }
};

const NON_EDITABLE_AUCTION_STATUSES: AuctionStatus[] = [
  AuctionStatus.CLOSED,
  AuctionStatus.CANCELLED,
];

const ENROLLABLE_AUCTION_STATUSES: AuctionStatus[] = [
  AuctionStatus.LIVE,
  AuctionStatus.SCHEDULED,
];

const INACTIVE_ENROLLMENT_STATUSES: AuctionEnrollmentStatus[] = [
  AuctionEnrollmentStatus.CANCELLED,
  AuctionEnrollmentStatus.DISQUALIFIED,
  AuctionEnrollmentStatus.REFUNDED,
];

const leaderboardBidInclude = Prisma.validator<Prisma.AuctionBidInclude>()({
  user: { select: { id: true, name: true, email: true } },
});

type LeaderboardBid = Prisma.AuctionBidGetPayload<{
  include: typeof leaderboardBidInclude;
}>;

const getBidOrdering = (
  mode: AuctionBidType
): Prisma.AuctionBidOrderByWithRelationInput[] => {
  const amountOrder: Prisma.SortOrder =
    mode === AuctionBidType.FORWARD ? "desc" : "asc";
  return [{ amount: amountOrder }, { createdAt: "asc" }];
};

export const listAuctionsForAdmin = async () => {
  return prisma.auction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const createAuction = async (
  adminId: string,
  input: CreateAuctionInput
) => {
  ensureTemporalOrder(input.startAt, input.endAt);

  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: input.productId },
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const overlap = await prisma.auction.findFirst({
    where: {
      productId: input.productId,
      status: { in: [AuctionStatus.SCHEDULED, AuctionStatus.LIVE] },
      NOT: {
        OR: [
          { endAt: { lt: input.startAt } },
          { startAt: { gt: input.endAt } },
        ],
      },
    },
  });
  if (overlap) {
    throw new ApiError(
      409,
      "Product already has an active or scheduled auction"
    );
  }

  const startAmount = toDecimal(input.startingAmount, "startingAmount")!;
  const earnestAmount = toDecimal(input.earnestAmount, "earnestAmount")!;
  if (startAmount.lte(0) || earnestAmount.lte(0)) {
    throw new ApiError(400, "Amounts must be greater than zero");
  }

  const status =
    input.status ??
    (input.startAt <= new Date()
      ? AuctionStatus.LIVE
      : AuctionStatus.SCHEDULED);

  if (status === AuctionStatus.LIVE && input.startAt > new Date()) {
    throw new ApiError(400, "Live auctions must start immediately");
  }

  return prisma.auction.create({
    data: {
      productId: input.productId,
      mode: input.mode,
      status,
      startAt: input.startAt,
      endAt: input.endAt,
      startingAmount: startAmount,
      earnestAmount,
      currency: input.currency ?? "INR",
      minBidIncrement:
        toDecimal(input.minBidIncrement ?? null, "minBidIncrement", true) ??
        undefined,
      minBidDecrement:
        toDecimal(input.minBidDecrement ?? null, "minBidDecrement", true) ??
        undefined,
      reservePrice:
        toDecimal(input.reservePrice ?? null, "reservePrice", true) ??
        undefined,
      maxWinners: input.maxWinners ?? 3,
      notes: input.notes ?? undefined,
      createdById: adminId,
    },
    include: {
      product: true,
    },
  });
};

export const updateAuction = async (
  adminId: string,
  auctionId: string,
  input: UpdateAuctionInput
) => {
  const auction = await prisma.auction.findUnique({ where: { id: auctionId } });
  if (!auction) {
    throw new ApiError(404, "Auction not found");
  }
  ensureAuctionEditable(auction);

  const data: Prisma.AuctionUpdateInput = {};

  if (input.startAt || input.endAt) {
    ensureTemporalOrder(
      input.startAt ?? auction.startAt,
      input.endAt ?? auction.endAt
    );
    data.startAt = input.startAt ?? auction.startAt;
    data.endAt = input.endAt ?? auction.endAt;
  }

  if (input.mode && input.mode !== auction.mode) {
    data.mode = input.mode;
  }

  if (input.startingAmount !== undefined) {
    data.startingAmount = toDecimal(input.startingAmount, "startingAmount")!;
  }

  if (input.earnestAmount !== undefined) {
    data.earnestAmount = toDecimal(input.earnestAmount, "earnestAmount")!;
  }

  if (input.currency) {
    data.currency = input.currency;
  }

  if (input.minBidIncrement !== undefined) {
    data.minBidIncrement = toDecimal(
      input.minBidIncrement,
      "minBidIncrement",
      true
    );
  }

  if (input.minBidDecrement !== undefined) {
    data.minBidDecrement = toDecimal(
      input.minBidDecrement,
      "minBidDecrement",
      true
    );
  }

  if (input.reservePrice !== undefined) {
    data.reservePrice = toDecimal(input.reservePrice, "reservePrice", true);
  }

  if (input.maxWinners !== undefined) {
    if (input.maxWinners <= 0) {
      throw new ApiError(400, "maxWinners must be positive");
    }
    data.maxWinners = input.maxWinners;
  }

  if (input.notes !== undefined) {
    data.notes = input.notes;
  }

  if (input.status && input.status !== auction.status) {
    if (input.status === AuctionStatus.LIVE && auction.startAt > new Date()) {
      throw new ApiError(400, "Cannot force live status before start time");
    }
    data.status = input.status;
  }

  return prisma.auction.update({
    where: { id: auctionId },
    data,
    include: { product: true },
  });
};

export const getAuctionDetail = async (auctionId: string) => {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      product: true,
      result: true,
      leaderboard: true,
    },
  });
  if (!auction) {
    throw new ApiError(404, "Auction not found");
  }
  return auction;
};

export const listPublicAuctions = async () => {
  return prisma.auction.findMany({
    where: {
      status: { in: [AuctionStatus.LIVE, AuctionStatus.SCHEDULED] },
    },
    orderBy: [{ status: "asc" }, { startAt: "asc" }],
    include: {
      product: true,
      leaderboard: true,
    },
  });
};

export const createAuctionEnrollment = async (
  auctionId: string,
  userId: string
): Promise<EnrollmentInitiationResult> => {
  const publishableKey = getRazorpayPublishableKey();
  return prisma.$transaction(async (tx) => {
    const auction = await tx.auction.findUnique({ where: { id: auctionId } });
    if (!auction) {
      throw new ApiError(404, "Auction not found");
    }

    if (!ENROLLABLE_AUCTION_STATUSES.includes(auction.status)) {
      throw new ApiError(409, "Auction is not open for enrollment");
    }

    const existing = await tx.auctionEnrollment.findUnique({
      where: { auctionId_userId: { auctionId, userId } },
      include: { paymentIntent: true },
    });

    if (existing) {
      if (!INACTIVE_ENROLLMENT_STATUSES.includes(existing.status)) {
        const paymentIntent = existing.paymentIntent;
        if (!paymentIntent || !paymentIntent.providerOrderId) {
          throw new ApiError(409, "Existing enrollment missing payment intent");
        }
        const metadata =
          (paymentIntent.metadata as Prisma.JsonObject | null) ?? {};
        const orderSummary: RazorpayOrderSummary = {
          id: paymentIntent.providerOrderId,
          amount:
            (metadata.orderAmount as number | undefined) ??
            toMinorUnits(paymentIntent.amount),
          currency:
            (metadata.orderCurrency as string | undefined) ??
            paymentIntent.currency,
          receipt: (metadata.receipt as string | undefined) ?? existing.id,
          status: (metadata.orderStatus as string | undefined) ?? "created",
          notes: (metadata.notes as Record<string, string> | undefined) ?? null,
        };
        return {
          enrollment: existing,
          paymentIntent,
          razorpayOrder: orderSummary,
          razorpayKey: publishableKey,
        };
      }
    }

    const paymentIntent = await tx.paymentIntent.create({
      data: {
        provider: PaymentProvider.RAZORPAY,
        status: PaymentIntentStatus.CREATED,
        currency: auction.currency,
        amount: auction.earnestAmount,
        metadata: {
          auctionId,
          userId,
          type: "EARNEST_PAYMENT",
        },
      },
    });

    const enrollment = existing
      ? await tx.auctionEnrollment.update({
          where: { id: existing.id },
          data: {
            status: AuctionEnrollmentStatus.PENDING_PAYMENT,
            earnestAmount: auction.earnestAmount,
            currency: auction.currency,
            paymentIntentId: paymentIntent.id,
          },
        })
      : await tx.auctionEnrollment.create({
          data: {
            auctionId,
            userId,
            status: AuctionEnrollmentStatus.PENDING_PAYMENT,
            earnestAmount: auction.earnestAmount,
            currency: auction.currency,
            paymentIntentId: paymentIntent.id,
          },
        });

    const order = await createRazorpayOrder({
      amountInPaise: toMinorUnits(auction.earnestAmount),
      currency: auction.currency,
      receipt: enrollment.id,
      notes: {
        auctionId,
        userId,
        paymentIntentId: paymentIntent.id,
      },
    });

    const currentMetadata =
      (paymentIntent.metadata as Prisma.JsonObject | null) ?? {};
    const updatedIntent = await tx.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        providerOrderId: order.id,
        status: PaymentIntentStatus.PENDING,
        metadata: {
          ...currentMetadata,
          orderId: order.id,
          orderStatus: order.status,
          orderAmount: order.amount,
          orderCurrency: order.currency,
          receipt: order.receipt ?? enrollment.id,
          notes: order.notes ?? null,
        },
      },
    });

    return {
      enrollment,
      paymentIntent: updatedIntent,
      razorpayOrder: order,
      razorpayKey: publishableKey,
    };
  });
};

export const markEnrollmentAsActive = async (paymentIntentId: string) => {
  return prisma.$transaction(async (tx) => {
    const intent = await tx.paymentIntent.findUnique({
      where: { id: paymentIntentId },
    });
    if (!intent) {
      throw new ApiError(404, "Payment intent not found");
    }

    if (intent.status !== PaymentIntentStatus.CAPTURED) {
      throw new ApiError(409, "Payment intent not captured");
    }

    const enrollment = await tx.auctionEnrollment.findFirst({
      where: { paymentIntentId },
    });
    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found for payment intent");
    }

    if (enrollment.status === AuctionEnrollmentStatus.ACTIVE) {
      return enrollment;
    }

    return tx.auctionEnrollment.update({
      where: { id: enrollment.id },
      data: { status: AuctionEnrollmentStatus.ACTIVE },
    });
  });
};

export const recordPaymentIntentStatus = async (
  id: string,
  status: PaymentIntentStatus,
  providerPaymentId?: string
) => {
  return prisma.paymentIntent.update({
    where: { id },
    data: {
      status,
      providerPaymentId: providerPaymentId ?? undefined,
    },
  });
};

export const confirmEnrollmentPayment = async (
  input: ConfirmEnrollmentPaymentInput
): Promise<ConfirmEnrollmentPaymentResult> => {
  const {
    paymentIntentId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = input;

  return prisma.$transaction(async (tx) => {
    const paymentIntent = await tx.paymentIntent.findUnique({
      where: { id: paymentIntentId },
    });
    if (!paymentIntent) {
      throw new ApiError(404, "Payment intent not found");
    }

    if (paymentIntent.providerOrderId !== razorpayOrderId) {
      throw new ApiError(400, "Order mismatch for payment intent");
    }

    const enrollment = await tx.auctionEnrollment.findFirst({
      where: { paymentIntentId },
    });
    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found for payment intent");
    }

    if (paymentIntent.status === PaymentIntentStatus.CAPTURED) {
      if (
        paymentIntent.providerPaymentId &&
        paymentIntent.providerPaymentId !== razorpayPaymentId
      ) {
        throw new ApiError(
          409,
          "Payment intent already captured with another payment id"
        );
      }
      return {
        paymentIntent,
        enrollment,
      };
    }

    const signatureValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    if (!signatureValid) {
      throw new ApiError(400, "Invalid Razorpay signature");
    }

    const currentMetadata =
      (paymentIntent.metadata as Prisma.JsonObject | null) ?? {};

    const updatedIntent = await tx.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        status: PaymentIntentStatus.CAPTURED,
        providerPaymentId: razorpayPaymentId,
        metadata: {
          ...currentMetadata,
          paymentId: razorpayPaymentId,
          capturedAt: new Date().toISOString(),
        },
      },
    });

    const updatedEnrollment = await tx.auctionEnrollment.update({
      where: { id: enrollment.id },
      data: { status: AuctionEnrollmentStatus.ACTIVE },
    });

    return {
      paymentIntent: updatedIntent,
      enrollment: updatedEnrollment,
    };
  });
};

const ensureActiveEnrollment = (
  enrollment: AuctionEnrollment | null
): AuctionEnrollment => {
  if (!enrollment) {
    throw new ApiError(403, "Enrollment required before bidding");
  }
  if (enrollment.status !== AuctionEnrollmentStatus.ACTIVE) {
    throw new ApiError(409, "Enrollment is not active");
  }
  return enrollment;
};

const serializeLeaderboard = (bids: LeaderboardBid[]) =>
  bids.map((bid) => ({
    bidId: bid.id,
    userId: bid.user.id,
    name: bid.user.name,
    email: bid.user.email,
    amount: bid.amount.toString(),
    sequence: bid.sequence,
    createdAt: bid.createdAt.toISOString(),
  }));

export const placeAuctionBid = async (
  auctionId: string,
  userId: string,
  bidAmount: Prisma.Decimal | number | string,
  options: PlaceBidInput = {}
): Promise<{ bid: AuctionBid; leaderboard: Prisma.JsonValue }> => {
  const amount = toDecimal(bidAmount, "bidAmount")!;

  const result = await prisma.$transaction(async (tx) => {
    const auction = await tx.auction.findUnique({ where: { id: auctionId } });
    if (!auction) {
      throw new ApiError(404, "Auction not found");
    }

    if (auction.status !== AuctionStatus.LIVE) {
      throw new ApiError(409, "Auction is not accepting bids");
    }

    if (auction.startAt > new Date() || auction.endAt <= new Date()) {
      throw new ApiError(409, "Auction is not within the live window");
    }

    const enrollmentRecord = await tx.auctionEnrollment.findUnique({
      where: { auctionId_userId: { auctionId, userId } },
    });
    const enrollment = ensureActiveEnrollment(enrollmentRecord);

    const bestBid = await tx.auctionBid.findFirst({
      where: { auctionId },
      orderBy: getBidOrdering(auction.mode),
    });

    const reference = bestBid ? bestBid.amount : auction.startingAmount;

    if (auction.mode === AuctionBidType.FORWARD) {
      const minIncrement = auction.minBidIncrement ?? new Prisma.Decimal(1);
      const minRequired = reference.add(minIncrement);
      if (!amount.gte(minRequired)) {
        throw new ApiError(
          400,
          `Bid must be at least ${minRequired.toString()} (current: ${reference.toString()} + increment: ${minIncrement.toString()})`
        );
      }
    } else {
      const minDecrement = auction.minBidDecrement ?? new Prisma.Decimal(1);
      const maxAllowed = reference.sub(minDecrement);
      if (!amount.lte(maxAllowed)) {
        throw new ApiError(
          400,
          `Bid must be ${maxAllowed.toString()} or lower (current: ${reference.toString()} - decrement: ${minDecrement.toString()})`
        );
      }
      if (amount.lte(0)) {
        throw new ApiError(400, "Reverse bids must remain above zero");
      }
    }

    const currentMaxSequence = await tx.auctionBid.aggregate({
      where: { auctionId },
      _max: { sequence: true },
    });
    const nextSequence = (currentMaxSequence._max.sequence ?? 0) + 1;

    const bid = await tx.auctionBid.create({
      data: {
        auctionId,
        userId,
        enrollmentId: enrollment.id,
        amount,
        sequence: nextSequence,
        clientSequence: options.clientSequence,
        metadata: options.metadata ?? Prisma.JsonNull,
      },
    });

    const topBids = await tx.auctionBid.findMany({
      where: { auctionId },
      orderBy: getBidOrdering(auction.mode),
      take: 5,
      include: leaderboardBidInclude,
    });

    const snapshot = {
      updatedAt: new Date().toISOString(),
      mode: auction.mode,
      bidders: serializeLeaderboard(topBids),
      currentAmount: (topBids[0]?.amount ?? auction.startingAmount).toString(),
    } as Prisma.JsonObject;

    await tx.auctionLeaderboard.upsert({
      where: { auctionId },
      update: { snapshot },
      create: { auctionId, snapshot },
    });

    return { bid, leaderboard: snapshot };
  });

  publishBidPlaced(auctionId, result.bid, result.leaderboard);

  return result;
};

type FinalizeTxOutcome = {
  result: AuctionResult;
  snapshot: Prisma.JsonObject | null;
  wasAlreadyClosed: boolean;
};

export const finalizeAuction = async (auctionId: string) => {
  const txOutcome = await prisma.$transaction<FinalizeTxOutcome | null>(
    async (tx) => {
      const auction = await tx.auction.findUnique({ where: { id: auctionId } });
      if (!auction) {
        throw new ApiError(404, "Auction not found");
      }

      if (auction.status === AuctionStatus.CLOSED) {
        const existingResult = await tx.auctionResult.findUnique({
          where: { auctionId },
        });
        if (!existingResult) {
          return null;
        }
        return {
          result: existingResult,
          snapshot: null,
          wasAlreadyClosed: true,
        } as FinalizeTxOutcome;
      }

      const topBids = await tx.auctionBid.findMany({
        where: { auctionId },
        orderBy: getBidOrdering(auction.mode),
        take: auction.maxWinners + 2,
        include: leaderboardBidInclude,
      });

      const winners = topBids
        .slice(0, auction.maxWinners)
        .map((bid, index) => ({
          rank: index + 1,
          bidId: bid.id,
          userId: bid.userId,
          amount: bid.amount.toString(),
          sequence: bid.sequence,
          user: bid.user,
        }));

      const snapshot = {
        updatedAt: new Date().toISOString(),
        mode: auction.mode,
        bidders: serializeLeaderboard(topBids.slice(0, 5)),
        currentAmount: (
          topBids[0]?.amount ?? auction.startingAmount
        ).toString(),
      } as Prisma.JsonObject;

      await tx.auctionLeaderboard.upsert({
        where: { auctionId },
        update: { snapshot },
        create: { auctionId, snapshot },
      });

      const result = await tx.auctionResult.upsert({
        where: { auctionId },
        update: { winners, settledAt: new Date() },
        create: {
          auctionId,
          winners,
          settledAt: new Date(),
        },
      });

      await tx.auction.update({
        where: { id: auctionId },
        data: { status: AuctionStatus.CLOSED },
      });

      return {
        result,
        snapshot,
        wasAlreadyClosed: false,
      } as FinalizeTxOutcome;
    }
  );

  if (!txOutcome) {
    return null;
  }

  if (!txOutcome.wasAlreadyClosed) {
    publishAuctionFinalized(auctionId, txOutcome.result.winners);
    publishLeaderboardSnapshot(auctionId, txOutcome.snapshot ?? null);
  }

  return txOutcome.result;
};

export const listUserEnrollments = async (userId: string) => {
  return prisma.auctionEnrollment.findMany({
    where: { userId },
    include: {
      auction: {
        include: {
          product: true,
        },
      },
      paymentIntent: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const recordRefund = async (
  enrollmentId: string,
  amount: Prisma.Decimal | number | string,
  options: { providerRefundId?: string; reason?: string; currency?: string }
): Promise<PaymentRefund> => {
  const value = toDecimal(amount, "amount")!;
  const enrollment = await prisma.auctionEnrollment.findUnique({
    where: { id: enrollmentId },
    select: { paymentIntentId: true, currency: true },
  });
  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }
  if (!enrollment.paymentIntentId) {
    throw new ApiError(400, "Enrollment missing payment intent");
  }

  return prisma.paymentRefund.create({
    data: {
      enrollmentId,
      intentId: enrollment.paymentIntentId,
      amount: value,
      currency: options.currency ?? enrollment.currency ?? "INR",
      providerRefundId: options.providerRefundId,
      reason: options.reason,
    },
  });
};
