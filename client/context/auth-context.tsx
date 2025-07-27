"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "../lib/apis";
import type { User } from "../types";
import toast from "react-hot-toast";

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    logoutUser: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    resendOTP: (email: string) => Promise<void>;
    getMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// ✅ Token utils (since utils.ts isn't a folder)
const TOKEN_KEY = "token";

const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const getToken = () => localStorage.getItem(TOKEN_KEY);
const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const router = useRouter();

    const isAuthenticated = !!user;

    const extractErrorMessage = (error: any): string =>
        error?.response?.data?.message || error?.message || "An unexpected error occurred.";

    const getMe = async () => {
        setLoading(true);
        try {
            const res = await authApi.getMe();
            setUser(res.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = getToken();
        if (token) getMe();
        else setLoading(false);
    }, []);

    const register = async (name: string, email: string, password: string) => {
        setActionLoading(true);
        try {
            await authApi.register({ name, email, password });
            toast.success("Registration successful! Check your email.");
        } catch (err: any) {
            const msg = extractErrorMessage(err);
            toast.error(msg);
            throw new Error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const verifyOTP = async (email: string, otp: string) => {
        setActionLoading(true);
        try {
            const res = await authApi.verifyOTP(email, otp);
            setUser(res.user);
            if (res.token) setToken(res.token); // ✅ Store token
            toast.success(res.message || "Verified!");
        } catch (err: any) {
            const msg = extractErrorMessage(err);
            toast.error(msg);
            throw new Error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const resendOTP = async (email: string) => {
        setActionLoading(true);
        try {
            await authApi.resendOTP(email);
            toast.success("OTP resent to your email.");
        } catch (err: any) {
            const msg = extractErrorMessage(err);
            toast.error(msg);
            throw new Error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setActionLoading(true);
        try {
            const res = await authApi.login(email, password);
            if (res.token) setToken(res.token); // ✅ Store token
            await getMe();
            toast.success("Logged in successfully!");
        } catch (err: any) {
            const msg = extractErrorMessage(err);
            toast.error(msg);
            throw new Error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const logout = async () => {
        setActionLoading(true);
        try {
            await authApi.logout();
            removeToken();
            setUser(null);
            toast.success("Logged out.");
            router.push("/login");
        } catch (err: any) {
            const msg = extractErrorMessage(err);
            toast.error(msg);
            throw new Error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const logoutUser = () => {
        removeToken();
        setUser(null);
        toast.error("Session expired. Please log in again.");
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout,
                logoutUser,
                register,
                verifyOTP,
                resendOTP,
                getMe,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
