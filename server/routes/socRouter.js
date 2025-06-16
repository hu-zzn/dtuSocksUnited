import{isAuthenticated, isAuthorized} from "../middlewares/authMiddleware.js"
import {
    addSoc,
    deleteSoc,
    getAllSocs,
    updateSoc,
} from "../controllers/socController.js";
import express, { Router } from "express";

const router = express.Router();

router.post("/admin/add",isAuthenticated, isAuthorized("Admin"), addSoc);
router.get("/all", getAllSocs);
router.delete("/admin/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteSoc);
router.patch("/admin/update/:id", isAuthenticated, isAuthorized("Admin"), updateSoc);

export default router;