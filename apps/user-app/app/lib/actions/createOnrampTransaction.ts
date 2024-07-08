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
      userId: session.user.id,
    },
  });

  if (!balance) {
    balance = await prisma.balance.create({
      data: {
        userId: session.user.id,
        amount: 0,
        locked: 0,
      },
    });
  }

  console.log("Sending token and transaction details to bank server...");
  const bankResponse = await axios.post("https://wallet-app-bank-webhook-server.vercel.app/api/userWebhook", {
    token,
    user_identifier: session.user.id.toString(), // Ensure user_identifier is a string
    amount: amount.toString(),
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log("Bank response:", bankResponse.data);

  if (bankResponse.data.message === "Captured") {
    console.log("Creating transaction in database...");
    await prisma.onRampTransaction.create({
      data: {
        provider,
        status: "Success",
        startTime: new Date(),
        token: token,
        userId: session.user.id,
        amount: amount,
        balanceId: balance.id
      },
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
