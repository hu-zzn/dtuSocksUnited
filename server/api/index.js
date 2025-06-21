// api/index.js
import { app } from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config({ path: "../config/config.env" });

let isConnected = false;

// Vercel-compatible handler
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

  // Convert Express to handle Vercel's req/res
  return createServer(app).emit("request", req, res);
}
