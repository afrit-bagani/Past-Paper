import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}`);
    console.log("🔆 Connected to MonogDB Server !!!");
  } catch (error) {
    console.error("⚠️  Error while connecting to MongoDB: \n", error);
    process.exit(1);
  }
};
