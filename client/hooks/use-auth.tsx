"use client";

import { useState } from "react";
import { authApi } from "../lib/apis";
import type { User } from "../types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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
      await authApi.login(email, password); // ✅ Cookie stored by browser
      await getMe(); // ✅ Get user data from backend
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await authApi.logout();
    setUser(null);
  };

  const getMe = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await authApi.getMe();
      setUser(res.data.user);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    register,
    verifyOTP,
    resendOTP,
    login,
    logout,
    getMe,
  };
}
