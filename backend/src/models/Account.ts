import mongoose from "mongoose";
import { number } from "zod";

interface userAccountSchema {
  userId: mongoose.Types.ObjectId;
  balance: number;
}

const AccountSchema = new mongoose.Schema<userAccountSchema>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 10000,
    },
  },
  { timestamps: true }
);

export const Account = mongoose.model("Account", AccountSchema);