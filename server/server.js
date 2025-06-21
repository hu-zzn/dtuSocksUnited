// server.js
import { app } from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });
