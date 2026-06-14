// server/controllers/authController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { 
  mapUserFromDb, 
  generateVerificationCode, 
  getResetPasswordToken 
} from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendverificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { OAuth2Client } from "google-auth-library";
import { supabase } from "../database/supabaseClient.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler("Please enter all fields.", 400));
        }

        // Find user by email to check if already registered
        const { data: existingUser, error: findError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (findError) {
          return next(new ErrorHandler(findError.message, 500));
        }

        if (existingUser) {
            if (existingUser.account_verified || existingUser.google_id) {
                return next(new ErrorHandler("User already exists", 400));
            }

            // Resend OTP for existing unverified local account
            const { verificationCode, verificationCodeExpire } = generateVerificationCode();
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const { error: updateError } = await supabase
              .from("users")
              .update({
                name,
                password: hashedPassword,
                verification_code: verificationCode,
                verification_code_expire: verificationCodeExpire.toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq("id", existingUser.id);

            if (updateError) {
              return next(new ErrorHandler(updateError.message, 500));
            }

            sendverificationCode(verificationCode, email, res, {
                message: "Verification code resent. Please verify your email.",
                userAlreadyExists: true,
            });
            return;
        }

        if (password.length < 4 || password.length > 16) {
            return next(
                new ErrorHandler("Password must be between 4 and 16 characters.", 400)
            );
        }

        // Register new user (local signup)
        const id = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);
        const { verificationCode, verificationCodeExpire } = generateVerificationCode();

        const dbUser = {
            id,
            name,
            email,
            password: hashedPassword,
            role: "User",
            account_verified: false,
            verification_code: verificationCode,
            verification_code_expire: verificationCodeExpire.toISOString()
        };

        const { error: insertError } = await supabase
          .from("users")
          .insert(dbUser);

        if (insertError) {
          return next(new ErrorHandler(insertError.message, 500));
        }

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
        const { data: dbUser, error: findError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .eq("account_verified", false)
          .is("google_id", null)
          .maybeSingle();

        if (findError || !dbUser) {
            return next(new ErrorHandler("User not found or already verified.", 400));
        }

        if (dbUser.verification_code !== Number(otp)) {
            return next(new ErrorHandler("Invalid OTP", 400));
        }
        
        const currentTime = Date.now();
        const verificationCodeExpire = new Date(dbUser.verification_code_expire).getTime();

        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("OTP expired.", 400));
        }

        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({
            account_verified: true,
            verification_code: null,
            verification_code_expire: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", dbUser.id)
          .select()
          .single();

        if (updateError) {
          return next(new ErrorHandler(updateError.message, 500));
        }

        sendToken(mapUserFromDb(updatedUser), 200, "Account Verified.", res);
    } catch (error) {
        return next(new ErrorHandler("Internal Server error", 500));
    }
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields.", 400));
    }

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (findError || !dbUser) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    if (!dbUser.account_verified && !dbUser.google_id) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    if (dbUser.google_id && !dbUser.password) {
        return next(new ErrorHandler("Please log in with Google for this account.", 400));
    }

    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    sendToken(mapUserFromDb(dbUser), 200, "User login successfully.", res);
});

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: ".infosoc.in",
    });
    res.status(200).json({ success: true, message: "Logged out" });
};

