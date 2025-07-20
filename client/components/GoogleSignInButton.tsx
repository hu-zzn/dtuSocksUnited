"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface GoogleSignInButtonProps {
  callbackUrl?: string;
}

export function GoogleSignInButton({ callbackUrl = "/" }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl });
      // No need to manually redirect, NextAuth handles it
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2"
      variant="outline"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin h-4 w-4" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <img
            src="/google-icon.jpg"
            alt="Google"
            className="w-4 h-4"
          />
          <span>Sign in with Google</span>
        </>
      )}
    </Button>
  );
}
