import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapSocFromDb } from "@/lib/server/socModel";
import { errorResponse, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const { newAdminEmail, newAdminId } = body;

    if (!newAdminEmail && !newAdminId) {
      return errorResponse(
        "Provide newAdminEmail or newAdminId of the new soc admin.",
        400
      );
    }

    const { data: soc, error: findError } = await supabase
      .from("societies")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError) return errorResponse(findError.message, 500);
    if (!soc) return errorResponse("Society not found.", 404);

    const isPlatformAdmin = auth.user.role === "Admin";
    const isCurrentSocAdmin = soc.soc_admin && soc.soc_admin === auth.user._id;

    if (!isPlatformAdmin && !isCurrentSocAdmin) {
      return errorResponse(
        "Only the current soc admin or a platform admin can transfer this role.",
        403
      );
    }

    const userQuery = supabase.from("users").select("id, email, account_verified");
    const { data: targetUser, error: userError } = await (newAdminId
      ? userQuery.eq("id", newAdminId)
      : userQuery.eq("email", newAdminEmail)
    ).maybeSingle();

    if (userError) return errorResponse(userError.message, 500);
    if (!targetUser) return errorResponse("Target user not found.", 404);
    if (!targetUser.account_verified) {
      return errorResponse("Target user account is not verified.", 400);
    }

    if (soc.soc_admin === targetUser.id) {
      return errorResponse("That user is already the soc admin.", 400);
    }

    const { data: updated, error: updateError } = await supabase
      .from("societies")
      .update({
        soc_admin: targetUser.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) return errorResponse(updateError.message, 500);

    return NextResponse.json({
      success: true,
      message: "Soc admin transferred successfully.",
      soc: mapSocFromDb(updated),
    });
  } catch (err) {
    console.error("POST /api/soc/transfer failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}
