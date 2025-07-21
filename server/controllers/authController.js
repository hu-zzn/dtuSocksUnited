// server/controllers/authController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto"; // Removed generateKey as it's not used directly from crypto
import { sendverificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { OAuth2Client } from "google-auth-library"; // NEW IMPORT for Google OAuth

// Initialize Google OAuth2Client with your client ID
// Ensure process.env.GOOGLE_CLIENT_ID is loaded in your app.js or server.js
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler("Please enter all fields.", 400));
        }

        // ✅ Block if already registered and verified
        // Also check if a googleId exists for this email, indicating it's a social account
        const isRegistered = await User.findOne({
            email,
            $or: [{ accountVerified: true }, { googleId: { $exists: true, $ne: null } }],
        });

        if (isRegistered) {
            return next(new ErrorHandler("User already exists", 400));
        }

        // ✅ Check if unverified user already exists (for local signup)
        const unverifiedUser = await User.findOne({ email, accountVerified: false });

        if (unverifiedUser) {
            // ✅ Resend OTP
            const verificationCode = await unverifiedUser.generateVerificationCode();
            await unverifiedUser.save();

            sendverificationCode(verificationCode, email, res, {
                message: "Verification code resent. Please verify your email.",
                userAlreadyExists: true, // helpful for frontend redirect logic
            });
            return;
        }

        // ✅ Limit registration attempts
        const registrationAttemptsByUser = await User.find({ email, accountVerified: false });
        if (registrationAttemptsByUser.length >= 500) {
            return next(
                new ErrorHandler(
                    "You have exceeded the number of registration attempts. Please contact support.",
                    400
                )
            );
        }

        if (password.length < 4 || password.length > 16) {
            return next(
                new ErrorHandler("Password must be between 4 and 16 characters.", 400)
            );
        }

        // ✅ Register new user (local signup)
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            // avatar: { public_id: "...", url: "..." } // You might want to add default avatar logic here
        });

        const verificationCode = await user.generateVerificationCode();
        await user.save();
        sendverificationCode(verificationCode, email, res, {
            message: "Registered successfully. Please verify your email.",
            userAlreadyExists: false,
        });
    } catch (error) {
        next(error);
    }
});


export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return next(new ErrorHandler("Email or otp is missing.", 400));
    }
    try {
        // Find the most recent unverified user entry for this email
        const userAllEntries = await User.find({
            email,
            accountVerified: false,
            googleId: { $exists: false }, // Only target local unverified accounts
        }).sort({ createdAt: -1 });

        if (!userAllEntries || userAllEntries.length === 0) {
            return next(new ErrorHandler("User not found or already verified.", 400));
        }

        let user;
        // If multiple unverified entries, take the latest and clean up others
        if (userAllEntries.length > 1) {
            user = userAllEntries[0];
            await User.deleteMany({
                _id: { $ne: user._id },
                email,
                accountVerified: false,
                googleId: { $exists: false },
            });
        }
        else {
            user = userAllEntries[0];
        }

        if (user.verificationCode !== Number(otp)) {
            return next(new ErrorHandler("Invalid OTP", 400))
        }
        const currentTime = Date.now();

        const verificationCodeExpire = new Date(
            user.verificationCodeExpire
        ).getTime();

        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("OTP expired.", 400));
        }
        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;

        await user.save({ validateModifiedOnly: true });

        sendToken(user, 200, "Account Verified.", res);


    } catch (error) {
        return next(new ErrorHandler("Internal Server error", 500));
    }
});

// Wrapped login with catchAsyncErrors for consistency
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields.", 400));
    }

    // Find user with email and ensured they are accountVerified or are a Google user
    const user = await User.findOne({
        email,
        $or: [{ accountVerified: true }, { googleId: { $exists: true, $ne: null } }],
    }).select("+password"); // Select password for comparison

    if (!user) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    // If user has a googleId but no password, they can't log in locally
    if (user.googleId && !user.password) {
        return next(new ErrorHandler("Please log in with Google for this account.", 400));
    }

    // If user has a password, compare it
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    sendToken(user, 200, "User login successfully.", res);
});


export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ success: true, message: "Logged out" });
};

