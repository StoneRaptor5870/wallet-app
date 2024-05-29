import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const GET = async () => {
  await prisma.merchant.create({
    data: {
      email: "verma2@example.com",
      name: "anuj",
      auth_type: "Google"
    },
  });
  return NextResponse.json({
    message: "hi there",
  });
};
