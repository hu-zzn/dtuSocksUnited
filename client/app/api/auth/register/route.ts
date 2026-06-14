import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/server/supabaseClient";
import {
  generateUUID,
  generateVerificationCode,
} from "@/lib/server/userModel";
import { sendVerificationCode } from "@/lib/server/sendVerificationCode";
import { errorResponse } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return errorResponse("Please enter all fields.", 400);
    }

    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (findError) return errorResponse(findError.message, 500);

    if (existingUser) {
      if (existingUser.account_verified || existingUser.google_id) {
        return errorResponse("User already exists", 400);
      }

      const { verificationCode, verificationCodeExpire } =
        generateVerificationCode();
      const hashedPassword = await bcrypt.hash(password, 10);

      const { error: updateError } = await supabase
        .from("users")
        .update({
          name,
          password: hashedPassword,
          verification_code: verificationCode,
          verification_code_expire: verificationCodeExpire.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUser.id);

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
        message: "Verification code resent. Please verify your email.",
        userAlreadyExists: true,
      });
    }

    if (password.length < 4 || password.length > 16) {
      return errorResponse("Password must be between 4 and 16 characters.", 400);
    }

    const id = generateUUID();
    const hashedPassword = await bcrypt.hash(password, 10);
    const { verificationCode, verificationCodeExpire } =
      generateVerificationCode();

    const { error: insertError } = await supabase.from("users").insert({
      id,
      name,
      email,
      password: hashedPassword,
      role: "User",
      account_verified: false,
      verification_code: verificationCode,
      verification_code_expire: verificationCodeExpire.toISOString(),
    });

    if (insertError) return errorResponse(insertError.message, 500);

    try {
      await sendVerificationCode(verificationCode, email);
    } catch (err) {
      console.error("Error sending verification email:", err);
      return errorResponse("Verification code failed to send.", 500);
    }

    return NextResponse.json({
      success: true,
      email,
      message: "Registered successfully. Please verify your email.",
      userAlreadyExists: false,
    });
  } catch (err) {
    console.error("register error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}
