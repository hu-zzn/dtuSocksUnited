import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { supabase } from "../database/supabaseClient.js";
import { mapOrientationFromDb } from "../models/orientationModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

const generateMongoId = () =>
  Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

const SELECT_WITH_SOC =
  "*, societies:soc_id (soc_name, soc_logo)";

export const getAllOrientations = catchAsyncErrors(async (req, res, next) => {
  const { data, error } = await supabase
    .from("orientations")
    .select(SELECT_WITH_SOC)
    .order("event_date", { ascending: true });

  if (error) return next(new ErrorHandler(error.message, 500));

  res.status(200).json({
    success: true,
    orientations: (data || []).map(mapOrientationFromDb),
  });
});

export const getManagedOrientations = catchAsyncErrors(
  async (req, res, next) => {
    const { data: managedSocs, error: socErr } = await supabase
      .from("societies")
      .select("id")
      .eq("soc_admin", req.user._id);

    if (socErr) return next(new ErrorHandler(socErr.message, 500));

    const socIds = (managedSocs || []).map((s) => s.id);
    if (socIds.length === 0) {
      return res.status(200).json({ success: true, orientations: [] });
    }

    const { data, error } = await supabase
      .from("orientations")
      .select(SELECT_WITH_SOC)
      .in("soc_id", socIds)
      .order("event_date", { ascending: true });

    if (error) return next(new ErrorHandler(error.message, 500));

    res.status(200).json({
      success: true,
      orientations: (data || []).map(mapOrientationFromDb),
    });
  }
);

export const addOrientation = catchAsyncErrors(async (req, res, next) => {
  const { socId, name, eventDate, venue, time, isNew } = req.body;

  if (!socId || !eventDate || !venue || !time) {
    return next(
      new ErrorHandler("socId, eventDate, venue and time are required.", 400)
    );
  }

  const { data: soc, error: findError } = await supabase
    .from("societies")
    .select("id, soc_admin")
    .eq("id", socId)
    .maybeSingle();

  if (findError) return next(new ErrorHandler(findError.message, 500));
  if (!soc) return next(new ErrorHandler("Society not found.", 404));

  const isPlatformAdmin = req.user.role === "Admin";
  const isSocAdmin = soc.soc_admin && soc.soc_admin === req.user._id;
  if (!isPlatformAdmin && !isSocAdmin) {
    return next(
      new ErrorHandler(
        "You are not authorized to add an orientation for this society.",
        403
      )
    );
  }

  const trimmedName = typeof name === "string" ? name.trim() : "";
  const insertRow = {
    id: generateMongoId(),
    soc_id: socId,
    name: trimmedName || null,
    event_date: eventDate,
    venue,
    event_time: time,
    is_new: Boolean(isNew),
  };

  const { data, error } = await supabase
    .from("orientations")
    .insert(insertRow)
    .select(SELECT_WITH_SOC)
    .single();

  if (error) return next(new ErrorHandler(error.message, 500));

  res.status(201).json({
    success: true,
    message: "Orientation added successfully.",
    orientation: mapOrientationFromDb(data),
  });
});

const loadAndAuthorize = async (req, id) => {
  const { data: orientation, error: findError } = await supabase
    .from("orientations")
    .select("id, soc_id")
    .eq("id", id)
    .maybeSingle();

  if (findError) return { error: new ErrorHandler(findError.message, 500) };
  if (!orientation)
    return { error: new ErrorHandler("Orientation not found.", 404) };

  const { data: soc, error: socErr } = await supabase
    .from("societies")
    .select("soc_admin")
    .eq("id", orientation.soc_id)
    .maybeSingle();

  if (socErr) return { error: new ErrorHandler(socErr.message, 500) };

  const isPlatformAdmin = req.user.role === "Admin";
  const isSocAdmin = soc?.soc_admin && soc.soc_admin === req.user._id;
  if (!isPlatformAdmin && !isSocAdmin) {
    return {
      error: new ErrorHandler(
        "You are not authorized to modify this orientation.",
        403
      ),
    };
  }

  return { orientation };
};

export const updateOrientation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const guard = await loadAndAuthorize(req, id);
  if (guard.error) return next(guard.error);

  const { name, eventDate, venue, time, isNew } = req.body;
  const updates = { updated_at: new Date().toISOString() };
  if (name !== undefined) {
    const trimmed = typeof name === "string" ? name.trim() : "";
    updates.name = trimmed || null;
  }
  if (eventDate !== undefined) updates.event_date = eventDate;
  if (venue !== undefined) updates.venue = venue;
  if (time !== undefined) updates.event_time = time;
  if (isNew !== undefined) updates.is_new = Boolean(isNew);

  const { data, error } = await supabase
    .from("orientations")
    .update(updates)
    .eq("id", id)
    .select(SELECT_WITH_SOC)
    .single();

  if (error) return next(new ErrorHandler(error.message, 500));

  res.status(200).json({
    success: true,
    message: "Orientation updated successfully.",
    orientation: mapOrientationFromDb(data),
  });
});

export const deleteOrientation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const guard = await loadAndAuthorize(req, id);
  if (guard.error) return next(guard.error);

  const { error } = await supabase.from("orientations").delete().eq("id", id);
  if (error) return next(new ErrorHandler(error.message, 500));

  res.status(200).json({
    success: true,
    message: "Orientation deleted successfully.",
  });
});
