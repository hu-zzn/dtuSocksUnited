import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { supabase } from "../database/supabaseClient.js";
import { mapSocFromDb } from "../models/socModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

const generateMongoId = () => {
  return Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
};

export const addSoc = catchAsyncErrors(async (req, res, next) => {
    const { socName, socCategory, socAbout, socKeyEvents, socHighlights, socContact } = req.body;

    if (!socName || !socCategory || !socAbout) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }
    
    const id = generateMongoId();
    
    const dbSoc = {
      id,
      soc_name: socName,
      soc_category: socCategory,
      soc_about: socAbout,
      soc_key_events: socKeyEvents || [],
      soc_highlights: socHighlights || [],
      soc_keyword: req.body.socKeyWord || [],
      soc_contact_team: socContact?.team || [],
      soc_socials: socContact?.socSocials || { instagram: "_", linkedin: "_", linktree: "_" },
      soc_logo: req.body.socLogo || "_"
    };

    const { data, error } = await supabase
      .from("societies")
      .insert(dbSoc)
      .select()
      .single();

    if (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    res.status(201).json({
        success: true,
        message: "Society is added successfully.",
        soc: mapSocFromDb(data),
    });
});

export const getAllSocs = catchAsyncErrors(async (req, res, next) => {
    const { data, error } = await supabase
      .from("societies")
      .select("*");

    if (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    const socs = (data || []).map(mapSocFromDb);

    res.status(200).json({
        success: true,
        socs,
    });
});

export const deleteSoc = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    
    const { data: soc, error: findError } = await supabase
      .from("societies")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (findError) {
      return next(new ErrorHandler(findError.message, 500));
    }

    if (!soc) {
        return next(new ErrorHandler("Society not found.", 404));
    }

    const { error: deleteError } = await supabase
      .from("societies")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return next(new ErrorHandler(deleteError.message, 500));
    }

    res.status(200).json({
        success: true,
        message: "Soc delete successfully.",
    });
});

export const updateSoc = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const { data: previousSoc, error: findError } = await supabase
      .from("societies")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError) {
      return next(new ErrorHandler(findError.message, 500));
    }

    if (!previousSoc) {
        return next(new ErrorHandler("Soc not found", 404));
    }

    // Delete the previous document
    const { error: deleteError } = await supabase
      .from("societies")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return next(new ErrorHandler(deleteError.message, 500));
    }

    const { socName, socCategory, socAbout, socKeyEvents, socHighlights, socContact } = req.body;

    if (!socName || !socCategory || !socAbout) {
        return next(new ErrorHandler("Please fill all required fields.", 400));
    }

    const dbSoc = {
      id: previousSoc.id,
      soc_name: socName,
      soc_category: socCategory,
      soc_about: socAbout,
      soc_key_events: socKeyEvents || [],
      soc_highlights: socHighlights || [],
      soc_keyword: req.body.socKeyWord || [],
      soc_contact_team: socContact?.team || [],
      soc_socials: socContact?.socSocials || { instagram: "_", linkedin: "_", linktree: "_" },
      soc_logo: req.body.socLogo || "_"
    };

    const { data: soc, error: insertError } = await supabase
      .from("societies")
      .insert(dbSoc)
      .select()
      .single();

    if (insertError) {
      return next(new ErrorHandler(insertError.message, 500));
    }

    res.status(200).json({
        success: true,
        message: "Soc updated successfully.",
        soc: mapSocFromDb(soc),
    });
});
