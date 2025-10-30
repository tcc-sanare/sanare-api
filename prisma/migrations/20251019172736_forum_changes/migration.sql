/*
  Warnings:

  - You are about to drop the column `name` on the `forums` table. All the data in the column will be lost.
  - Added the required column `body` to the `forums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `forums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forums" DROP COLUMN "name",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "link" TEXT NOT NULL;
