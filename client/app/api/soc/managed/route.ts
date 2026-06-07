import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapSocFromDb } from "@/lib/server/socModel";
import { errorResponse, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const { data, error } = await supabase
      .from("societies")
      .select("*")
      .eq("soc_admin", auth.user._id);
    if (error) return errorResponse(error.message, 500);

    const socs = (data || []).map(mapSocFromDb).filter(Boolean);
    return NextResponse.json({ success: true, socs });
  } catch (err) {
    console.error("GET /api/soc/managed failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}
