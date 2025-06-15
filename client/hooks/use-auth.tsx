"use client";

import { useState } from "react";
import { authApi } from "../lib/apis";
import type { User, LoginResponse, GenericResponse } from "../types/index";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await authApi.register({ name, email, password });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const res = await authApi.verifyOTP(email, otp);
      setUser(res.user);
      localStorage.setItem("token", res.token);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    setLoading(true);
    try {
      await authApi.resendOTP(email);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res: LoginResponse = await authApi.login(email, password);
      setUser(res.user);
      localStorage.setItem("token", res.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const getMe = async () => {
    setLoading(true);
    try {
      const res = await authApi.getMe();
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, register, verifyOTP, resendOTP, login, logout, getMe };
}
