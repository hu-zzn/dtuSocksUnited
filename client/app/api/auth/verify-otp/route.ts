import { NextRequest } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapUserFromDb } from "@/lib/server/userModel";
import { errorResponse, sendTokenResponse } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return errorResponse("Email or otp is missing.", 400);
    }

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("account_verified", false)
      .is("google_id", null)
      .maybeSingle();

    if (findError || !dbUser) {
      return errorResponse("User not found or already verified.", 400);
    }

    if (dbUser.verification_code !== Number(otp)) {
      return errorResponse("Invalid OTP", 400);
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      dbUser.verification_code_expire
    ).getTime();

    if (currentTime > verificationCodeExpire) {
      return errorResponse("OTP expired.", 400);
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        account_verified: true,
        verification_code: null,
        verification_code_expire: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dbUser.id)
      .select()
      .single();

    if (updateError) return errorResponse(updateError.message, 500);

    const user = mapUserFromDb(updatedUser);
    if (!user) return errorResponse("User not found.", 404);

    return sendTokenResponse(user, 200, "Account Verified.");
  } catch (err) {
    console.error("verify-otp error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}
