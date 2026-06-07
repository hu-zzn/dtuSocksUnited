import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapOrientationFromDb } from "@/lib/server/orientationModel";
import { errorResponse, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const { data: managedSocs, error: socErr } = await supabase
      .from("societies")
      .select("id")
      .eq("soc_admin", auth.user._id);

    if (socErr) return errorResponse(socErr.message, 500);

    const socIds = (managedSocs || []).map((s) => s.id);
    if (socIds.length === 0) {
      return NextResponse.json({ success: true, orientations: [] });
    }

    const { data, error } = await supabase
      .from("orientations")
      .select("*, societies:soc_id (soc_name, soc_logo)")
      .in("soc_id", socIds)
      .order("event_date", { ascending: true });

    if (error) return errorResponse(error.message, 500);

    const orientations = (data || []).map(mapOrientationFromDb).filter(Boolean);
    return NextResponse.json({ success: true, orientations });
  } catch (err) {
    console.error("GET /api/orientation/managed failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}
