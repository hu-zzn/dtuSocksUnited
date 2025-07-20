"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { authApi } from "../lib/apis";
import type { User } from "../types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession(); // ✅ Google session

  useEffect(() => {
    const init = async () => {
      try {
        // ✅ If Google user is signed in, try to sync with backend
        if (session?.user?.email) {
          await getMe();
        }
      } catch (err) {
        console.log("No backend session found");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [session]); // re-run if session changes

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await authApi.register({ name, email, password });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await authApi.verifyOTP(email, otp);
      setUser(res.data.user);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email: string): Promise<void> => {
    setLoading(true);
    try {
      await authApi.resendOTP(email);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await authApi.login(email, password);
      await getMe();
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      await signIn("google"); // Will redirect
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await authApi.logout(); // optional: clear your cookie/session
    await signOut(); // clears Google session
    setUser(null);
  };

  const getMe = async (): Promise<void> => {
    const res = await authApi.getMe(); // expects session from cookie
    setUser(res.data.user);
  };

  return {
    user,
    loading: loading || status === "loading",
    register,
    verifyOTP,
    resendOTP,
    login,
    loginWithGoogle,
    logout,
    getMe,
    googleSession: session?.user ?? null, // expose google session info
  };
}
