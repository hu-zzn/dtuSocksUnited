import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/AuthRouter.js";
import socRouter from "./routes/socRouter.js";
import cartRouter from "./routes/cartRouter.js";

export const app = express();

// ✅ Load environment variables
config({ path: "./config/config.env" });

// ✅ Define allowed origins from .env or use default
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(origin =>
      origin.trim().replace(/\/$/, "")
    )
  : ["http://localhost:3000", "https://unifydtu.vercel.app"];

console.log("✅ Allowed Origins:", allowedOrigins);

// ✅ Use CORS middleware only
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Built-in middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health Check
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend is running 🎉" });
});

// ✅ API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/soc", socRouter);
app.use("/api/v1/cart", cartRouter);

// ✅ Test MongoDB Connection Route
app.get("/test-db", async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      throw new Error("Mongoose is not connected");
    }

    const dbStatus = await mongoose.connection.db.admin().ping();
    res.send("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.log("🧪 Loaded MONGODB_URI:", process.env.MONGODB_URI);
    console.error("❌ MongoDB ping failed:", err.message);
    res.status(500).send("❌ MongoDB Connection Failed");
  }
});

// ✅ Connect Database
connectDB();

// ✅ Error Middleware
app.use(errorMiddleware);
