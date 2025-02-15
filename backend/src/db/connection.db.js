import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}${DB_NAME}`);
    console.log("🔆 Connected to MonogDB Server !!!");
  } catch (error) {
    console.error("⚠️  Error while connecting to MongoDB: \n", error);
    process.exit(1);
  }
};
