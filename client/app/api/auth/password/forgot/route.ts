import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { getResetPasswordToken } from "@/lib/server/userModel";
import { sendEmail } from "@/lib/server/sendEmail";
import { generateForgotPasswordEmailTemplate } from "@/lib/server/emailTemplates";
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
      .maybeSingle();

    if (findError || !dbUser) return errorResponse("Invalid email.", 400);

    if (!dbUser.account_verified && !dbUser.google_id) {
      return errorResponse("Invalid email.", 400);
    }

    if (dbUser.google_id && !dbUser.password) {
      return errorResponse(
        "This account is registered via Google. Please use Google login.",
        400
      );
    }

    const { resetToken, resetPasswordToken, resetPasswordExpire } =
      getResetPasswordToken();

    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_password_token: resetPasswordToken,
        reset_password_expire: resetPasswordExpire.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", dbUser.id);

    if (updateError) return errorResponse(updateError.message, 500);

    const origin =
      process.env.FRONTEND_URL ||
      req.headers.get("origin") ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const resetPasswordUrl = `${origin}/reset-password/${resetToken}`;
    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try {
      await sendEmail({
        email: dbUser.email,
        subject: "Password Recovery (infoSoc)",
        message,
      });
    } catch (err) {
      await supabase
        .from("users")
        .update({
          reset_password_token: null,
          reset_password_expire: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", dbUser.id);
      const msg = err instanceof Error ? err.message : "Failed to send email.";
      return errorResponse(msg, 500);
    }

    return NextResponse.json({
      success: true,
      message: `Email sent to ${dbUser.email} successfully.`,
    });
  } catch (err) {
    console.error("forgot-password error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}
