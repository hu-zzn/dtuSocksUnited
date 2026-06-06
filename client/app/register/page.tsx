// client/app/register/page.tsx
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
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react"; // Renamed User to UserIcon to avoid conflict
import { useAuth } from "../../context/auth-context";
import { GoogleLogin } from "@react-oauth/google"; // NEW IMPORT for Google Login
import toast from "react-hot-toast"; // NEW IMPORT for toast notifications

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "", password: "",
        confirmPassword: "",
    });
    const [step, setStep] = useState<"register" | "verify">("register");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false); // For local registration/OTP verification
    const [googleLoading, setGoogleLoading] = useState(false); // NEW STATE: For Google sign-up/sign-in loading

    const router = useRouter();
    // Destructure getMe as well, as it's needed after Google login
    const { register, verifyOTP, resendOTP, getMe } = useAuth();

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
            setStep("verify"); // Proceed to OTP verification for local registration
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
            toast.success("Account verified successfully!"); // Add toast for success
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

    // NEW: Google Sign-Up/Sign-In Logic (Similar to login page)
    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (credentialResponse.credential) {
            setGoogleLoading(true); // Indicate Google auth is in progress
            setError("");
            const idToken = credentialResponse.credential;

            try {
                // This is the SAME backend endpoint for Google login/registration
                const response = await fetch(`/api/auth/google/login`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json',},
                    credentials: 'include',
                    body: JSON.stringify({ id_token: idToken }),
                });

                const data = await response.json();

                if (response.ok) {
                    toast.success(data.message || 'Signed up and logged in with Google successfully!');
                    if (getMe) {
                        await getMe(); // Update auth context after successful backend interaction
                    }
                    router.refresh(); // Refresh to reflect new auth state
                    router.push("/"); // Redirect to home or dashboard after Google auth
                } else {
                    setError(data.message || 'Google registration/login failed on server.');
                    toast.error(data.message || 'Google registration/login failed.');
                    console.error('Backend Google Auth Error:', data);
                }
            } catch (err: any) {
                console.error('Error during Google auth API call:', err);
                setError(err.message || 'An error occurred during Google registration/login.');
                toast.error('An error occurred during Google registration/login.');
            } finally {
                setGoogleLoading(false); // End Google auth loading
            }
        }
    };

    const handleGoogleError = () => {
        setError("Google registration failed. Please try again.");
        toast.error('Google registration failed.');
        console.error('Google Auth Failed');
    };
    // END NEW Google Sign-Up/Sign-In Logic

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
            description="Join infoSoc and explore societies"
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
                    icon={<UserIcon className="icon" />} // Changed to UserIcon
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
                <Button className="w-full h-12" disabled={submitting || googleLoading}> {/* Disable if Google auth is loading */}
                    {submitting ? "Creating Account..." : "Create Account"}
                </Button>
            </form>

            {/* Separator for "Or" */}
            <div className="relative flex justify-center text-sm my-6"> {/* Added margin for spacing */}
                <span className="absolute px-2 text-muted-foreground bg-card -top-3">Or</span>
                <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Google Registration Button */}
            <div className="flex justify-center">
                {!(submitting || googleLoading) ? ( // Only render GoogleLogin if no other action is in progress
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="signup_with" // Suggests "Sign up with Google" text
                    // Optional button styling:
                    // shape="pill"
                    // theme="outline"
                    // size="large"
                    />
                ) : (
                    // Render a disabled button or spinner if an action is in progress
                    <Button
                        disabled
                        className="w-full h-11 rounded-full bg-gray-200 text-gray-500"
                    >
                        {submitting ? "Registering..." : "Signing up with Google..."}
                    </Button>
                )}
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                    Sign in
                </Link>
            </div>
        </CenteredCard>
    );
}

// ⛱️ Reusable wrapper
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

// 🧩 InputField component
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

// 👁️ ToggleEye component
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