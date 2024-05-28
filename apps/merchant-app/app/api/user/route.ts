import { NextResponse } from "next/server";
import { PrismaClient } from "@repo/db/client";

const client = new PrismaClient();

export const GET = async () => {
  await client.user.create({
    data: {
      email: "verma",
      name: "anuj",
    },
  });
  return NextResponse.json({
    message: "hi there",
  });
};
