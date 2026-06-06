import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { supabase } from "@/lib/server/supabaseClient";
import { mapUserFromDb } from "@/lib/server/userModel";
import { errorResponse, sendTokenResponse } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { password, confirmPassword } = await req.json();

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("reset_password_token", resetPasswordToken)
      .gt("reset_password_expire", new Date().toISOString())
      .maybeSingle();

    if (findError || !dbUser) {
      return errorResponse(
        "Reset password token is invalid or has been expired.",
        400
      );
    }

    if (password !== confirmPassword) {
      return errorResponse(
        "Password & confirm password do not match.",
        400
      );
    }

    if (
      password.length < 4 ||
      password.length > 16 ||
      confirmPassword.length < 4 ||
      confirmPassword.length > 16
    ) {
      return errorResponse("Password must be between 4 and 16.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expire: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dbUser.id)
      .select()
      .single();

    if (updateError) return errorResponse(updateError.message, 500);

    const user = mapUserFromDb(updatedUser);
    if (!user) return errorResponse("User not found.", 404);

    return sendTokenResponse(user, 200, "Password reset successfully.");
  } catch (err) {
    console.error("reset-password error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}
