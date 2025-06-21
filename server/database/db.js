import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const { connection } = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Optional: Prevent app from running if DB fails
  }
};
