import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Soc } from "../models/socModel.js"
import { User } from "../models/userModel.js"
import ErrorHandler from "../middlewares/errorMiddlewares.js";

export const addSoc = catchAsyncErrors(async (req, res, next) => {
    const { socName, socCategory, socAbout, socKeyEvents, socHighlights, socContact, socSocials } = req.body;

    if (!socName || !socCategory || !socAbout) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }
    const soc = await Soc.create({
        socName, socCategory, socAbout, socKeyEvents, socHighlights, socContact, socSocials,
    });
    res.status(201).json({
        success: true,
        message: "Society is added successfully.",
        soc,
    });
});
export const getAllSocs = catchAsyncErrors(async (req, res, next) => {
    const socs = await Soc.find();
    res.status(201).json({
        success: true,
        socs,
    });
});
export const deleteSoc = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const soc = await Soc.findById(id);
    if (!soc) {
        return next(new ErrorHandler("Society not found.", 404));
    }
    await soc.deleteOne();
    res.status(200).json({
        success: true,
        message: "Soc delete successfully.",
    });
});


//
export const updateSoc = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const previousSoc = await Soc.findById(id);
    if (!previousSoc) {
        return next(new ErrorHandler("Soc not found", 404));
    }

    // Delete the previous document
    await previousSoc.deleteOne();

    const { socName, socCategory, socAbout, socKeyEvents, socHighlights, socContact, socSocials } = req.body;

    if (!socName || !socCategory || !socAbout) {
        return next(new ErrorHandler("Please fill all required fields.", 400));
    }

    // Create new document with the same _id from previousSoc
    const soc = await Soc.create({
        _id: previousSoc._id, // using _id from previousSoc instead of req.params.id
        socName,
        socCategory,
        socAbout,
        socKeyEvents,
        socHighlights,
        socContact,
        socSocials,
    });

    res.status(200).json({
        success: true,
        message: "Soc updated successfully.",
        soc,
    });
});
