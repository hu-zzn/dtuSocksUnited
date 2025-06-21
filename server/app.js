// app.js
import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/AuthRouter.js";
import socRouter from "./routes/socRouter.js";
import cartRouter from "./routes/cartRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";

// ✅ Load environment variables
config({ path: "./config/config.env" });

export const app = express();

// ✅ Allowed CORS origins
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(origin => origin.trim().replace(/\/$/, ""))
  : ["http://localhost:3000"];

console.log("✅ Allowed Origins:", allowedOrigins);

// ✅ CORS Middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Preflight handling

// ✅ Core Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend is running 🎉" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/soc", socRouter);
app.use("/api/v1/cart", cartRouter);

// ✅ DB Check Route
app.get("/test-db", async (req, res) => {
  try {
    if (!mongoose.connection.readyState) throw new Error("Mongoose is not connected");
    const dbStatus = await mongoose.connection.db.admin().ping();
    res.send("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB ping failed:", err.message);
    res.status(500).send("❌ MongoDB Connection Failed");
  }
});

// ✅ Error Handler
app.use(errorMiddleware);
