'use client';

import React from "react";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import BottomTicker from "../components/BottomTicker";
import { ThemeProvider } from "../components/theme-provider";

import { AuthProvider } from "../context/auth-context";
import { CartProvider } from "../context/cart-context";

const inter = Inter({ subsets: ["latin"] });

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (process.env.NODE_ENV !== 'production' && !googleClientId) {
  console.warn('⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined.');
}

const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => (
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
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3750452404735470"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <ProvidersWrapper>{children}</ProvidersWrapper>
          </GoogleOAuthProvider>
        ) : (
          <ProvidersWrapper>{children}</ProvidersWrapper>
        )}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
