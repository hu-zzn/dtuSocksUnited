import { app } from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../config/config.env" });

let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  }

  return app(req, res); // let Express handle the request
};

export default handler;
