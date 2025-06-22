"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useAuth } from "../../hooks/use-auth"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"register" | "verify">("register")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
 const { register, verifyOTP, resendOTP, loading } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setSubmitting(true)
    try {
      await register(formData.name, formData.email, formData.password)
      setStep("verify")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await verifyOTP(formData.email, otp)
      router.push("/login?message=Registration successful! Please login.")
    } catch (err: any) {
      setError(err.message || "OTP verification failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    setError("")
    try {
      await resendOTP(formData.email)
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
    }
  }

  const renderError = () =>
    error && (
      <Alert variant="destructive" className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    )

  if (step === "verify") {
    return (
      <CenteredCard title="Verify Your Email" description={`We've sent a verification code to ${formData.email}`}>
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          {renderError()}
          <InputField
            id="otp"
            name="otp"  // ✅ Add this
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
            maxLength={6}
            required
            centered
          />
          <Button className="w-full h-12" disabled={submitting || otp.length !== 6}>
            {submitting ? "Verifying..." : "Verify Email"}
          </Button>
          <div className="text-center">
            <Button variant="link" onClick={handleResendOTP} type="button" className="text-sm text-gray-600">
              Resend Code
            </Button>
          </div>
        </form>
      </CenteredCard>
    )
  }

  return (
    <CenteredCard title="Create Account" description="Join our community and discover amazing societies">
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderError()}

        <InputField
          id="name"
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          icon={<User className="icon" />}
          required
        />
        <InputField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={<Mail className="icon" />}
          required
        />
        <InputField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock className="icon" />}
          rightIcon={
            <ToggleEye onClick={() => setShowPassword(!showPassword)} visible={showPassword} />
          }
          required
        />
        <InputField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<Lock className="icon" />}
          required
        />

        <Button className="w-full h-12" disabled={submitting}>
          {submitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-black hover:text-gray-700 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </CenteredCard>
  )
}

// Reusable centered card component
const CenteredCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <Card className="w-full max-w-md border-gray-200 shadow-xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-light text-gray-900">{title}</CardTitle>
        <CardDescription className="text-gray-600 font-light">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </div>
)

// Reusable input field component
const InputField = ({
  id, label, icon, rightIcon, centered = false, ...rest
}: any) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-gray-700 font-medium">{label}</Label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
      <Input
        id={id}
        {...rest}
        className={`${icon ? "pl-12" : ""} ${rightIcon ? "pr-12" : ""} h-12 border-gray-200 rounded-xl bg-white focus:border-gray-400 ${centered ? "text-center text-lg tracking-widest" : ""}`}
      />
      {rightIcon && <div className="absolute right-0 top-0 h-full flex items-center pr-4">{rightIcon}</div>}
    </div>
  </div>
)

// Password eye toggle component
const ToggleEye = ({ onClick, visible }: { onClick: () => void; visible: boolean }) => (
  <Button type="button" variant="ghost" size="sm" className="hover:bg-transparent" onClick={onClick}>
    {visible ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
  </Button>
)
