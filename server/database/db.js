import { supabase } from "./supabaseClient.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Supabase already connected");
    return;
  }

  try {
    // Test connection by selecting id from users table with limit 1
    const { error } = await supabase.from("users").select("id").limit(1);
    
    // If the error is relation "users" does not exist, it means database is reachable but table is not created.
    if (error && error.code !== "PGRST116" && !error.message.includes("does not exist")) {
      throw error;
    }
    
    isConnected = true;
    console.log("✅ Supabase Database connected and verified successfully");
  } catch (error) {
    console.error("❌ Supabase connection error:", error.message || error);
    throw error;
  }
};
