// client/context/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "../lib/apis"; // Assuming authApi uses axios with withCredentials: true
import type { User } from "../types";
import toast from "react-hot-toast"; // NEW IMPORT: For showing notifications

interface AuthContextProps {
    user: User | null;
    loading: boolean; // Indicates if initial user loading is complete
    isAuthenticated: boolean; // Convenience derived state
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    resendOTP: (email: string) => Promise<void>;
    getMe: () => Promise<void>; // Renamed from loadUser for clarity, matches API call
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Initial loading of user
    const [actionLoading, setActionLoading] = useState(false); // New state for ongoing auth actions (login, register etc.)

    // Derived state for convenience
    const isAuthenticated = user !== null;

    // Function to fetch current user details (used on initial load and after login/register)
    const getMe = async () => {
        setLoading(true); // Set loading to true while fetching user
        try {
            const res = await authApi.getMe();
            setUser(res.data.user);
        } catch (err: any) {
            // If getMe fails (e.g., no token, expired token), user is not authenticated
            setUser(null);
            // console.error("Error fetching user data:", err); // Log for debugging, but don't show to user unless specific
        } finally {
            setLoading(false); // Always set loading to false when done
        }
    };

    // Effect to run getMe on component mount
    useEffect(() => {
        getMe();
    }, []);

    // Helper to extract error message from API response
    const extractErrorMessage = (error: any): string => {
        return error.response?.data?.message || error.message || "An unexpected error occurred.";
    };

    const register = async (name: string, email: string, password: string) => {
        setActionLoading(true);
        try {
            await authApi.register({ name, email, password });
            toast.success("Registration successful! Please check your email for verification.");
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err);
            toast.error(errorMessage);
            throw new Error(errorMessage); // Re-throw to allow component to catch and set local error state if needed
        } finally {
            setActionLoading(false);
        }
    };

    const verifyOTP = async (email: string, otp: string) => {
        setActionLoading(true);
        try {
            const res = await authApi.verifyOTP(email, otp);
            setUser(res.data.user); // Update user immediately on successful OTP verification
            toast.success(res.data.message || "Account verified successfully!");
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err);
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const resendOTP = async (email: string) => {
        setActionLoading(true);
        try {
            await authApi.resendOTP(email);
            toast.success("Verification code resent to your email.");
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err);
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setActionLoading(true);
        try {
            await authApi.login(email, password); // This should set the httpOnly cookie on backend
            await getMe(); // Re-fetch user details, which will now pick up the cookie
            toast.success("Logged in successfully!");
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err);
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const logout = async () => {
        setActionLoading(true);
        try {
            await authApi.logout();
            setUser(null);
            toast.success("Logged out successfully.");
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err);
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout,
                register,
                verifyOTP,
                resendOTP,
                getMe, // Expose getMe for explicit refreshing (e.g., after Google login)
            }}
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