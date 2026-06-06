import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapSocFromDb, DbSoc } from "@/lib/server/socModel";
import { errorResponse, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const { data, error } = await supabase
    .from("cart_items")
    .select("societies (*)")
    .eq("user_id", auth.user._id);

  if (error) return errorResponse(error.message, 500);

  const cart = ((data || []) as Array<{ societies: DbSoc | null }>)
    .map((item) => mapSocFromDb(item.societies))
    .filter(Boolean);

  return NextResponse.json({ success: true, cart });
}
