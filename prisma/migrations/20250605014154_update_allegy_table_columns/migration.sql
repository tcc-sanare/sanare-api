/*
  Warnings:

  - You are about to drop the column `description` on the `allergies` table. All the data in the column will be lost.
  - You are about to drop the column `iconKey` on the `allergies` table. All the data in the column will be lost.
  - You are about to drop the column `iconKey` on the `chronic_diseases` table. All the data in the column will be lost.
  - Added the required column `type` to the `allergies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AllergyType" AS ENUM ('antibiotic', 'anti-inflammatory', 'analgesic', 'anticonvulsant');

-- AlterTable
ALTER TABLE "allergies" DROP COLUMN "description",
DROP COLUMN "iconKey",
ADD COLUMN     "type" "AllergyType" NOT NULL;

-- AlterTable
ALTER TABLE "chronic_diseases" DROP COLUMN "iconKey";

-- AlterTable
ALTER TABLE "medical_record_to_allergies" ADD COLUMN     "description" TEXT;
