export const sendToken = (user, statusCode, message, res) => {
  try {
    const token = user.getJwtToken();

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None", // ✅ for cross-origin cookies
      domain: ".infosoc.in", // ✅ share cookies between infosoc.in and api.infosoc.in
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

