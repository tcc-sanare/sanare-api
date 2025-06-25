-- CreateTable
CREATE TABLE "caregiver_requests" (
    "id" TEXT NOT NULL,
    "selfMonitorId" TEXT NOT NULL,
    "caregiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregiver_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "caregiver_requests" ADD CONSTRAINT "caregiver_requests_selfMonitorId_fkey" FOREIGN KEY ("selfMonitorId") REFERENCES "self_monitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_requests" ADD CONSTRAINT "caregiver_requests_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
