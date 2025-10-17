-- CreateEnum
CREATE TYPE "AuctionBidType" AS ENUM ('FORWARD', 'REVERSE');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'LIVE', 'PAUSED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuctionEnrollmentStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('RAZORPAY');

-- CreateEnum
CREATE TYPE "PaymentIntentStatus" AS ENUM ('CREATED', 'PENDING', 'CAPTURED', 'FAILED', 'REFUND_PENDING', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentRefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "auctions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "AuctionStatus" NOT NULL DEFAULT 'DRAFT',
    "mode" "AuctionBidType" NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "startingAmount" DECIMAL(12,2) NOT NULL,
    "earnestAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "minBidIncrement" DECIMAL(12,2),
    "minBidDecrement" DECIMAL(12,2),
    "reservePrice" DECIMAL(12,2),
    "maxWinners" INTEGER NOT NULL DEFAULT 3,
    "notes" TEXT,
    "productId" TEXT NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_enrollments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "AuctionEnrollmentStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "earnestAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "auctionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentIntentId" TEXT,

    CONSTRAINT "auction_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_bids" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "sequence" INTEGER NOT NULL,
    "clientSequence" INTEGER,
    "metadata" JSONB,
    "auctionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,

    CONSTRAINT "auction_bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_leaderboards" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "snapshot" JSONB NOT NULL,
    "auctionId" TEXT NOT NULL,

    CONSTRAINT "auction_leaderboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "winners" JSONB NOT NULL,
    "settledAt" TIMESTAMP(3),
    "auctionId" TEXT NOT NULL,

    CONSTRAINT "auction_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_intents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'CREATED',
    "currency" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "providerOrderId" TEXT,
    "providerPaymentId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "payment_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_refunds" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "PaymentRefundStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "reason" TEXT,
    "providerRefundId" TEXT,
    "intentId" TEXT NOT NULL,
    "enrollmentId" TEXT,

    CONSTRAINT "payment_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auctions_productId_idx" ON "auctions"("productId");

-- CreateIndex
CREATE INDEX "auctions_status_startAt_idx" ON "auctions"("status", "startAt");

-- CreateIndex
CREATE INDEX "auctions_status_endAt_idx" ON "auctions"("status", "endAt");

-- CreateIndex
CREATE UNIQUE INDEX "auction_enrollments_paymentIntentId_key" ON "auction_enrollments"("paymentIntentId");

-- CreateIndex
CREATE INDEX "auction_enrollments_paymentIntentId_idx" ON "auction_enrollments"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "auction_enrollments_auctionId_userId_key" ON "auction_enrollments"("auctionId", "userId");

-- CreateIndex
CREATE INDEX "auction_bids_auctionId_createdAt_idx" ON "auction_bids"("auctionId", "createdAt");

-- CreateIndex
CREATE INDEX "auction_bids_userId_auctionId_idx" ON "auction_bids"("userId", "auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "auction_bids_auctionId_sequence_key" ON "auction_bids"("auctionId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "auction_leaderboards_auctionId_key" ON "auction_leaderboards"("auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "auction_results_auctionId_key" ON "auction_results"("auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_providerOrderId_key" ON "payment_intents"("providerOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_providerPaymentId_key" ON "payment_intents"("providerPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_refunds_providerRefundId_key" ON "payment_refunds"("providerRefundId");

-- CreateIndex
CREATE INDEX "payment_refunds_intentId_idx" ON "payment_refunds"("intentId");

-- CreateIndex
CREATE INDEX "payment_refunds_enrollmentId_idx" ON "payment_refunds"("enrollmentId");

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "marketplace_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_enrollments" ADD CONSTRAINT "auction_enrollments_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_enrollments" ADD CONSTRAINT "auction_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_enrollments" ADD CONSTRAINT "auction_enrollments_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "payment_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "auction_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_leaderboards" ADD CONSTRAINT "auction_leaderboards_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_results" ADD CONSTRAINT "auction_results_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "payment_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "auction_enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
