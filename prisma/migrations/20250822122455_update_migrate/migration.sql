/*
  Warnings:

  - The `mood` column on the `medical_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MoodType" AS ENUM ('calm', 'happy', 'energized', 'angry', 'low-energy', 'disoriented', 'discouraged', 'anxious', 'mood-changes');

-- AlterTable
ALTER TABLE "medical_logs" DROP COLUMN "mood",
ADD COLUMN     "mood" "MoodType";
