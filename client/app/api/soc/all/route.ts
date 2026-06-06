import { NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapSocFromDb } from "@/lib/server/socModel";
import { errorResponse } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET() {
  const { data, error } = await supabase.from("societies").select("*");
  if (error) return errorResponse(error.message, 500);

  const socs = (data || []).map(mapSocFromDb).filter(Boolean);
  return NextResponse.json({ success: true, socs });
}
