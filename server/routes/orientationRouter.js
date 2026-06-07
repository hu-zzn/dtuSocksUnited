import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addOrientation,
  deleteOrientation,
  getAllOrientations,
  getManagedOrientations,
  updateOrientation,
} from "../controllers/orientationController.js";

const router = express.Router();

router.get("/all", getAllOrientations);
router.get("/managed", isAuthenticated, getManagedOrientations);
router.post("/create", isAuthenticated, addOrientation);
router.patch("/:id", isAuthenticated, updateOrientation);
router.delete("/:id", isAuthenticated, deleteOrientation);

export default router;
