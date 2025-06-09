import express from "express";
import { toggleCart, showCart } from "../controllers/cartController.js";
import { isAuthenticated, isAuthorized} from "../middlewares/authMiddleware.js";
const router = express.Router();


router.post("/toggle", isAuthenticated, toggleCart);
router.get("/show", isAuthenticated, showCart);

export default router;