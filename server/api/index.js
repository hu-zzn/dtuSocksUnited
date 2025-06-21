// /api/index.js
import { app } from "../app.js";
import { connectDB } from "../database/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../config/config.env" });

export default async function handler(req, res) {
  try {
    await connectDB(); // Ensures MongoDB is connected once
    return app(req, res); // Delegate request to Express app
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    return res.status(500).json({ message: "Database connection failed" });
  }
}
