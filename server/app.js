// server/app.js
import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { supabase } from "./database/supabaseClient.js";
import authRouter from "./routes/AuthRouter.js";
import socRouter from "./routes/socRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orientationRouter from "./routes/orientationRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";

// ✅ Load environment variables
config({ path: "./config/config.env" });

export const app = express();

// ✅ Allowed CORS origins
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) =>
      origin.trim().replace(/\/$/, "")
    )
  : ["http://localhost:4000"];

console.log("✅ Backend starting. Allowed CORS Origins:", allowedOrigins); // Improved log

// ✅ CORS Middleware - IMPORTANT: This must be before other middlewares and routes
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., Postman, mobile apps, internal proxies)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(
          `❌ CORS Blocked Request from Origin: ${origin}. Allowed: ${allowedOrigins.join(
            ", "
          )}`
        );
        callback(new Error("Not allowed by CORS"));
      }
    },
    // origin: "*",
    credentials: true, // Allow cookies (your httpOnly JWT token) to be sent cross-origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow common methods
    allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow common headers
    optionsSuccessStatus: 200, // For pre-flight requests
  })
);

// ✅ Core Middlewares
app.use(cookieParser());
app.use(express.json()); // This parses JSON requests
app.use(express.urlencoded({ extended: true })); // This parses URL-encoded requests

// --- TEMPORARY DEBUGGING LOG MIDDLEWARE ---
// This will log req.body *after* express.json() and express.urlencoded() have run.
// This log should be REMOVED once the issue is diagnosed.
app.use((req, res, next) => {
  // Only log POST requests to the Google login endpoint to keep logs clean
  if (
    req.method === "POST" &&
    req.originalUrl.includes("/api/v1/auth/google/login")
  ) {
    console.log("--- DEBUG LOG from app.js ---");
    console.log("Request URL:", req.originalUrl);
    console.log("Request Method:", req.method);
    console.log("Request Headers (Content-Type):", req.headers["content-type"]);
    console.log("Parsed req.body:", req.body);
    console.log("--- END DEBUG LOG ---");
  }
  next(); // IMPORTANT: Always call next() to pass control to the next middleware/route
});
// --- END TEMPORARY DEBUGGING LOG MIDDLEWARE ---

// ✅ Routes
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend is running 🎉" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/soc", socRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orientation", orientationRouter);

// ✅ DB Check Route (useful for debugging deployment)
app.get("/test-db", async (req, res) => {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error && error.code !== "PGRST116" && !error.message.includes("does not exist")) {
      throw error;
    }
    res.send("✅ Supabase Connected Successfully!");
  } catch (err) {
    console.error("❌ Supabase connection check failed:", err.message);
    res.status(500).send("❌ Supabase Connection Failed");
  }
});

// ✅ 404 Handler (should be placed before the main error middleware)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Error Handler (must be the last middleware)
app.use(errorMiddleware);
