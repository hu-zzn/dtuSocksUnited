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

// THIS IS THE CORRECT ROUTE FOR GOOGLE LOGIN
// The full path will be /api/v1/auth/google/login because of app.use("/api/v1/auth", authRouter); in app.js
router.post("/auth/google/login", googleLogin);

router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

// Add other admin routes if you have them, e.g.:
// router.route("/admin/users").get(isAuthenticated, authorizeRoles("admin"), getAllUser);
// ...

export default router;