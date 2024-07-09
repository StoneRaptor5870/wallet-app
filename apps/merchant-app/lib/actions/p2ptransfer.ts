"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export const p2ptransfer = async (to: string, amount: number) => {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session?.user?.id)
    return { message: "Unauthenticated request" };

  const from = session?.user?.id;

  const toUser = await prisma.merchant.findFirst({
    where: {
      email: to,
    },
  });
  if (!toUser) return { message: "User not found" };

  await prisma.$transaction(async (tx: any) => {
    await tx.$queryRaw`SELECT*FROM "Balance" WHERE "userId"  = ${from} FOR UPDATE`; //locks the Balance table
    const fromBalance = await tx.balance.findFirst({
      where: {
        merchantId: from,
      },
    });
    const toBalance = await tx.balance.findFirst({
      where: {
        merchantId: toUser.id,
      },
    });

    if (!fromBalance || fromBalance?.amount < amount) {
      return { message: "Insufficient funds" };
    }
    await tx.balance.update({
      where: {
        merchantId: from,
      },
      data: {
        amount: {
          decrement: Number(amount),
        },
      },
    });
    await tx.balance.update({
      where: {
        merchantId: toUser.id,
      },
      data: {
        amount: {
          increment: Number(amount),
        },
      },
    });

    const transfer = await tx.p2PTransfer.create({
      data: {
        fromMerchantId: from,
        toMerchantId: toUser.id,
        timestamp: new Date(),
        amount: Number(amount),
        toBalanceId: toBalance.id,
      },
    });

    await tx.balanceHistory.create({
      data: {
        amount: fromBalance.amount - Number(amount),
        timestamp: new Date(),
        balanceId: fromBalance.id,
        p2pTransferId: transfer.id,
      },
    });

    await tx.balanceHistory.create({
      data: {
        amount: toBalance.amount + Number(amount),
        timestamp: new Date(),
        balanceId: toBalance.id,
        p2pTransferId: transfer.id,
      },
    });

    return { message: "Transaction completed" };
  });
};
