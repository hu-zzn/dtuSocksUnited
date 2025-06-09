export function generateVerificationOtpEmailTemplate(otpCode){
    return `your otp is: ${otpCode}`
}


export function generateForgotPasswordEmailTemplate(resetPasswordUrl){
    return `this is your password reset url:   ${resetPasswordUrl}`
}