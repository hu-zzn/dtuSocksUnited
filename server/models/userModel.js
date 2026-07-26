// server/models/userModel.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const getJwtToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

export const generateVerificationCode = () => {
  function generateRandomFiveDigitNumber() {
    return Math.floor(Math.random() * 90000) + 10000;
  }

  const verificationCode = generateRandomFiveDigitNumber();
  const verificationCodeExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
  return { verificationCode, verificationCodeExpire };
};

export const getResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  return { resetToken, resetPasswordToken, resetPasswordExpire };
};

export const mapUserFromDb = (dbUser) => {
  if (!dbUser) return null;
  const user = {
    _id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    password: dbUser.password, // Keep the hashed password inside the mapped user for bcrypt check
    googleId: dbUser.google_id,
    role: dbUser.role || "User",
    accountVerified: dbUser.account_verified || false,
    avatar: {
      public_id: dbUser.avatar_public_id || "_",
      url: dbUser.avatar_url || "_"
    },
    verificationCode: dbUser.verification_code,
    verificationCodeExpire: dbUser.verification_code_expire,
    resetPasswordToken: dbUser.reset_password_token,
    resetPasswordExpire: dbUser.reset_password_expire,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at
  };

  // Attach instance method to behave like Mongoose document instance
  user.getJwtToken = function () {
    return getJwtToken(this._id);
  };

  return user;
};

export const mapUserToDb = (user) => {
  if (!user) return null;
  const dbUser = {};
  if (user._id) dbUser.id = user._id;
  if (user.name !== undefined) dbUser.name = user.name;
  if (user.email !== undefined) dbUser.email = user.email;
  if (user.password !== undefined) dbUser.password = user.password;
  if (user.googleId !== undefined) dbUser.google_id = user.googleId;
  if (user.role !== undefined) dbUser.role = user.role;
  if (user.accountVerified !== undefined) dbUser.account_verified = user.accountVerified;
  
  if (user.avatar !== undefined) {
    dbUser.avatar_public_id = user.avatar.public_id;
    dbUser.avatar_url = user.avatar.url;
  }
  
  if (user.verificationCode !== undefined) dbUser.verification_code = user.verificationCode;
  if (user.verificationCodeExpire !== undefined) dbUser.verification_code_expire = user.verificationCodeExpire;
  if (user.resetPasswordToken !== undefined) dbUser.reset_password_token = user.resetPasswordToken;
  if (user.resetPasswordExpire !== undefined) dbUser.reset_password_expire = user.resetPasswordExpire;
  return dbUser;
};