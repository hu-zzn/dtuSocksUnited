import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapOrientationFromDb } from "@/lib/server/orientationModel";
import { generateMongoId } from "@/lib/server/userModel";
import { errorResponse, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { socId, eventDate, venue, time, isNew } = body as {
      socId?: string;
      eventDate?: string;
      venue?: string;
      time?: string;
      isNew?: boolean;
    };

    if (!socId || !eventDate || !venue || !time) {
      return errorResponse(
        "socId, eventDate, venue and time are required.",
        400
      );
    }

    const { data: soc, error: findError } = await supabase
      .from("societies")
      .select("id, soc_admin")
      .eq("id", socId)
      .maybeSingle();

    if (findError) return errorResponse(findError.message, 500);
    if (!soc) return errorResponse("Society not found.", 404);

    const isPlatformAdmin = auth.user.role === "Admin";
    const isSocAdmin = soc.soc_admin && soc.soc_admin === auth.user._id;
    if (!isPlatformAdmin && !isSocAdmin) {
      return errorResponse(
        "You are not authorized to add an orientation for this society.",
        403
      );
    }

    const id = generateMongoId();
    const insertRow = {
      id,
      soc_id: socId,
      event_date: eventDate,
      venue,
      event_time: time,
      is_new: Boolean(isNew),
    };

    const { data, error } = await supabase
      .from("orientations")
      .insert(insertRow)
      .select("*, societies:soc_id (soc_name, soc_logo)")
      .single();

    if (error) return errorResponse(error.message, 500);

    return NextResponse.json(
      {
        success: true,
        message: "Orientation added successfully.",
        orientation: mapOrientationFromDb(data),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/orientation/create failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}
