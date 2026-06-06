import mongoose from "mongoose";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const mongoUri = process.env.MONGODB_URI;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!mongoUri || !supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing MONGODB_URI, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY in config.env");
  console.log("Please ensure they are defined in server/config/config.env before running this script.");
  process.exit(1);
}

// Initialize Supabase Admin Client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Define temporary Mongoose Schemas to fetch data from MongoDB
const MongoUserSchema = new mongoose.Schema({}, { strict: false });
const MongoSocSchema = new mongoose.Schema({}, { strict: false });

const MongoUser = mongoose.model("User", MongoUserSchema, "users");
const MongoSoc = mongoose.model("Society", MongoSocSchema, "societies");

const runMigration = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // 1. Migrate Societies
    console.log("\n--- Migrating Societies ---");
    const mongoSocs = await MongoSoc.find().lean();
    console.log(`Found ${mongoSocs.length} societies in MongoDB.`);

    if (mongoSocs.length > 0) {
      const dbSocs = mongoSocs.map(soc => ({
        id: soc._id.toString(),
        soc_name: soc.socName,
        soc_category: soc.socCategory || [],
        soc_about: soc.socAbout,
        soc_logo: soc.socLogo || "_",
        soc_key_events: soc.socKeyEvents || [],
        soc_highlights: soc.socHighlights || [],
        soc_keyword: soc.socKeyWord || [],
        soc_contact_team: soc.socContact?.team || [],
        soc_socials: soc.socContact?.socSocials || { instagram: "_", linkedin: "_", linktree: "_" },
        created_at: soc.createdAt || new Date(),
        updated_at: soc.updated_at || soc.updatedAt || new Date()
      }));

      // Bulk upsert societies into Supabase
      const { error: socError } = await supabase
        .from("societies")
        .upsert(dbSocs);

      if (socError) {
        throw new Error(`Failed to migrate societies: ${socError.message}`);
      }
      console.log(`✅ Successfully migrated ${dbSocs.length} societies to Supabase.`);
    }

    // 2. Migrate Users and Cart Items
    console.log("\n--- Migrating Users & Carts ---");
    const mongoUsers = await MongoUser.find().lean();
    console.log(`Found ${mongoUsers.length} users in MongoDB.`);

    if (mongoUsers.length > 0) {
      const dbUsers = [];
      const dbCartItems = [];

      for (const u of mongoUsers) {
        const userIdStr = u._id.toString();
        
        dbUsers.push({
          id: userIdStr,
          name: u.name,
          email: u.email,
          password: u.password || null,
          google_id: u.googleId || null,
          role: u.role || "User",
          account_verified: u.accountVerified || false,
          avatar_public_id: u.avatar?.public_id || "_",
          avatar_url: u.avatar?.url || "_",
          verification_code: u.verificationCode || null,
          verification_code_expire: u.verificationCodeExpire ? new Date(u.verificationCodeExpire) : null,
          reset_password_token: u.resetPasswordToken || null,
          reset_password_expire: u.resetPasswordExpire ? new Date(u.resetPasswordExpire) : null,
          created_at: u.createdAt || new Date(),
          updated_at: u.updated_at || u.updatedAt || new Date()
        });

        // Collect cart items
        if (Array.isArray(u.cart) && u.cart.length > 0) {
          const seenForUser = new Set();
          for (const item of u.cart) {
            const socIdStr = item.toString();
            // Verify if the society exists in MongoDB/Supabase first to prevent foreign key errors
            const socExists = mongoSocs.some(s => s._id.toString() === socIdStr);
            if (socExists) {
              if (!seenForUser.has(socIdStr)) {
                seenForUser.add(socIdStr);
                dbCartItems.push({
                  user_id: userIdStr,
                  soc_id: socIdStr
                });
              }
            } else {
              console.warn(`⚠️ Warning: Cart item referencing non-existent society ID ${socIdStr} skipped for user ${u.email}`);
            }
          }
        }
      }

      // Bulk upsert users into Supabase
      const { error: userError } = await supabase
        .from("users")
        .upsert(dbUsers);

      if (userError) {
        throw new Error(`Failed to migrate users: ${userError.message}`);
      }
      console.log(`✅ Successfully migrated ${dbUsers.length} users to Supabase.`);

      // Bulk upsert cart items
      if (dbCartItems.length > 0) {
        // Clear previous cart items to avoid duplicates on rerun
        await supabase
          .from("cart_items")
          .delete()
          .in("user_id", dbUsers.map(u => u.id));

        const { error: cartError } = await supabase
          .from("cart_items")
          .insert(dbCartItems);

        if (cartError) {
          throw new Error(`Failed to migrate cart items: ${cartError.message}`);
        }
        console.log(`✅ Successfully migrated ${dbCartItems.length} cart items to Supabase.`);
      }
    }

    console.log("\n🎉 Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message || err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runMigration();
