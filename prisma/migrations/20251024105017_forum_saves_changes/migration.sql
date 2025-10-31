/*
  Warnings:

  - You are about to drop the `post_saves` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_saves" DROP CONSTRAINT "post_saves_postId_fkey";

-- DropForeignKey
ALTER TABLE "post_saves" DROP CONSTRAINT "post_saves_userId_fkey";

-- DropTable
DROP TABLE "post_saves";

-- CreateTable
CREATE TABLE "forum_saves" (
    "userId" TEXT NOT NULL,
    "forumId" TEXT NOT NULL,

    CONSTRAINT "forum_saves_pkey" PRIMARY KEY ("userId","forumId")
);

-- AddForeignKey
ALTER TABLE "forum_saves" ADD CONSTRAINT "forum_saves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_saves" ADD CONSTRAINT "forum_saves_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "forums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
