import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapOrientationFromDb } from "@/lib/server/orientationModel";
import { errorResponse, requireAuth, AuthResult } from "@/lib/server/auth";

export const runtime = "nodejs";

type Authorized = Extract<AuthResult, { ok: true }>;

async function loadAndAuthorize(
  req: NextRequest,
  id: string
): Promise<
  | { ok: true; auth: Authorized; orientation: { id: string; soc_id: string } }
  | { ok: false; response: NextResponse }
> {
  const auth = await requireAuth(req);
  if (!auth.ok) return { ok: false, response: auth.response };

  const { data: orientation, error: findError } = await supabase
    .from("orientations")
    .select("id, soc_id")
    .eq("id", id)
    .maybeSingle();

  if (findError) return { ok: false, response: errorResponse(findError.message, 500) };
  if (!orientation)
    return { ok: false, response: errorResponse("Orientation not found.", 404) };

  const { data: soc, error: socErr } = await supabase
    .from("societies")
    .select("soc_admin")
    .eq("id", orientation.soc_id)
    .maybeSingle();

  if (socErr) return { ok: false, response: errorResponse(socErr.message, 500) };

  const isPlatformAdmin = auth.user.role === "Admin";
  const isSocAdmin = soc?.soc_admin && soc.soc_admin === auth.user._id;
  if (!isPlatformAdmin && !isSocAdmin) {
    return {
      ok: false,
      response: errorResponse(
        "You are not authorized to modify this orientation.",
        403
      ),
    };
  }

  return { ok: true, auth, orientation };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guard = await loadAndAuthorize(req, id);
    if (!guard.ok) return guard.response;

    const body = await req.json();
    const { eventDate, venue, time, isNew } = body as {
      eventDate?: string;
      venue?: string;
      time?: string;
      isNew?: boolean;
    };

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (eventDate !== undefined) updates.event_date = eventDate;
    if (venue !== undefined) updates.venue = venue;
    if (time !== undefined) updates.event_time = time;
    if (isNew !== undefined) updates.is_new = Boolean(isNew);

    const { data, error } = await supabase
      .from("orientations")
      .update(updates)
      .eq("id", id)
      .select("*, societies:soc_id (soc_name, soc_logo)")
      .single();

    if (error) return errorResponse(error.message, 500);

    return NextResponse.json({
      success: true,
      message: "Orientation updated successfully.",
      orientation: mapOrientationFromDb(data),
    });
  } catch (err) {
    console.error("PATCH /api/orientation/[id] failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guard = await loadAndAuthorize(req, id);
    if (!guard.ok) return guard.response;

    const { error } = await supabase.from("orientations").delete().eq("id", id);
    if (error) return errorResponse(error.message, 500);

    return NextResponse.json({
      success: true,
      message: "Orientation deleted successfully.",
    });
  } catch (err) {
    console.error("DELETE /api/orientation/[id] failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}
