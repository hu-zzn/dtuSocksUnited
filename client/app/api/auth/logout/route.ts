import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const res = NextResponse.json({ success: true, message: "Logged out" });
  clearAuthCookie(res);
  return res;
}
