import express from "express";
import{
    logout,
    login,
    register,
    verifyOTP,
    getUser,
    forgotPassword,
    resetPassword,
    updatePassword,
    resendOtp
} from "../controllers/authController.js";
import{ isAuthenticated } from "../middlewares/authMiddleware.js";
import { googleAuth } from "../controllers/authController.js";






const router = express.Router();

router.post("/register",register);
router.post("/verify-otp",verifyOTP);
router.post("/resend-otp",resendOtp);
router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/me",isAuthenticated,getUser);
router.post("/password/forgot",forgotPassword);
router.put("/reset-password/:token",resetPassword);
router.put("/password/update",isAuthenticated, updatePassword);
router.post("/google-login", googleAuth);

export default router;