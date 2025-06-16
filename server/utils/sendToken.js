export const sendToken = (user, statusCode, message, res) => {
  const token = user.getJWTToken(); // ✅ uses getJWTToken method
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      user,
    });
};