// client/app/login/page.tsx
"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
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
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // For local login button
    const [googleLoading, setGoogleLoading] = useState(false); // For Google login state

    // Corrected: Destructure 'getMe' from useAuth, not 'loadUser'
    const { login, isAuthenticated, getMe } = useAuth();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.refresh(); // Refresh to ensure latest auth state
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success("Logged in successfully!");
            router.refresh();
            router.push("/");
        } catch (err: any) {
            console.error("Local login error:", err);
            setError(err.message || "Login failed"); // err.message will come from AuthContext's re-throw
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (credentialResponse.credential) {
            setGoogleLoading(true); // Indicate Google login is in progress
            setError("");
            const idToken = credentialResponse.credential;

            try {
                const response = await fetch(`/api/auth/google/login`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json',},
                    credentials: 'include',
                    body: JSON.stringify({ id_token: idToken }),
                });

                const data = await response.json();

                if (response.ok) {
                    toast.success(data.message || 'Logged in with Google successfully!');
                    if (getMe) {
                        await getMe(); // Use getMe to update auth context after successful backend interaction
                    }
                    router.refresh();
                    router.push("/");
                } else {
                    setError(data.message || 'Google login failed on server.');
                    toast.error(data.message || 'Google login failed.');
                    console.error('Backend Google Login Error:', data);
                }
            } catch (err: any) {
                console.error('Error during Google login API call:', err);
                setError(err.message || 'An error occurred during Google login.');
                toast.error('An error occurred during Google login.');
            } finally {
                setGoogleLoading(false); // End Google login loading
            }
        }
    };

    const handleGoogleError = () => {
        setError("Google login failed. Please try again.");
        toast.error('Google login failed.');
        console.error('Google Login Failed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
            <Card className="w-full max-w-sm shadow-md border border-border bg-card">
                <CardHeader className="text-center mt-6 space-y-1">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Please login to continue
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive" className="border border-destructive bg-destructive/10">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="h-11 bg-card text-foreground border-border"
                        />

                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="h-11 bg-card text-foreground border-border pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </Button>
                        </div>

                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-muted-foreground hover:text-primary"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:opacity-90"
                            disabled={loading || googleLoading} // Disable if either login is in progress
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    {process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === "true" && (
                        <>
                            <div className="relative flex justify-center text-sm">
                                <span className="absolute px-2 text-muted-foreground bg-card -top-3">Or continue with</span>
                                <div className="flex-grow border-t border-border"></div>
                            </div>

                            <div className="flex justify-center">
                                {/* Corrected: Conditionally render the GoogleLogin component */}
                                {!(loading || googleLoading) ? ( // Only render GoogleLogin if no other login is in progress
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        // You can customize the button appearance here, e.g.:
                                        // shape="pill"
                                        // theme="outline"
                                        // text="signin_with"
                                        // size="large"
                                    />
                                ) : (
                                    // Render a disabled button or spinner if a login is in progress
                                    <Button
                                        disabled
                                        className="w-full h-11 rounded-full bg-gray-200 text-gray-500"
                                    >
                                        {loading ? "Logging in..." : "Signing in with Google..."}
                                    </Button>
                                )}
                            </div>
                        </>
                    )}

                    <div className="text-center text-sm text-muted-foreground">
                        Don’t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:underline"
                        >
                            Create one
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}