// client/app/layout.tsx
'use client'; // This directive remains crucial for client-side hooks and providers

import type React from "react";
// IMPORTANT: The 'metadata' export must be in a separate file (e.g., client/app/metadata.ts)
// if this component has 'use client'. So, this import is NOT needed here.
// import type { Metadata } from "next";

import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// NEW IMPORTS for Google OAuth and Toast Notifications
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

import { Navbar } from "../components/navbar";
import { ThemeProvider } from "../components/theme-provider";
import { AuthProvider } from "../context/auth-context";
import { CartProvider } from "../context/cart-context";
import BottomTicker from "../components/BottomTicker";

const inter = Inter({ subsets: ["latin"] });

// IMPORTANT: Do NOT export metadata from a 'use client' component.
// Ensure your metadata is defined in a separate file like client/app/metadata.ts
// For example, create client/app/metadata.ts with:
//
// export const metadata: Metadata = {
//   title: "InfoSOC",
//   description: "Join communities that match your interests and build lifelong connections",
// };
//

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Retrieve the Google Client ID from environment variables
  // Ensure NEXT_PUBLIC_GOOGLE_CLIENT_ID is correctly set in client/.env.local
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Optional: Log a warning if the client ID is missing in development
  if (process.env.NODE_ENV !== 'production' && !googleClientId) {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined. Google login will not be available.');
  }

  return (
    // IMPORTANT: Ensure NO whitespace/blank lines directly between <html> and <head>
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* IMPORTANT: Ensure NO whitespace/blank lines directly before or after Script tag within <head> */}
        {/* ✅ Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3750452404735470"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      {/* IMPORTANT: Ensure NO whitespace/blank lines directly between </head> and <body> */}
      <body
        className={`
          ${inter.className}
          bg-background text-foreground
          transition-colors duration-300
        `}
      >
        {/* Conditional rendering for GoogleOAuthProvider based on whether client ID is available */}
        {googleClientId ? (
            <GoogleOAuthProvider clientId={googleClientId}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <CartProvider>
                            <Navbar />
                            <main className="min-h-screen bg-background text-foreground p-4 pb-16">
                                {children}
                            </main>
                            <BottomTicker />
                        </CartProvider>
                    </AuthProvider>
                </ThemeProvider>
            </GoogleOAuthProvider>
        ) : (
            // Fallback if googleClientId is not available; app still renders without Google login functionality
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        <main className="min-h-screen bg-background text-foreground p-4 pb-16">
                            {children}
                        </main>
                        <BottomTicker />
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        )}
        {/* NEW: Toaster for react-hot-toast notifications */}
        {/* IMPORTANT: Ensure no extra lines or whitespace around this Toaster component */}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}