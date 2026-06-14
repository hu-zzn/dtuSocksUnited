import crypto from "crypto";

export interface DbUser {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  google_id: string | null;
  role: string | null;
  account_verified: boolean | null;
  avatar_public_id: string | null;
  avatar_url: string | null;
  verification_code: number | null;
  verification_code_expire: string | null;
  reset_password_token: string | null;
  reset_password_expire: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface MappedUser {
  _id: string;
  name: string | null;
  email: string;
  password?: string | null;
  googleId: string | null;
  role: string;
  accountVerified: boolean;
  avatar: { public_id: string; url: string };
  verificationCode: number | null;
  verificationCodeExpire: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpire: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export const mapUserFromDb = (dbUser: DbUser | null): MappedUser | null => {
  if (!dbUser) return null;
  return {
    _id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    password: dbUser.password,
    googleId: dbUser.google_id,
    role: dbUser.role || "User",
    accountVerified: dbUser.account_verified || false,
    avatar: {
      public_id: dbUser.avatar_public_id || "_",
      url: dbUser.avatar_url || "_",
    },
    verificationCode: dbUser.verification_code,
    verificationCodeExpire: dbUser.verification_code_expire,
    resetPasswordToken: dbUser.reset_password_token,
    resetPasswordExpire: dbUser.reset_password_expire,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
  };
};

export const generateVerificationCode = () => {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(4, "0");
  const verificationCode = parseInt(`${firstDigit}${remainingDigits}`, 10);
  const verificationCodeExpire = new Date(Date.now() + 15 * 60 * 1000);
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

export const generateUUID = (): string => crypto.randomUUID();
