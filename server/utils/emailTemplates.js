export function generateVerificationOtpEmailTemplate(otpCode) {
  if (!otpCode || typeof otpCode !== 'string') {
    throw new Error('Invalid or missing OTP code');
  }
  const safeOtpCode = otpCode.replace(/[<>]/g, ''); // Basic XSS prevention

  return `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">
      <!-- Header -->
      <div style="background-color: #ff6f61; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">DTUsocksUnited</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; text-align: center; background-color: #f9f9f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <h2 style="color: #333333; font-size: 22px; margin-bottom: 20px;">Verify Your Email Address</h2>
        <p style="color: #555555; font-size: 16px; margin-bottom: 10px;">Dear Student,</p>
        <p style="color: #555555; font-size: 16px; margin-bottom: 20px;">
          To complete your registration or login, please use the One-Time Password (OTP) below:
        </p>

        <!-- OTP Code -->
        <div style="display: inline-block; background-color: #ffffff; padding: 15px 30px; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <span style="font-size: 28px; font-weight: bold; color: #ff6f61; letter-spacing: 5px;" role="text">
            ${safeOtpCode}
          </span>
        </div>

        <!-- Instructions -->
        <p style="color: #777777; font-size: 14px; margin-bottom: 10px;">
          This code is valid for <strong>15 minutes</strong>. Please do not share it with anyone.
        </p>
        <p style="color: #777777; font-size: 14px; margin-bottom: 20px;">
          If you did not request this email, please ignore it or contact us.
        </p>

        <!-- Footer -->
        <div style="border-top: 1px solid #dddddd; padding-top: 20px;">
          <p style="color: #666666; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong>DTUsocksUnited Team</strong>
          </p>
          <p style="color: #999999; font-size: 12px; margin: 10px 0 0;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `;
};


export function generateForgotPasswordEmailTemplate(resetPasswordUrl){
    return `this is your password reset url:   ${resetPasswordUrl}`
}