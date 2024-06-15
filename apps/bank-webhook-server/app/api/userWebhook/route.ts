import { NextResponse, NextRequest } from "next/server";
import { config } from 'dotenv';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '@repo/db/client';

config();

const paymentInformationSchema = z.object({
  token: z.string(),
  userId: z.string(),
  amount: z.string(),
});

interface BodyType {
  token: string;
  userId: string;
  amount: string;
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  //const body = JSON.parse(bodyString); // Parse the string as JSON

  console.log('Received webhook call:', body);

  const { token, user_identifier, amount } = body;

  if (typeof user_identifier === 'undefined') {
    return NextResponse.json({ message: 'user_identifier is required' }, {status: 400});
  }

  const paymentInformation = {
    token: token || '',
    userId: user_identifier? user_identifier.toString() : '',
    amount: amount? amount.toString() : '',
  };

  console.log('Parsed payment information:', paymentInformation);

  const parsed = paymentInformationSchema.safeParse(paymentInformation);
  if (!parsed.success) {
    console.error('Validation error:', parsed.error);
    return NextResponse.json({ message: 'Invalid data', errors: parsed.error.errors }, {status: 400});
  }

  const { userId, amount: parsedAmount } = parsed.data;

  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET || '');
    console.log('Decoded token:', decodedToken);

    const existingTransaction = await prisma.onRampTransaction.findUnique({
      where: { token },
    });

    if (existingTransaction && existingTransaction.status!== 'Processing') {
      console.log('Transaction already processed or completed:', existingTransaction);
      return NextResponse.json({ message: 'Transaction already processed or completed' }, {status: 409});
    }

    console.log('Updating database with new transaction data...');
    const transaction = await prisma.$transaction([
      prisma.balance.updateMany({
        where: { userId },
        data: { amount: { increment: Number(parsedAmount) }, locked: 0 },
      }),
      prisma.onRampTransaction.updateMany({
        where: { token },
        data: { status: 'Success' },
      }),
    ]);

    console.log('Database update successful:', transaction);
    return NextResponse.json({ message: 'Captured' }); // Ensure this return statement is inside the try block
  } catch (e) {
    console.error('Error while processing webhook:', e);
    return NextResponse.json({ message: 'Error while processing webhook' }, {status: 500});
  }
}
