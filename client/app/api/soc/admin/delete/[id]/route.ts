import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { errorResponse, requireRole } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, "Admin");
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const { data: soc, error: findError } = await supabase
    .from("societies")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (findError) return errorResponse(findError.message, 500);
  if (!soc) return errorResponse("Society not found.", 404);

  const { error: deleteError } = await supabase
    .from("societies")
    .delete()
    .eq("id", id);

  if (deleteError) return errorResponse(deleteError.message, 500);

  return NextResponse.json({
    success: true,
    message: "Soc delete successfully.",
  });
}
