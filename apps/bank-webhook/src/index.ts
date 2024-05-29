import express from "express";
import prisma from "@repo/db/client";
import { z } from "zod";
const app = express();

app.use(express.json());

const paymentInformationSchema = z.object({
  token: z.string(),
  userId: z.string(),
  amount: z.string(),
});

app.post("/hdfcWebhook", async (req, res) => {
  //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  const parsed = paymentInformationSchema.safeParse(paymentInformation);
  if (!parsed.success) {
    console.error(parsed.error);
    return null;
  }

  const { token, userId, amount } = parsed.data;

  try {
    await prisma.$transaction([
      prisma.balance.updateMany({
        where: {
          userId: Number(userId),
        },
        data: {
          amount: {
            increment: Number(amount),
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

    res.json({
      message: "Captured",
    });
  } catch (e) {
    console.error(e);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003);
