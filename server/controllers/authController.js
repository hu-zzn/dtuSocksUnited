import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto, { generateKey } from "crypto";
import { sendverificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all fields.", 400));
    }

    // ✅ Block if already registered and verified
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // ✅ Check if unverified user already exists
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

    // ✅ Register new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
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
        const userAllEntries = await User.find({
            email,
            accountVerified: false,
        }).sort({ createdAt: -1 });

        if (!userAllEntries || userAllEntries.length === 0) {
            return next(new ErrorHandler("User not found.", 400));
        }

        let user;

        if (userAllEntries.length > 1) {
            user = userAllEntries[0];
            await User.deleteMany({
                _id: { $ne: user._id },
                email,
                accountVerified: false,
            });
        }
        else {
            user = userAllEntries[0];
        }

        if (user.verificationCode !== Number(otp)) {
            return next(new ErrorHandler("Invaild OTP", 400))
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
export const login = async (req, res, next) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }

    const user = await User.findOne({ email, accountVerified: true }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    sendToken(user, 200, "User login successfully.", res);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) =>{
    if(!req.body.email){
        return next(new ErrorHandler("Email is required.", 400));
    }
    const user = await User.findOne({
        email:req.body.email,
        accountVerified:true,
    });
    if(!user){
        return next(new ErrorHandler("Invalid email.",400));
    }
    const resetToken = user.getResetPasswordToken();

    await user.save ({ validationBeforeSave : false });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try{
        await sendEmail({
            email: user.email,
            subject: "Password Recovery (DTUsocksUnited)",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
        });
    } catch (error){
        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined,
        await user.save({ validateBeforeSave: false});
        return next (new ErrorHandler(error.message, 500));
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next)=>{
    const {token} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    
    if(!user) {
        return next(
            new ErrorHandler("Reset password token is invalid or has been expired.", 400)
        );
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(
            new ErrorHandler("Password & confirm password do not match.", 400)
        );
    }
    if(req.body.password.length < 4 || req.body.password.length > 16|| req.body.confirmPassword.length < 4|| req.body.confirmPassword.length > 16){
        return next(new ErrorHandler("Password must be between 4 and 16.", 400));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200, "Password reset successfully.",res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next)=>{

    const user = await User.findById(req.user._id).select("+password");
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if(!currentPassword || !newPassword || !confirmNewPassword){
        return next(new ErrorHandler("Please enter all fields.", 400));
    }
    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Current password is incorrect.", 400));
    }
    if(newPassword.length < 4 || newPassword.length > 16 || confirmNewPassword.length < 4 || confirmNewPassword.length > 16){
        return next(new ErrorHandler("Password must be between 4 and 16.", 400));
    }
     if(newPassword !== confirmNewPassword){
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

    const user = await User.findOne({ email, accountVerified: false });

    if (!user) {
        return next(new ErrorHandler("No unverified account found with this email.", 400));
    }

    // Optional: add cooldown check here if you want (not required for now)

    const newOtp = await user.generateVerificationCode();
    await user.save();

    sendverificationCode(newOtp, email, res);
});



