/*
  Warnings:

  - You are about to drop the column `userId` on the `ai_chats` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `medical_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `medical_record` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `medicine_alarms` table. All the data in the column will be lost.
  - You are about to drop the `post_likes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[selfMonitorId]` on the table `medical_record` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `selfMonitorId` to the `ai_chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selfMonitorId` to the `medical_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selfMonitorId` to the `medical_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selfMonitorId` to the `medical_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selfMonitorId` to the `medicine_alarms` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogInput" AS ENUM ('mood', 'symptoms', 'imc', 'hydration', 'bloodPressure', 'bloodSugar');

-- DropForeignKey
ALTER TABLE "ai_chats" DROP CONSTRAINT "ai_chats_userId_fkey";

-- DropForeignKey
ALTER TABLE "medical_logs" DROP CONSTRAINT "medical_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "medical_record" DROP CONSTRAINT "medical_record_userId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_userId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_alarms" DROP CONSTRAINT "medicine_alarms_userId_fkey";

-- DropForeignKey
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_postId_fkey";

-- DropForeignKey
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_userId_fkey";

-- DropIndex
DROP INDEX "medical_record_userId_key";

-- AlterTable
ALTER TABLE "ai_chats" DROP COLUMN "userId",
ADD COLUMN     "selfMonitorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medical_logs" DROP COLUMN "userId",
ADD COLUMN     "selfMonitorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medical_record" DROP COLUMN "userId",
ADD COLUMN     "selfMonitorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medical_reports" DROP COLUMN "userId",
ADD COLUMN     "selfMonitorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medicine_alarms" DROP COLUMN "userId",
ADD COLUMN     "selfMonitorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profilePhotoKey" TEXT;

-- DropTable
DROP TABLE "post_likes";

-- CreateTable
CREATE TABLE "caregivers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "self_monitors" (
    "id" TEXT NOT NULL,
    "caregiverId" TEXT,
    "userId" TEXT NOT NULL,
    "logInputs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "self_monitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_saves" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "post_saves_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateIndex
CREATE UNIQUE INDEX "caregivers_code_key" ON "caregivers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "caregivers_userId_key" ON "caregivers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "self_monitors_userId_key" ON "self_monitors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "medical_record_selfMonitorId_key" ON "medical_record"("selfMonitorId");

-- AddForeignKey
ALTER TABLE "caregivers" ADD CONSTRAINT "caregivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "self_monitors" ADD CONSTRAINT "self_monitors_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "caregivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "self_monitors" ADD CONSTRAINT "self_monitors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_saves" ADD CONSTRAINT "post_saves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_saves" ADD CONSTRAINT "post_saves_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_selfMonitorId_fkey" FOREIGN KEY ("selfMonitorId") REFERENCES "self_monitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_logs" ADD CONSTRAINT "medical_logs_selfMonitorId_fkey" FOREIGN KEY ("selfMonitorId") REFERENCES "self_monitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_selfMonitorId_fkey" FOREIGN KEY ("selfMonitorId") REFERENCES "self_monitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_alarms" ADD CONSTRAINT "medicine_alarms_selfMonitorId_fkey" FOREIGN KEY ("selfMonitorId") REFERENCES "self_monitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chats" ADD CONSTRAINT "ai_chats_selfMonitorId_fkey" FOREIGN KEY ("selfMonitorId") REFERENCES "self_monitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
