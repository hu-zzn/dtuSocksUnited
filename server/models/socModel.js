import mongoose from "mongoose";

const socSchema = new mongoose.Schema(
    {
        socName: {
            type: String,
            required: true,
            trim: true,
        },
        socCategory: {
            type: [String],
            required: true,
        },
        socAbout: {
            type: String,
            required: true,
            trim: true,
        },
        socKeyEvents: [
            {
                name: { type: String, trim: true, required: true, default : "_" },
                description: { type: String, trim: true,default : "_" },
            },
        ],
        socHighlights: {
            type: [String],
            default : [],
        },
        socContact: {
            president: { type: String, trim: true },
            email: {
                type: String,
                trim: true,
                default: "_@.",
                match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
            },
            phone: {
                type: String,
                trim: true,
                default: "1000000000",
                match: [/^\d{10}$/, 'Phone must be 10 digits'],
            },
        },
        socSocials: {
            instagram: {
                type: String,
                default : "_",
                trim: true,
            },
            linkedin: {
                type: String,
                default : "_",
                trim: true,
            },
            linktree: {
                type: String,
                default : "_",
                trim: true,
            },
        },
    },
    {
        timestamps: true,
    }
);


export const Soc = mongoose.model("Society", socSchema);