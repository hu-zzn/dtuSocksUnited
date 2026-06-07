import { NextRequest, NextResponse } from "next/server";
import { errorResponse, requireAuth } from "@/lib/server/auth";
import { supabase } from "@/lib/server/supabaseClient";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.ok) return auth.response;

    const { count } = await supabase
      .from("societies")
      .select("id", { count: "exact", head: true })
      .eq("soc_admin", auth.user._id);

    const { password, ...userSafe } = auth.user;
    return NextResponse.json({
      success: true,
      user: { ...userSafe, isSocAdmin: (count ?? 0) > 0 },
    });
  } catch (err) {
    console.error("GET /api/auth/me failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}
