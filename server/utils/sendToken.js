// export const sendToken = (user, statusCode, message, res) => {
//   try {
//     const token = user.getJwtToken();

//     const options = {
//       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//     };

//     res.status(statusCode)
//       .cookie("token", token, options)
//       .json({
//         success: true,
//         message,
//         user,
//       });

//   } catch (err) {
//     console.error("🔥 Error generating token:", err);
//     res.status(500).json({ success: false, message: "Token generation failed", error: err.message });
//   }
// };

export const sendToken = (user, statusCode, message, res) => {
  try {
    const token = user.getJwtToken();

    const options = {
      httpOnly: true,
      secure: true,            // ✅ Always true for HTTPS (Render is HTTPS)
      sameSite: "None",        // ✅ Required for cross-origin cookies
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    res.status(statusCode)
      .cookie("token", token, options)
      .json({
        success: true,
        message,
        user,
      });

  } catch (err) {
    console.error("🔥 Error generating token:", err);
    res.status(500).json({ success: false, message: "Token generation failed", error: err.message });
  }
};

