import { app } from "../app.js";
import { connectDB } from "../database/db.js";
import dotenv from "dotenv";

dotenv.config({ path: "../config/config.env" });

export default async function handler(req, res) {
  try {
    await connectDB(); // ✅ Connect only once (internally handles isConnected flag)
    return app(req, res); // ✅ Delegate request to Express app
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    return res.status(500).json({ message: "Database connection failed" });
  }
}
