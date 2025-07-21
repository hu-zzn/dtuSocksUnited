// server/models/userModel.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// import bcrypt from "bcryptjs"; // You might need this if you manually hash passwords for local signup

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      // password is NOT required if googleId is present.
      // We will handle validation with a custom validator or in pre-save hook.
      select: false,
    },
    // NEW FIELD FOR GOOGLE AUTH
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values, so users without googleId don't cause unique constraint errors
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Society",
      },
    ],
    avatar: {
      public_id: String,
      url: String,
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to handle password hashing for local users
// If you are using `bcryptjs` for password hashing, uncomment the import above and add this:
/*
userSchema.pre("save", async function(next) {
    // Only hash the password if it's modified and it's not a Google-only login
    // For Google logins, the password field might be empty or a placeholder
    if (!this.isModified("password")) {
        return next();
    }
    // Only hash if password exists (i.e., it's a local user or google user setting a password later)
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
*/

// Method to compare password (for local login)
// If you use bcryptjs, your comparePassword method would look like this:
/*
userSchema.methods.comparePassword = async function(enteredPassword) {
    if (!this.password) return false; // If no password stored, can't compare
    return await bcrypt.compare(enteredPassword, this.password);
};
*/

// ✅ Generate JWT
userSchema.methods.getJwtToken = function () {
  // Ensure process.env.JWT_SECRET_KEY is defined in your config.env
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE, // Add expiry from your config
    });
};

// ✅ Generate OTP
userSchema.methods.generateVerificationCode = async function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(4, "0");

    return parseInt(firstDigit + remainingDigits);
  }

  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  return verificationCode;
};

// ✅ Generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

// Export the model as `User` for consistency with your existing code
export const User = mongoose.model("User", userSchema);