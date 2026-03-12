-- Add MACHINERY_INSTALLER to ServiceType enum
ALTER TYPE "ServiceType" ADD VALUE IF NOT EXISTS 'MACHINERY_INSTALLER';

-- Create machinery installer requests table
CREATE TABLE "machinery_installer_requests" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "installationTypeRequired" TEXT NOT NULL,
    "expectedTimeline" TEXT NOT NULL,
    "specificInstructions" TEXT,
    "machineImageUrls" TEXT[],
    "machineVideoUrls" TEXT[],
    "machineTypeModel" TEXT NOT NULL,
    "capacitySpecifications" TEXT NOT NULL,
    "fromLocation" TEXT NOT NULL,
    "preferredInstallationDateTime" TIMESTAMP(3),
    "whereLocation" TEXT NOT NULL,
    "additionalDescription" TEXT,
    "teamMembersRequired" INTEGER NOT NULL,
    "skillsExpertiseNeeded" TEXT NOT NULL,
    "onSiteSupportProvidedByClient" TEXT,
    "serviceRequestId" TEXT NOT NULL,

    CONSTRAINT "machinery_installer_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "machinery_installer_requests_serviceRequestId_key"
ON "machinery_installer_requests"("serviceRequestId");

ALTER TABLE "machinery_installer_requests"
ADD CONSTRAINT "machinery_installer_requests_serviceRequestId_fkey"
FOREIGN KEY ("serviceRequestId") REFERENCES "service_requests"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
