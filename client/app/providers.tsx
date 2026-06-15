'use client';

import React from "react";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import BottomTicker from "../components/BottomTicker";
import { ThemeProvider } from "../components/theme-provider";

import { AuthProvider } from "../context/auth-context";
import { CartProvider } from "../context/cart-context";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (process.env.NODE_ENV !== 'production' && !googleClientId) {
  console.warn('⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined.');
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId || "dummy-id"}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen bg-background text-foreground p-4 pb-16">
              {children}
            </main>
            <BottomTicker />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
      <Toaster position="top-center" />
    </GoogleOAuthProvider>
  );
}
