"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../context/auth-context";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState<"register" | "verify">("register");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { register, verifyOTP, resendOTP } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await verifyOTP(formData.email, otp);
      router.push("/login?message=Registration successful!");
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    try {
      await resendOTP(formData.email);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  const renderError = () =>
    error && (
      <Alert variant="destructive" className="border border-destructive bg-destructive/10">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  if (step === "verify") {
    return (
      <CenteredCard
        title="Verify Your Email"
        description={`We've sent a 6-digit OTP to ${formData.email}`}
      >
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          {renderError()}
          <InputField
            id="otp"
            name="otp"
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOtp(e.target.value)
            }
            maxLength={6}
            required
            centered
          />
          <Button className="w-full h-12" disabled={submitting || otp.length !== 6}>
            {submitting ? "Verifying..." : "Verify Email"}
          </Button>
          <div className="text-center">
            <Button
              variant="link"
              type="button"
              onClick={handleResendOTP}
              className="text-sm text-muted-foreground"
            >
              Resend Code
            </Button>
          </div>
        </form>
      </CenteredCard>
    );
  }

  return (
    <CenteredCard
      title="Create Account"
      description="Join UnifyDTU and explore societies"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderError()}
        <InputField
          id="name"
          name="name"
          label="Full Name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          icon={<User className="icon" />}
          required
        />
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email"
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
            <ToggleEye onClick={() => setShowPassword((v) => !v)} visible={showPassword} />
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

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </CenteredCard>
  );
}

// ✅ Reusable wrapper
const CenteredCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
    <Card className="w-full max-w-md border border-border bg-card">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </div>
);

// ✅ Input Field abstraction
const InputField = ({
  id,
  label,
  icon,
  rightIcon,
  centered = false,
  ...rest
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  centered?: boolean;
  [key: string]: any;
}) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="text-foreground font-medium">
      {label}
    </Label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <Input
        id={id}
        {...rest}
        className={`h-11 bg-card text-foreground border border-border rounded-full w-full
          ${icon ? "pl-12" : ""} 
          ${rightIcon ? "pr-12" : ""} 
          ${centered ? "text-center text-lg tracking-widest" : ""}
        `}
      />
      {rightIcon && (
        <div className="absolute right-0 top-0 h-full flex items-center pr-4">
          {rightIcon}
        </div>
      )}
    </div>
  </div>
);

// 👁️ ToggleEye for password show/hide
const ToggleEye = ({
  onClick,
  visible,
}: {
  onClick: () => void;
  visible: boolean;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="hover:bg-transparent"
    onClick={onClick}
  >
    {visible ? (
      <EyeOff className="w-5 h-5 text-muted-foreground" />
    ) : (
      <Eye className="w-5 h-5 text-muted-foreground" />
    )}
  </Button>
);
