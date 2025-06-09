import{isAuthenticated, isAuthorized} from "../middlewares/authMiddleware.js"
import {
    addSoc,
    deleteSoc,
    getAllSocs,
} from "../controllers/socController.js";
import express, { Router } from "express";

const router = express.Router();

router.post("/admin/add",isAuthenticated, isAuthorized("Admin"), addSoc);
router.get("/all",isAuthenticated, getAllSocs);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteSoc);

export default router;