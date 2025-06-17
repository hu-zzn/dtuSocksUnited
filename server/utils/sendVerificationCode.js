import { sendEmail } from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";

export async function sendverificationCode(verificationCode, email, res, meta = {}) {
  try {
    const message = generateVerificationOtpEmailTemplate(verificationCode);

    await sendEmail({
      email,
      subject: "Verification Code (DTUsocksUnited)",
      message,
    });

    res.status(200).json({
      success: true,
      email,
      message: meta.message || "Verification code sent successfully.",
      ...meta, // allows things like `userAlreadyExists: true` to be sent
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
}