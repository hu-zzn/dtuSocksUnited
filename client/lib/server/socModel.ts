export interface DbSoc {
  id: string;
  soc_name: string;
  soc_category: string[] | null;
  soc_about: string;
  soc_logo: string | null;
  soc_key_events: unknown[] | null;
  soc_highlights: unknown[] | null;
  soc_keyword: string[] | null;
  soc_contact_team: unknown[] | null;
  soc_socials: { instagram?: string; linkedin?: string; linktree?: string } | null;
  soc_admin: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const mapSocFromDb = (dbSoc: DbSoc | null) => {
  if (!dbSoc) return null;
  return {
    _id: dbSoc.id,
    socName: dbSoc.soc_name,
    socCategory: dbSoc.soc_category || [],
    socAbout: dbSoc.soc_about,
    socLogo: dbSoc.soc_logo || "_",
    socKeyEvents: dbSoc.soc_key_events || [],
    socHighlights: dbSoc.soc_highlights || [],
    socKeyWord: dbSoc.soc_keyword || [],
    socContact: {
      team: dbSoc.soc_contact_team || [],
      socSocials:
        dbSoc.soc_socials || { instagram: "_", linkedin: "_", linktree: "_" },
    },
    socAdmin: dbSoc.soc_admin || null,
    createdAt: dbSoc.created_at,
    updatedAt: dbSoc.updated_at,
  };
};
