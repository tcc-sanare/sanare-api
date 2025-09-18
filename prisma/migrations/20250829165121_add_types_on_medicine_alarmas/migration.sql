/*
  Warnings:

  - Added the required column `type` to the `medicine_alarms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicine_alarms" ADD COLUMN     "type" TEXT NOT NULL;
