import { sendEmail } from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";

export async function sendverificationCode(verificationCode,email, res) {

    try{
        const message = generateVerificationOtpEmailTemplate(verificationCode);
        await sendEmail({
            email,
            subject: "Verification Code (DTUsocksUnited)",
            message,
        });
        res.status(200).json({
            success: true,
            message: "Verification code sent successfully.",
        });
    } catch(error){
        console.error("Error sending verification email:", error);
        return res.status(500).json({
            success: false,
            message: "Verification code failed to send.",
        });
    }

}