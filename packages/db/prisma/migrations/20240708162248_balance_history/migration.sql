-- CreateTable
CREATE TABLE "BalanceHistory" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "balanceId" INTEGER NOT NULL,
    "p2pTransferId" INTEGER,
    "onRampTxnId" INTEGER,

    CONSTRAINT "BalanceHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BalanceHistory" ADD CONSTRAINT "BalanceHistory_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "Balance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceHistory" ADD CONSTRAINT "BalanceHistory_p2pTransferId_fkey" FOREIGN KEY ("p2pTransferId") REFERENCES "P2PTransfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceHistory" ADD CONSTRAINT "BalanceHistory_onRampTxnId_fkey" FOREIGN KEY ("onRampTxnId") REFERENCES "OnRampTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
