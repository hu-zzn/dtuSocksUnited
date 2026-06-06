import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { generateVerificationCode } from "@/lib/server/userModel";
import { sendVerificationCode } from "@/lib/server/sendVerificationCode";
import { errorResponse } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return errorResponse("Email is required.", 400);

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("account_verified", false)
      .is("google_id", null)
      .maybeSingle();

    if (findError || !dbUser) {
      return errorResponse(
        "No unverified local account found with this email.",
        400
      );
    }

    const { verificationCode, verificationCodeExpire } =
      generateVerificationCode();

    const { error: updateError } = await supabase
      .from("users")
      .update({
        verification_code: verificationCode,
        verification_code_expire: verificationCodeExpire.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", dbUser.id);

    if (updateError) return errorResponse(updateError.message, 500);

    try {
      await sendVerificationCode(verificationCode, email);
    } catch (err) {
      console.error("Error sending verification email:", err);
      return errorResponse("Verification code failed to send.", 500);
    }

    return NextResponse.json({
      success: true,
      email,
      message: "Verification code sent successfully.",
    });
  } catch (err) {
    console.error("resend-otp error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}
