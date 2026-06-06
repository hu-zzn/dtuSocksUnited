import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/server/supabaseClient";
import { mapUserFromDb } from "@/lib/server/userModel";
import { errorResponse, sendTokenResponse } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return errorResponse("Please enter all fields.", 400);
    }

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (findError || !dbUser) {
      return errorResponse("Invalid email or password.", 400);
    }

    if (!dbUser.account_verified && !dbUser.google_id) {
      return errorResponse("Invalid email or password.", 400);
    }

    if (dbUser.google_id && !dbUser.password) {
      return errorResponse(
        "Please log in with Google for this account.",
        400
      );
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) return errorResponse("Invalid email or password.", 400);

    const user = mapUserFromDb(dbUser);
    if (!user) return errorResponse("User not found.", 404);

    return sendTokenResponse(user, 200, "User login successfully.");
  } catch (err) {
    console.error("login error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}
