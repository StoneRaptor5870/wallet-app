import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import prisma from "@repo/db/client";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
const app = express();

app.use(express.json());

const paymentInformationSchema = z.object({
  token: z.string(),
  userId: z.string(),
  amount: z.string(),
});

app.get("/tokenGenerator", async (req, res) => {
  try {
    const transactionId = uuidv4();

    const payload = {
      transactionId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ message: "Error generating token" });
  }
});

app.post("/bankWebhook", async (req, res) => {
  console.log("Received webhook call:", req.body);

  const { token, user_identifier, amount } = req.body;

  if (typeof user_identifier === "undefined") {
    return res.status(400).json({ message: "user_identifier is required" });
  }

  const paymentInformation = {
    token: token || "",
    userId: user_identifier ? user_identifier.toString() : "",
    amount: amount ? amount.toString() : "",
  };

  console.log("Parsed payment information:", paymentInformation);

  const parsed = paymentInformationSchema.safeParse(paymentInformation);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error);
    return res
      .status(400)
      .json({ message: "Invalid data", errors: parsed.error.errors });
  }

  const { userId, amount: parsedAmount } = parsed.data;

  try {
    jwt.verify(token, process.env.JWT_SECRET || "", async (err: any) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({ message: "Unauthorized" });
      }

      const existingTransaction = await prisma.onRampTransaction.findUnique({
        where: {
          token: token,
        },
      });

      if (existingTransaction && existingTransaction.status !== "Processing") {
        console.log(
          "Transaction already processed or completed:",
          existingTransaction
        );
        return res
          .status(409)
          .json({ message: "Transaction already processed or completed" });
      }

      console.log("Updating database with new transaction data...");
      const transaction = await prisma.$transaction([
        prisma.balance.updateMany({
          where: {
            userId: userId,
          },
          data: {
            amount: {
              increment: Number(parsedAmount),
            },
          },
        }),
        prisma.onRampTransaction.updateMany({
          where: {
            token: token,
          },
          data: {
            status: "Success",
          },
        }),
      ]);

      console.log("Database update successful:", transaction);

      res.json({
        message: "Captured",
      });
    });
  } catch (e) {
    console.error("Error while processing webhook:", e);
    res.status(500).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3002);
