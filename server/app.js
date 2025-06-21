import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/AuthRouter.js";
import socRouter from "./routes/socRouter.js";
import cartRouter from "./routes/cartRouter.js";

export const app = express();

config({ path: "./config/config.env" });

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(origin => origin.trim().replace(/\/$/, ""))
  : ["http://localhost:3000", "https://unifydtu.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/soc", socRouter);
app.use("/api/v1/cart", cartRouter);

connectDB();

app.use(errorMiddleware);