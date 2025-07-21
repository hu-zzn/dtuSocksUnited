// server/routes/AuthRouter.js
import express from "express";
import {
    logout,
    login,
    register,
    verifyOTP,
    getUser,
    forgotPassword,
    resetPassword,
    updatePassword,
    resendOtp,
    googleLogin, // NEW IMPORT for Google login
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.post("/login", login);

// NEW ROUTE for Google login (frontend will POST the ID token here)
router.post("/auth/google/login", googleLogin);

router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

export default router;