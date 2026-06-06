import { sendEmail } from "./sendEmail";
import { generateVerificationOtpEmailTemplate } from "./emailTemplates";

export async function sendVerificationCode(
  verificationCode: number,
  email: string
): Promise<void> {
  const message = generateVerificationOtpEmailTemplate(verificationCode);
  await sendEmail({
    email,
    subject: "Verification Code (infoSoc)",
    message,
  });
}
