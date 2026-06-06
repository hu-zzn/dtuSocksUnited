import { NextRequest } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { supabase } from "@/lib/server/supabaseClient";
import {
  mapUserFromDb,
  generateMongoId,
} from "@/lib/server/userModel";
import { errorResponse, sendTokenResponse } from "@/lib/server/auth";

export const runtime = "nodejs";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id_token = body?.id_token;

    if (!id_token) return errorResponse("Google ID token is required", 400);

    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email || !payload.name) {
      return errorResponse(
        "Google login failed: Incomplete user data from Google.",
        401
      );
    }

    const { sub: googleId, email, name, picture: avatarUrl } = payload;

    const { data: userByGoogle } = await supabase
      .from("users")
      .select("*")
      .eq("google_id", googleId)
      .maybeSingle();

    if (userByGoogle) {
      const user = mapUserFromDb(userByGoogle);
      if (!user) return errorResponse("User not found.", 404);
      return sendTokenResponse(
        user,
        200,
        "Logged in with Google successfully."
      );
    }

    const { data: userByEmail } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (userByEmail) {
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          google_id: googleId,
          account_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userByEmail.id)
        .select()
        .single();

      if (updateError) return errorResponse(updateError.message, 500);

      const user = mapUserFromDb(updatedUser);
      if (!user) return errorResponse("User not found.", 404);
      return sendTokenResponse(
        user,
        200,
        "Logged in with Google successfully."
      );
    }

    const id = generateMongoId();
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        id,
        google_id: googleId,
        name,
        email,
        avatar_public_id: "google_avatar",
        avatar_url: avatarUrl,
        role: "User",
        account_verified: true,
      })
      .select()
      .single();

    if (insertError) return errorResponse(insertError.message, 500);

    const user = mapUserFromDb(newUser);
    if (!user) return errorResponse("User creation failed.", 500);
    return sendTokenResponse(user, 200, "Logged in with Google successfully.");
  } catch (err) {
    console.error("Google login error:", err);
    return errorResponse(
      "Google login failed: Invalid token or server error.",
      401
    );
  }
}
