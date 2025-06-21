// server/api/index.js
import { app } from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../config/config.env" });

let isConnected = false;

const MONGO_URI = process.env.MONGO_URI;

const handler = async (req, res) => {
  if (!isConnected) {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected (Vercel)");
  }

  return app(req, res); // this lets Express handle the request
};

export default handler;
