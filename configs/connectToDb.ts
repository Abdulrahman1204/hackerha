import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected To MongoDB ^_^");
  } catch (error) {
    console.error("Connection Failed To MongoDB! ): ", error);
    process.exit(1);
  }
};

export default connectDB;
