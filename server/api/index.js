import { app } from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../config/config.env" });

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      return res.status(500).json({ message: "Database connection failed" });
    }
  }

  return app(req, res); // ✅ This is the correct way
}
