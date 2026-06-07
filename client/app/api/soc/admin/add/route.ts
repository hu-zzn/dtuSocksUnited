import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/server/supabaseClient";
import { mapSocFromDb } from "@/lib/server/socModel";
import { generateMongoId } from "@/lib/server/userModel";
import { errorResponse, requireRole } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, "Admin");
  if (!auth.ok) return auth.response;

  try {
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
      socAdmin,
    } = body;

    if (!socName || !socCategory || !socAbout) {
      return errorResponse("Please fill all fields.", 400);
    }

    const id = generateMongoId();
    const dbSoc = {
      id,
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
      soc_admin: socAdmin || null,
    };

    const { data, error } = await supabase
      .from("societies")
      .insert(dbSoc)
      .select()
      .single();

    if (error) return errorResponse(error.message, 500);

    return NextResponse.json(
      {
        success: true,
        message: "Society is added successfully.",
        soc: mapSocFromDb(data),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("add society error:", err);
    return errorResponse("Internal Server Error", 500);
  }
}
