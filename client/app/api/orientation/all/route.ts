import { NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapOrientationFromDb } from "@/lib/server/orientationModel";
import { errorResponse } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("orientations")
      .select("*, societies:soc_id (soc_name, soc_logo)")
      .order("event_date", { ascending: true });

    if (error) return errorResponse(error.message, 500);

    const orientations = (data || []).map(mapOrientationFromDb).filter(Boolean);
    return NextResponse.json({ success: true, orientations });
  } catch (err) {
    console.error("GET /api/orientation/all failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}
