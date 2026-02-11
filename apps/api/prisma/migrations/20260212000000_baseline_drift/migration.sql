-- CreateEnum
CREATE TYPE "VendorPlanInterval" AS ENUM ('YEARLY');

-- CreateEnum
CREATE TYPE "VendorSubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PAYMENT_PENDING');

-- AlterTable
ALTER TABLE "marketplace_products" ADD COLUMN "faqs" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "product_reviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_plans" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "maxProducts" INTEGER NOT NULL,
    "priceUsd" DECIMAL(10,2) NOT NULL,
    "interval" "VendorPlanInterval" NOT NULL DEFAULT 'YEARLY',
    "isContactSales" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "features" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "vendor_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_subscriptions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "VendorSubscriptionStatus" NOT NULL DEFAULT 'PAYMENT_PENDING',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planNameSnapshot" TEXT NOT NULL,
    "maxProductsSnapshot" INTEGER NOT NULL,
    "priceUsdSnapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "vendor_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_payments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'CREATED',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "subscriptionId" TEXT NOT NULL,

    CONSTRAINT "subscription_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_reviews_productId_idx" ON "product_reviews"("productId");

-- CreateIndex
CREATE INDEX "product_reviews_userId_idx" ON "product_reviews"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "product_reviews_userId_productId_key" ON "product_reviews"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_plans_name_key" ON "vendor_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_plans_slug_key" ON "vendor_plans"("slug");

-- CreateIndex
CREATE INDEX "vendor_plans_isActive_sortOrder_idx" ON "vendor_plans"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "vendor_subscriptions_userId_status_idx" ON "vendor_subscriptions"("userId", "status");

-- CreateIndex
CREATE INDEX "vendor_subscriptions_status_endDate_idx" ON "vendor_subscriptions"("status", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_payments_razorpayOrderId_key" ON "subscription_payments"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_payments_razorpayPaymentId_key" ON "subscription_payments"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "subscription_payments_subscriptionId_idx" ON "subscription_payments"("subscriptionId");

-- CreateIndex
CREATE INDEX "subscription_payments_razorpayOrderId_idx" ON "subscription_payments"("razorpayOrderId");

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "marketplace_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_subscriptions" ADD CONSTRAINT "vendor_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_subscriptions" ADD CONSTRAINT "vendor_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "vendor_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "vendor_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