export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user; // Assuming req.user is set by your authentication middleware
    if (!user) {
        return next(new ErrorHandler("User not found or not logged in.", 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.email) {
        return next(new ErrorHandler("Email is required.", 400));
    }
    // Ensure that only verified accounts (local or Google) can request password reset
    const user = await User.findOne({
        email: req.body.email,
        $or: [{ accountVerified: true }, { googleId: { $exists: true, $ne: null } }],
    });
    if (!user) {
        return next(new ErrorHandler("Invalid email.", 400));
    }

    // If it's a Google-only account (no password), inform user to use Google login
    if (user.googleId && !user.password) {
        return next(new ErrorHandler("This account is registered via Google. Please use Google login.", 400));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false }); // Typo fix: validationBeforeSave -> validateBeforeSave
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Recovery (DTUsocksUnited)",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined,
            user.resetPasswordExpire = undefined,
            await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler("Reset password token is invalid or has been expired.", 400)
        );
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(
            new ErrorHandler("Password & confirm password do not match.", 400)
        );
    }
    if (req.body.password.length < 4 || req.body.password.length > 16 || req.body.confirmPassword.length < 4 || req.body.confirmPassword.length > 16) {
        return next(new ErrorHandler("Password must be between 4 and 16.", 400));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, "Password reset successfully.", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user._id).select("+password");
    if (!user) { // Added a check for user existence
        return next(new ErrorHandler("User not found.", 404));
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please enter all fields.", 400));
    }
    // If the user has a googleId but no local password, they can't change password
    if (user.googleId && !user.password) {
        return next(new ErrorHandler("This account does not have a local password to update. Please use Google login.", 400));
    }

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Current password is incorrect.", 400));
    }
    if (newPassword.length < 4 || newPassword.length > 16 || confirmNewPassword.length < 4 || confirmNewPassword.length > 16) {
        return next(new ErrorHandler("Password must be between 4 and 16.", 400));
    }
    if (newPassword !== confirmNewPassword) {
        return next(
            new ErrorHandler("New Password & confirm new password do not match.", 400)
        );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: "password updated.",
    });
});

export const resendOtp = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Email is required.", 400));
    }

    // Only resend OTP for accounts that are not verified and don't have a googleId
    const user = await User.findOne({ email, accountVerified: false, googleId: { $exists: false } });

    if (!user) {
        return next(new ErrorHandler("No unverified local account found with this email.", 400));
    }

    // Optional: add cooldown check here if you want (not required for now)

    const newOtp = await user.generateVerificationCode();
    await user.save();

    sendverificationCode(newOtp, email, res);
});


// NEW FUNCTION: Google Sign-In/Sign-Up
export const googleLogin = catchAsyncErrors(async (req, res, next) => {
    const { id_token } = req.body; // Expecting the ID token from the frontend

    if (!id_token) {
        return next(new ErrorHandler("Google ID token is required", 400));
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        });

        const payload = ticket.getPayload();
        // Check if payload or required fields are missing
        if (!payload || !payload.sub || !payload.email || !payload.name) {
            console.error("Incomplete Google payload:", payload);
            return next(new ErrorHandler("Google login failed: Incomplete user data from Google.", 401));
        }

        const { sub: googleId, email, name, picture: avatarUrl } = payload;

        // 1. Check if user exists with this Google ID
        let user = await User.findOne({ googleId });

        if (user) {
            // User exists, log them in
            sendToken(user, 200, "Logged in with Google successfully.", res);
        } else {
            // 2. User with Google ID not found, check if user exists with this email
            let existingUserByEmail = null;
            if (email) {
                existingUserByEmail = await User.findOne({ email });
            }

            if (existingUserByEmail) {
                // If a user with this email already exists, link the Google ID to their account
                existingUserByEmail.googleId = googleId;
                // Optionally update name/avatar if they are empty
                if (!existingUserByEmail.name) existingUserByEmail.name = name;
                if (!existingUserByEmail.avatar || !existingUserByEmail.avatar.url) {
                    existingUserByEmail.avatar = { public_id: "google_avatar", url: avatarUrl };
                }
                // Mark account as verified if it wasn't
                existingUserByEmail.accountVerified = true;
                // Clear any lingering OTP data if linking an unverified local account
                existingUserByEmail.verificationCode = undefined;
                existingUserByEmail.verificationCodeExpire = undefined;

                await existingUserByEmail.save({ validateBeforeSave: false }); // Bypass password validation
                user = existingUserByEmail;
            } else {
                // 3. Neither Google ID nor email found, create a new user
                user = await User.create({
                    googleId: googleId,
                    name: name,
                    email: email,
                    // Password can be omitted or set to undefined, as it's a Google login
                    password: undefined, // Explicitly set to undefined
                    avatar: {
                        public_id: "google_avatar",
                        url: avatarUrl,
                    },
                    role: "User", // Default role
                    accountVerified: true, // Google accounts are considered verified
                });
            }
            sendToken(user, 200, "Logged in with Google successfully.", res);
        }
    } catch (error) {
        console.error("Google Token Verification Error:", error);
        // More specific error messages for debugging
        if (error.code === 'ERR_JWT_EXPIRED') {
            return next(new ErrorHandler("Google login failed: Token expired.", 401));
        }
        if (error.code === 'ERR_JWT_AUDIENCE') {
            return next(new ErrorHandler("Google login failed: Invalid client ID.", 401));
        }
        return next(new ErrorHandler("Google login failed: Invalid token or server error.", 401));
    }
});