// server.js
import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";

dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
