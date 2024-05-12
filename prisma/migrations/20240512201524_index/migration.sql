/*
  Warnings:

  - You are about to drop the column `content` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "content";

-- CreateIndex
CREATE INDEX "products_productId_idx" ON "products" USING HASH ("productId");
