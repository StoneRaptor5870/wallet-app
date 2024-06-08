/*
  Warnings:

  - A unique constraint covering the columns `[merchantId]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,merchantId]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,merchantId]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fromUserId,fromMerchantId,toUserId,toMerchantId]` on the table `P2PTransfer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `merchantId` to the `Balance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromMerchantId` to the `P2PTransfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toMerchantId` to the `P2PTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "merchantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OnRampTransaction" ADD COLUMN     "merchantId" INTEGER;

-- AlterTable
ALTER TABLE "P2PTransfer" ADD COLUMN     "fromMerchantId" INTEGER NOT NULL,
ADD COLUMN     "toMerchantId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Balance_merchantId_key" ON "Balance"("merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_merchantId_key" ON "Balance"("userId", "merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_userId_merchantId_key" ON "OnRampTransaction"("userId", "merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "P2PTransfer_fromUserId_fromMerchantId_toUserId_toMerchantId_key" ON "P2PTransfer"("fromUserId", "fromMerchantId", "toUserId", "toMerchantId");

-- AddForeignKey
ALTER TABLE "P2PTransfer" ADD CONSTRAINT "P2PTransfer_fromMerchantId_fkey" FOREIGN KEY ("fromMerchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2PTransfer" ADD CONSTRAINT "P2PTransfer_toMerchantId_fkey" FOREIGN KEY ("toMerchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnRampTransaction" ADD CONSTRAINT "OnRampTransaction_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
