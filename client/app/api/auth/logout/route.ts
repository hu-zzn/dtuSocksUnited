import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, errorResponse, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth.ok) return auth.response;

    const res = NextResponse.json({ success: true, message: "Logged out" });
    clearAuthCookie(res);
    return res;
  } catch (err) {
    console.error("GET /api/auth/logout failed:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return errorResponse(msg, 500);
  }
}
