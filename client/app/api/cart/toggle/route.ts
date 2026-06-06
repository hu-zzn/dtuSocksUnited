import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { errorResponse, requireAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const { socId } = await req.json();
    if (!socId) return errorResponse("socId is required", 400);

    const { data: existingItem, error: checkError } = await supabase
      .from("cart_items")
      .select("id")
      .eq("user_id", auth.user._id)
      .eq("soc_id", socId)
      .maybeSingle();

    if (checkError) return errorResponse(checkError.message, 500);

    if (!existingItem) {
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({ user_id: auth.user._id, soc_id: socId });
      if (insertError) return errorResponse(insertError.message, 500);
      return NextResponse.json({ success: true, message: "Added to cart" });
    }

    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", auth.user._id)
      .eq("soc_id", socId);

    if (deleteError) return errorResponse(deleteError.message, 500);
    return NextResponse.json({ success: true, message: "Removed from cart" });
  } catch (err) {
    console.error("cart toggle error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}
