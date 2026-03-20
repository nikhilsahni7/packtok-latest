-- CreateEnum
CREATE TYPE "EmailSubscriptionType" AS ENUM ('PODCAST', 'NEWSLETTER');

-- CreateTable
CREATE TABLE "email_subscriptions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "type" "EmailSubscriptionType" NOT NULL,

    CONSTRAINT "email_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_subscriptions_type_createdAt_idx" ON "email_subscriptions"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "email_subscriptions_email_type_key" ON "email_subscriptions"("email", "type");
