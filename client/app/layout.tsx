// client/app/layout.tsx
'use client'; // This directive remains crucial for client-side hooks and providers

import type React from "react";
// REMOVE THIS LINE: import type { Metadata } from "next"; // No longer needed here
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// NEW IMPORT for Google OAuth
import { GoogleOAuthProvider } from '@react-oauth/google';
// NEW IMPORT for Toast Notifications
import { Toaster } from 'react-hot-toast';

import { Navbar } from "../components/navbar";
import { ThemeProvider } from "../components/theme-provider";
import { AuthProvider } from "../context/auth-context";
import { CartProvider } from "../context/cart-context";
import BottomTicker from "../components/BottomTicker";

const inter = Inter({ subsets: ["latin"] });

// REMOVE THE METADATA EXPORT FROM HERE
// export const metadata: Metadata = {
//   title: "UnifyDTU",
//   description: "Join communities that match your interests and build lifelong connections",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    // Retrieve the Google Client ID from environment variables
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Optional: Log a warning if the client ID is missing in development
    if (process.env.NODE_ENV !== 'production' && !googleClientId) {
        console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined. Google login will not be available.');
    }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3750452404735470"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`
          ${inter.className}
          bg-background text-foreground
          transition-colors duration-300
        `}
      >
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
        <Toaster position="top-center" />
      </body>
    </html>
  );
}