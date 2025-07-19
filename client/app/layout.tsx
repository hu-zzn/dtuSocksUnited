import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Navbar } from "../components/navbar";
import { ThemeProvider } from "../components/theme-provider";
import { AuthProvider } from "../context/auth-context";
import { CartProvider } from "../context/cart-context";
import BottomTicker from "../components/BottomTicker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UnifyDTU",
  description: "Join communities that match your interests and build lifelong connections",
  viewport: "width=1280", // ✅ Fixed desktop width for mobile
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
      <body
        className={`
          ${inter.className}
          bg-background text-foreground
          transition-colors duration-300
          min-w-[1280px] overflow-x-auto
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <div className="w-[1280px] mx-auto">
                <Navbar />
                <main className="min-h-screen bg-background text-foreground p-4 pb-16">
                  {children}
                </main>
                <BottomTicker />
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
