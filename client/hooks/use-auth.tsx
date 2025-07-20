"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { authApi } from "../lib/apis";
import type { User } from "../types";

export function useAuth() {
  const { data: googleSession, status: googleStatus } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isGoogleUser = !!googleSession?.user;

  useEffect(() => {
    const init = async () => {
      try {
        if (isGoogleUser) {
          setUser({
            name: googleSession.user?.name || "",
            email: googleSession.user?.email || "",
            image: googleSession.user?.image || "",
          });
        } else {
          await getMe();
        }
      } catch (err) {
        console.log("No user session found");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [googleSession]);

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
      await authApi.login(email, password); // sets cookie
      await getMe();
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (isGoogleUser) {
      await signOut();
    } else {
      await authApi.logout();
    }
    setUser(null);
  };

  const loginWithGoogle = () => {
    signIn("google");
  };

  const getMe = async (): Promise<void> => {
    const res = await authApi.getMe();
    setUser(res.data.user);
  };

  return {
    user,
    loading: loading || googleStatus === "loading",
    isAuthenticated: !!user,
    register,
    verifyOTP,
    resendOTP,
    login,
    loginWithGoogle,
    logout,
    getMe,
  };
}
