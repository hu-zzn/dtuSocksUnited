import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapSocFromDb } from "@/lib/server/socModel";
import { errorResponse, requireRole } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, "Admin");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    const { data: previousSoc, error: findError } = await supabase
      .from("societies")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError) return errorResponse(findError.message, 500);
    if (!previousSoc) return errorResponse("Soc not found", 404);

    const body = await req.json();
    const {
      socName,
      socCategory,
      socAbout,
      socKeyEvents,
      socHighlights,
      socContact,
      socKeyWord,
      socLogo,
    } = body;

    if (!socName || !socCategory || !socAbout) {
      return errorResponse("Please fill all required fields.", 400);
    }

    const { error: deleteError } = await supabase
      .from("societies")
      .delete()
      .eq("id", id);

    if (deleteError) return errorResponse(deleteError.message, 500);

    const dbSoc = {
      id: previousSoc.id,
      soc_name: socName,
      soc_category: socCategory,
      soc_about: socAbout,
      soc_key_events: socKeyEvents || [],
      soc_highlights: socHighlights || [],
      soc_keyword: socKeyWord || [],
      soc_contact_team: socContact?.team || [],
      soc_socials:
        socContact?.socSocials || {
          instagram: "_",
          linkedin: "_",
          linktree: "_",
        },
      soc_logo: socLogo || "_",
    };

    const { data: soc, error: insertError } = await supabase
      .from("societies")
      .insert(dbSoc)
      .select()
      .single();

    if (insertError) return errorResponse(insertError.message, 500);

    return NextResponse.json({
      success: true,
      message: "Soc updated successfully.",
      soc: mapSocFromDb(soc),
    });
  } catch (err) {
    console.error("update soc error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}
