-- CreateEnum
CREATE TYPE "VendorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "vendor_applications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "VendorApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "companyName" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "vendor_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendor_applications_userId_key" ON "vendor_applications"("userId");

-- CreateIndex
CREATE INDEX "vendor_applications_status_createdAt_idx" ON "vendor_applications"("status", "createdAt");

-- CreateIndex
CREATE INDEX "marketplace_products_createdById_idx" ON "marketplace_products"("createdById");

-- CreateIndex
CREATE INDEX "marketplace_products_categoryId_idx" ON "marketplace_products"("categoryId");

-- CreateIndex
CREATE INDEX "marketplace_products_status_submissionStatus_idx" ON "marketplace_products"("status", "submissionStatus");

-- CreateIndex
CREATE INDEX "quote_requests_userId_idx" ON "quote_requests"("userId");

-- AddForeignKey
ALTER TABLE "vendor_applications" ADD CONSTRAINT "vendor_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
