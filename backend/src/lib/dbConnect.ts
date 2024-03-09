import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGOKEY as string, {
      dbName: "wallet",
    });
    console.log("Connected to DB!");
  } catch (error) {
    console.error(error);
  }
};