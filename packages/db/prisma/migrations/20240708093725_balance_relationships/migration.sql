-- AlterTable
ALTER TABLE "OnRampTransaction" ADD COLUMN     "balanceId" INTEGER;

-- AlterTable
ALTER TABLE "P2PTransfer" ADD COLUMN     "fromBalanceId" INTEGER,
ADD COLUMN     "toBalanceId" INTEGER;

-- AddForeignKey
ALTER TABLE "P2PTransfer" ADD CONSTRAINT "P2PTransfer_fromBalanceId_fkey" FOREIGN KEY ("fromBalanceId") REFERENCES "Balance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2PTransfer" ADD CONSTRAINT "P2PTransfer_toBalanceId_fkey" FOREIGN KEY ("toBalanceId") REFERENCES "Balance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnRampTransaction" ADD CONSTRAINT "OnRampTransaction_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "Balance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
