import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Navbar } from "../components/navbar";
import { ThemeProvider } from "../components/theme-provider";
import { CartProvider } from "../context/cart-context";
import BottomTicker from "../components/BottomTicker";
import { SessionProvider } from "next-auth/react"; // ✅ Import from next-auth

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UnifyDTU",
  description:
    "Join communities that match your interests and build lifelong connections",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body
        className={`
          ${inter.className}
          bg-background text-foreground
          transition-colors duration-300
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider> {/* ✅ Wrap your app in SessionProvider */}
            <CartProvider>
              <Navbar />
              <main className="min-h-screen bg-background text-foreground p-4 pb-16">
                {children}
              </main>
              <BottomTicker />
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
