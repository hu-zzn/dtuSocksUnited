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

// ✅ CORS middleware (manual)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Built-in middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/soc", socRouter);
app.use("/api/v1/cart", cartRouter);

// ✅ Test MongoDB Connection Route
app.get("/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB ping failed:", err);
    res.status(500).send("❌ MongoDB Connection Failed");
  }
});

// ✅ Connect Database
connectDB();

// ✅ Error Middleware
app.use(errorMiddleware);
