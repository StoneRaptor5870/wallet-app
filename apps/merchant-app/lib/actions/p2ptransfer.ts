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

    await tx.p2PTransfer.create({
      data: {
        fromMerchantId: from,
        toMerchantId: toUser.id,
        timestamp: new Date(),
        amount: Number(amount),
      },
    });

    return { message: "Transaction completed" };
  });
};