export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
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

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", req.body.email)
      .maybeSingle();

    if (findError || !dbUser) {
        return next(new ErrorHandler("Invalid email.", 400));
    }

    if (!dbUser.account_verified && !dbUser.google_id) {
        return next(new ErrorHandler("Invalid email.", 400));
    }

    if (dbUser.google_id && !dbUser.password) {
        return next(new ErrorHandler("This account is registered via Google. Please use Google login.", 400));
    }

    const { resetToken, resetPasswordToken, resetPasswordExpire } = getResetPasswordToken();

    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_password_token: resetPasswordToken,
        reset_password_expire: resetPasswordExpire.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", dbUser.id);

    if (updateError) {
      return next(new ErrorHandler(updateError.message, 500));
    }

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email: dbUser.email,
            subject: "Password Recovery (infoSoc)",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${dbUser.email} successfully.`,
        });
    } catch (error) {
        await supabase
          .from("users")
          .update({
            reset_password_token: null,
            reset_password_expire: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", dbUser.id);

        return next(new ErrorHandler(error.message, 500));
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("reset_password_token", resetPasswordToken)
      .gt("reset_password_expire", new Date().toISOString())
      .maybeSingle();

    if (findError || !dbUser) {
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

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expire: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", dbUser.id)
      .select()
      .single();

    if (updateError) {
      return next(new ErrorHandler(updateError.message, 500));
    }

    sendToken(mapUserFromDb(updatedUser), 200, "Password reset successfully.", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please enter all fields.", 400));
    }

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user._id)
      .maybeSingle();

    if (findError || !dbUser) {
        return next(new ErrorHandler("User not found.", 404));
    }

    if (dbUser.google_id && !dbUser.password) {
        return next(new ErrorHandler("This account does not have a local password to update. Please use Google login.", 400));
    }

    const isPasswordMatched = await bcrypt.compare(currentPassword, dbUser.password);
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
    
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq("id", dbUser.id);

    if (updateError) {
      return next(new ErrorHandler(updateError.message, 500));
    }

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

    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("account_verified", false)
      .is("google_id", null)
      .maybeSingle();

    if (findError || !dbUser) {
        return next(new ErrorHandler("No unverified local account found with this email.", 400));
    }

    const { verificationCode, verificationCodeExpire } = generateVerificationCode();
    
    const { error: updateError } = await supabase
      .from("users")
      .update({
        verification_code: verificationCode,
        verification_code_expire: verificationCodeExpire.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", dbUser.id);

    if (updateError) {
      return next(new ErrorHandler(updateError.message, 500));
    }

    sendverificationCode(verificationCode, email, res);
});

export const googleLogin = catchAsyncErrors(async (req, res, next) => {
    const { id_token } = req.body;
    console.log("🟢 Received Google login request", id_token ? "Token received" : "No token provided");

    if (!id_token) {
        console.error("❌ Google login failed: ID token missing");
        return next(new ErrorHandler("Google ID token is required", 400));
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("🟢 Google payload received:", payload);

        if (!payload || !payload.sub || !payload.email || !payload.name) {
            console.error("❌ Incomplete Google payload:", payload);
            return next(new ErrorHandler("Google login failed: Incomplete user data from Google.", 401));
        }

        const { sub: googleId, email, name, picture: avatarUrl } = payload;

        console.log(`🟢 Checking user existence: googleId=${googleId}, email=${email}`);

        const { data: userByGoogle, error: err1 } = await supabase
          .from("users")
          .select("*")
          .eq("google_id", googleId)
          .maybeSingle();

        if (userByGoogle) {
            console.log("🟢 Existing Google user found, logging in.");
            return sendToken(mapUserFromDb(userByGoogle), 200, "Logged in with Google successfully.", res);
        }

        const { data: userByEmail, error: err2 } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (userByEmail) {
            console.log("🟢 Email found without GoogleId, linking account.");
            
            const { data: updatedUser, error: updateError } = await supabase
              .from("users")
              .update({
                google_id: googleId,
                account_verified: true,
                updated_at: new Date().toISOString()
              })
              .eq("id", userByEmail.id)
              .select()
              .single();

            if (updateError) {
              return next(new ErrorHandler(updateError.message, 500));
            }

            return sendToken(mapUserFromDb(updatedUser), 200, "Logged in with Google successfully.", res);
        }

        console.log("🟢 New Google user, creating account.");
        const id = crypto.randomUUID();
        
        const dbUser = {
          id,
          google_id: googleId,
          name,
          email,
          avatar_public_id: "google_avatar",
          avatar_url: avatarUrl,
          role: "User",
          account_verified: true
        };

        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert(dbUser)
          .select()
          .single();

        if (insertError) {
          return next(new ErrorHandler(insertError.message, 500));
        }

        console.log("🟢 New Google account created.");
        return sendToken(mapUserFromDb(newUser), 200, "Logged in with Google successfully.", res);
    } catch (error) {
        console.error("❌ Google Token Verification Error:", error);
        return next(new ErrorHandler("Google login failed: Invalid token or server error.", 401));
    }
});
