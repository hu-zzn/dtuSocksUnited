// server/models/socModel.js

export const mapSocFromDb = (dbSoc) => {
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
      socSocials: dbSoc.soc_socials || { instagram: "_", linkedin: "_", linktree: "_" }
    },
    createdAt: dbSoc.created_at,
    updatedAt: dbSoc.updated_at
  };
};

export const mapSocToDb = (soc) => {
  if (!soc) return null;
  const dbSoc = {};
  if (soc._id) dbSoc.id = soc._id;
  if (soc.socName !== undefined) dbSoc.soc_name = soc.socName;
  if (soc.socCategory !== undefined) dbSoc.soc_category = soc.socCategory;
  if (soc.socAbout !== undefined) dbSoc.soc_about = soc.socAbout;
  if (soc.socLogo !== undefined) dbSoc.soc_logo = soc.socLogo;
  if (soc.socKeyEvents !== undefined) dbSoc.soc_key_events = soc.socKeyEvents;
  if (soc.socHighlights !== undefined) dbSoc.soc_highlights = soc.socHighlights;
  if (soc.socKeyWord !== undefined) dbSoc.soc_keyword = soc.socKeyWord;
  if (soc.socContact !== undefined) {
    if (soc.socContact.team !== undefined) dbSoc.soc_contact_team = soc.socContact.team;
    if (soc.socContact.socSocials !== undefined) dbSoc.soc_socials = soc.socContact.socSocials;
  }
  return dbSoc;
};
