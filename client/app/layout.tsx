// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Navbar } from "../components/navbar";
import BottomTicker from "../components/BottomTicker";
import { Providers } from "./providers"; // ✅ correct
 // ✅ Import the Client Providers wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UnifyDTU",
  description: "Join communities that match your interests and build lifelong connections",
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
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-background text-foreground p-4 pb-16">
            {children}
          </main>
          <BottomTicker />
        </Providers>
      </body>
    </html>
  );
}
