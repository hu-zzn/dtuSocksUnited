import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/server/supabaseClient";
import { errorResponse, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

async function handler(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const { currentPassword, newPassword, confirmNewPassword } =
      await req.json();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return errorResponse("Please enter all fields.", 400);
    }

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("id", auth.user._id)
      .maybeSingle();

    if (findError || !dbUser) return errorResponse("User not found.", 404);

    if (dbUser.google_id && !dbUser.password) {
      return errorResponse(
        "This account does not have a local password to update. Please use Google login.",
        400
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
    if (!isMatch) return errorResponse("Current password is incorrect.", 400);

    if (
      newPassword.length < 4 ||
      newPassword.length > 16 ||
      confirmNewPassword.length < 4 ||
      confirmNewPassword.length > 16
    ) {
      return errorResponse("Password must be between 4 and 16.", 400);
    }
    if (newPassword !== confirmNewPassword) {
      return errorResponse(
        "New Password & confirm new password do not match.",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dbUser.id);

    if (updateError) return errorResponse(updateError.message, 500);

    return NextResponse.json({
      success: true,
      message: "password updated.",
    });
  } catch (err) {
    console.error("update-password error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}

export const PUT = handler;
export const PATCH = handler;
