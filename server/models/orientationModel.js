// server/models/orientationModel.js

export const mapOrientationFromDb = (dbRow) => {
  if (!dbRow) return null;
  const soc = dbRow.societies || null;
  return {
    _id: dbRow.id,
    socId: dbRow.soc_id,
    socName: soc?.soc_name,
    socLogo: soc?.soc_logo,
    eventDate: dbRow.event_date,
    venue: dbRow.venue,
    time: dbRow.event_time,
    isNew: Boolean(dbRow.is_new),
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  };
};
