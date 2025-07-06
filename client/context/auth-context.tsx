"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "../lib/apis";
import type { User } from "../types";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  getMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    getMe().finally(() => setLoading(false));
  }, []);

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    await authApi.register({ name, email, password });
    setLoading(false);
  };

  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
    const res = await authApi.verifyOTP(email, otp);
    setUser(res.data.user);
    setLoading(false);
  };

  const resendOTP = async (email: string) => {
    setLoading(true);
    await authApi.resendOTP(email);
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    await authApi.login(email, password);
    await getMe();
    setLoading(false);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, verifyOTP, resendOTP, getMe }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
