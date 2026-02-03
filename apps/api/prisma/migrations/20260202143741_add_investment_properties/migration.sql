-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'UPLOADING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "InvestmentQueryStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "podcasts" ADD COLUMN     "uploadError" TEXT,
ADD COLUMN     "uploadStatus" "UploadStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "videoUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "investment_properties" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "investment_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_queries" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT,
    "status" "InvestmentQueryStatus" NOT NULL DEFAULT 'PENDING',
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "investment_queries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "investment_queries_propertyId_idx" ON "investment_queries"("propertyId");

-- CreateIndex
CREATE INDEX "investment_queries_userId_idx" ON "investment_queries"("userId");

-- CreateIndex
CREATE INDEX "podcasts_uploadStatus_idx" ON "podcasts"("uploadStatus");

-- AddForeignKey
ALTER TABLE "investment_queries" ADD CONSTRAINT "investment_queries_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "investment_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_queries" ADD CONSTRAINT "investment_queries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
