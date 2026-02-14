-- CreateTable
CREATE TABLE "contact_inquiries" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isHandled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "contact_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_inquiries_createdAt_idx" ON "contact_inquiries"("createdAt");

-- CreateIndex
CREATE INDEX "contact_inquiries_isHandled_idx" ON "contact_inquiries"("isHandled");
