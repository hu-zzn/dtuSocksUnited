export interface DbOrientation {
  id: string;
  soc_id: string;
  name: string | null;
  event_date: string;
  venue: string;
  event_time: string;
  is_new: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface MappedOrientation {
  _id: string;
  socId: string;
  socName?: string;
  socLogo?: string;
  name: string | null;
  eventDate: string;
  venue: string;
  time: string;
  isNew: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

type SocJoin = { soc_name?: string | null; soc_logo?: string | null } | null;

export const mapOrientationFromDb = (
  dbRow: (DbOrientation & { societies?: SocJoin }) | null
): MappedOrientation | null => {
  if (!dbRow) return null;
  const soc = dbRow.societies ?? null;
  return {
    _id: dbRow.id,
    socId: dbRow.soc_id,
    socName: soc?.soc_name ?? undefined,
    socLogo: soc?.soc_logo ?? undefined,
    name: dbRow.name ?? null,
    eventDate: dbRow.event_date,
    venue: dbRow.venue,
    time: dbRow.event_time,
    isNew: Boolean(dbRow.is_new),
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  };
};
