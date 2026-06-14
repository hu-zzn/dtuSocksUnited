// One-off seed for the orientations table from the original hardcoded list
// that used to live in client/app/eventCalendar/page.tsx.
//
// Usage (from the server/ directory):
//   node scripts/seedOrientations.js          # logs unresolved societies, inserts the rest
//   node scripts/seedOrientations.js --dry    # logs what it would insert, writes nothing
//
// Resolves each row's societyName -> soc.id by case-insensitive, trimmed match.
// Skips duplicates (same soc_id + event_date + event_time) so re-running is safe.

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in server/config/config.env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const dryRun = process.argv.includes("--dry");

const SEED_ROWS = [
  { societyName: "AUV", eventDate: "03-08-2025", venue: "Online Mode", time: "7:30 pm", isNew: false },
  { societyName: "EHAX", eventDate: "11-08-2025", venue: "SPS-11", time: "4:00 pm", isNew: false },
  { societyName: "AIMS-DTU", eventDate: "18-08-2025", venue: "BR Audi", time: "2:00 pm", isNew: false },
  { societyName: "IPI-DTU", eventDate: "13-08-2025", venue: "SPS-13", time: "2:00 pm", isNew: false },
  { societyName: "IFSA-DTU", eventDate: "10-08-2025", venue: "Online Mode", time: "8:00 pm", isNew: false },
  { societyName: "SATTVA", eventDate: "10-08-2025", venue: "Online Mode", time: "9:00 pm", isNew: false },
  { societyName: "Team Inferno", eventDate: "20-08-2025", venue: "SPS-11", time: "4:00 pm", isNew: false },
  { societyName: "UGV-DTU", eventDate: "20-08-2025", venue: "SPS-6", time: "4:00 pm", isNew: false },
  { societyName: "TEAM DEFINZ RACING", eventDate: "19-08-2025", venue: "SPS-10", time: "4:00 pm", isNew: false },
  { societyName: "DTU NCC", eventDate: "22-08-2025", venue: "BR AUDI", time: "12:00 pm", isNew: false },
  { societyName: "SAHITYA", eventDate: "21-08-2025", venue: "CONVOCATION HALL", time: "3:00 pm", isNew: false },
  { societyName: "COGNITIVE MINDS", eventDate: "20-08-2025", venue: "AB3 218", time: "4:00 pm", isNew: false },
  { societyName: "DTU Bhangra", eventDate: "27-08-2025", venue: "Windpoint (Science Block)", time: "3:30 pm", isNew: false },
  { societyName: "DelTech MUN and Debsoc", eventDate: "28-08-2025", venue: "AB", time: "12:00 pm", isNew: false },
  { societyName: "IGTS-DTU", eventDate: "28-08-2025", venue: "AB", time: "12:00 pm", isNew: false },
  { societyName: "KALAKRITI", eventDate: "29-08-2025", venue: "BR AUDI", time: "12:30 pm", isNew: false },
  { societyName: "PARCHHAYI DTU", eventDate: "04-09-2025", venue: "BR AUDI", time: "2:00pm", isNew: false },
  { societyName: "Panache DTU", eventDate: "03-09-2025", venue: "BR Auditorium", time: "12:00 PM onwards", isNew: false },
  { societyName: "STEP DTU", eventDate: "28-08-2025", venue: "BR Auditorium", time: "11:00 AM", isNew: false },
  { societyName: "Let’s Talk - The Communication & Soft Skills Society", eventDate: "09-09-2025", venue: "BR Auditorium", time: "2:00 PM", isNew: true },
  { societyName: "BioSoc DTU", eventDate: "04-09-2025", venue: "Convocation Hall", time: "12:00 PM - 2:00 PM", isNew: false },
  { societyName: "SIAM DTU", eventDate: "10-09-2025", venue: "SPS-10", time: "3PM", isNew: true },
  { societyName: "Madhurima Auditions", eventDate: "10-09-2025", venue: "Convocation Hall", time: "11PM-5PM", isNew: true },
];

const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
const ddmmyyyyToIso = (s) => {
  const [d, m, y] = s.split("-");
  return `${y}-${m}-${d}`;
};
const run = async () => {
  console.log(`🌱 Seeding orientations${dryRun ? " (dry run)" : ""}…`);

  const { data: socs, error: socErr } = await supabase
    .from("societies")
    .select("id, soc_name");
  if (socErr) {
    console.error("❌ Failed to fetch societies:", socErr.message);
    process.exit(1);
  }
  const nameToId = new Map();
  for (const s of socs || []) {
    if (s.soc_name) nameToId.set(normalize(s.soc_name), s.id);
  }

  const { data: existing, error: orientErr } = await supabase
    .from("orientations")
    .select("soc_id, event_date, event_time");
  if (orientErr) {
    console.error("❌ Failed to fetch orientations:", orientErr.message);
    process.exit(1);
  }
  const existingKeys = new Set(
    (existing || []).map((o) => `${o.soc_id}|${o.event_date}|${o.event_time}`)
  );

  const toInsert = [];
  const unresolved = [];
  const duplicates = [];

  for (const row of SEED_ROWS) {
    const socId = nameToId.get(normalize(row.societyName));
    if (!socId) {
      unresolved.push(row.societyName);
      continue;
    }
    const eventDate = ddmmyyyyToIso(row.eventDate);
    const key = `${socId}|${eventDate}|${row.time}`;
    if (existingKeys.has(key)) {
      duplicates.push(`${row.societyName} on ${row.eventDate}`);
      continue;
    }
    existingKeys.add(key);
    toInsert.push({
      id: crypto.randomUUID(),
      soc_id: socId,
      event_date: eventDate,
      venue: row.venue,
      event_time: row.time,
      is_new: row.isNew,
    });
  }

  console.log(`  matched & new:  ${toInsert.length}`);
  console.log(`  duplicates:     ${duplicates.length}`);
  console.log(`  unresolved:     ${unresolved.length}`);

  if (unresolved.length > 0) {
    console.log("\n⚠️  Unresolved society names (add them to societies first or fix the seed):");
    for (const name of unresolved) console.log(`     - "${name}"`);
  }
  if (duplicates.length > 0) {
    console.log("\nℹ️  Skipped (already in DB):");
    for (const d of duplicates) console.log(`     - ${d}`);
  }

  if (dryRun) {
    console.log("\n💤 Dry run — no rows inserted.");
    return;
  }
  if (toInsert.length === 0) {
    console.log("\n✅ Nothing to insert.");
    return;
  }

  const { error: insertError } = await supabase
    .from("orientations")
    .insert(toInsert);
  if (insertError) {
    console.error("\n❌ Insert failed:", insertError.message);
    process.exit(1);
  }
  console.log(`\n✅ Inserted ${toInsert.length} orientation(s).`);
};

run().catch((err) => {
  console.error("❌ Seed crashed:", err);
  process.exit(1);
});
