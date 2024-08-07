"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import axios from "axios";

export async function createOnRampTransaction(
  provider: string,
  amount: number
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    console.error("Unauthenticated request");
    return {
      message: "Unauthenticated request",
    };
  }

  console.log("Generating token...");
  const response = await axios.get("https://wallet-app-bank-webhook-server.vercel.app/api/tokenGenerator");
  const token = response.data.token;

  console.log("Checking for existing transaction...");
  const existingTransaction = await prisma.onRampTransaction.findUnique({
    where: {
      token: token,
    },
  });

  if (existingTransaction) {
    console.log("Transaction already initiated");
    return {
      message: "Transaction already initiated",
    };
  }

  console.log("Finding or creating balance entry...");
  // Find or create balance entry for the user
  let balance = await prisma.balance.findFirst({
    where: {
      merchantId: session.user.id,
    },
  });

  if (!balance) {
    balance = await prisma.balance.create({
      data: {
        merchantId: session.user.id,
        amount: 0,
        locked: 0,
      },
    });
  }

  console.log("Sending token and transaction details to bank server...");
  const bankResponse = await axios.post("https://wallet-app-bank-webhook-server.vercel.app/api/merchantWebhook", {
    token,
    user_identifier: session.user.id.toString(), // Ensure user_identifier is a string
    amount: amount.toString(), // Ensure amount is a string
  });

  console.log("Bank response:", bankResponse.data);

  if (bankResponse.data.message === "Captured") {
    console.log("Creating transaction in database...");
    const transaction = await prisma.$transaction(async (tx) => {
      const onRampTransaction = await tx.onRampTransaction.create({
        data: {
          provider,
          status: "Success",
          startTime: new Date(),
          token: token,
          merchantId: session.user.id,
          amount: amount,
          balanceId: balance.id,
        },
      });

      await tx.balanceHistory.create({
        data: {
          amount: balance.amount + Number(amount),
          timestamp: new Date(),
          balanceId: balance.id,
          onRampTxnId: onRampTransaction.id,
        },
      });

      return onRampTransaction;
    });

    return {
      message: "Transaction Successful",
    };
  } else {
    console.error("Failed to initiate transaction");
    return {
      message: "Failed to initiate transaction",
    };
  }
}
