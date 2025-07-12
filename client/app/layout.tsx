// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; 
import "./globals.css";

import { Navbar } from "../components/navbar";
import { ThemeProvider } from "../components/theme-provider";
import { AuthProvider } from "../context/auth-context";
import { CartLengthProvider } from "../context/cart-length-context"; // ✅ import it
import BottomTicker from "../components/BottomTicker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocietyHub - Discover Your Perfect Society",
  description: "Join communities that match your interests and build lifelong connections",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartLengthProvider> {/* ✅ Wrap around children */}
              <Navbar />
              <main className="min-h-screen bg-background text-foreground p-4 pb-16">
                {children}
              </main>
              <BottomTicker />
            </CartLengthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
