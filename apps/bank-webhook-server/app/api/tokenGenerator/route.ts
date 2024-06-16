import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const GET = async (req: NextRequest) => {
  try {
    // Parse the URL to get the query parameters
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const nonce = params.get('nonce');

    console.log('Received nonce:', nonce);

    const transactionId = uuidv4();
    const payload = { transactionId };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });

    const response = NextResponse.json({ token });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ message: 'Error generating token' }, { status: 500 });
  }
}