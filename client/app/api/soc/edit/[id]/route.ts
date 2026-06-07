import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapSocFromDb } from "@/lib/server/socModel";
import { errorResponse, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    const { data: soc, error: findError } = await supabase
      .from("societies")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError) return errorResponse(findError.message, 500);
    if (!soc) return errorResponse("Society not found.", 404);

    const isPlatformAdmin = auth.user.role === "Admin";
    const isSocAdmin = soc.soc_admin && soc.soc_admin === auth.user._id;

    if (!isPlatformAdmin && !isSocAdmin) {
      return errorResponse(
        "You are not authorized to edit this society.",
        403
      );
    }

    return NextResponse.json({ success: true, soc: mapSocFromDb(soc) });
  } catch (err) {
    console.error("GET /api/soc/edit failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    const { data: soc, error: findError } = await supabase
      .from("societies")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError) return errorResponse(findError.message, 500);
    if (!soc) return errorResponse("Society not found.", 404);

    const isPlatformAdmin = auth.user.role === "Admin";
    const isSocAdmin = soc.soc_admin && soc.soc_admin === auth.user._id;

    if (!isPlatformAdmin && !isSocAdmin) {
      return errorResponse(
        "You are not authorized to edit this society.",
        403
      );
    }

    const body = await req.json();
    const { socAbout, socHighlights, socKeyEvents, socContact } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (socAbout !== undefined) updates.soc_about = socAbout;
    if (socHighlights !== undefined) updates.soc_highlights = socHighlights;
    if (socKeyEvents !== undefined) updates.soc_key_events = socKeyEvents;
    if (socContact?.team !== undefined) updates.soc_contact_team = socContact.team;
    if (socContact?.socSocials !== undefined)
      updates.soc_socials = socContact.socSocials;

    const { data: updated, error: updateError } = await supabase
      .from("societies")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) return errorResponse(updateError.message, 500);

    return NextResponse.json({
      success: true,
      message: "Society updated successfully.",
      soc: mapSocFromDb(updated),
    });
  } catch (err) {
    console.error("PATCH /api/soc/edit failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}
