-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "P2PTransfer" DROP CONSTRAINT "P2PTransfer_fromMerchantId_fkey";

-- DropForeignKey
ALTER TABLE "P2PTransfer" DROP CONSTRAINT "P2PTransfer_toMerchantId_fkey";

-- AlterTable
ALTER TABLE "Balance" ALTER COLUMN "merchantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "P2PTransfer" ALTER COLUMN "fromMerchantId" DROP NOT NULL,
ALTER COLUMN "toMerchantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "P2PTransfer" ADD CONSTRAINT "P2PTransfer_fromMerchantId_fkey" FOREIGN KEY ("fromMerchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2PTransfer" ADD CONSTRAINT "P2PTransfer_toMerchantId_fkey" FOREIGN KEY ("toMerchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
