import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://infosoc.in"),
  title: {
    default: "infoSoc — Societies & Clubs at Delhi Technological University",
    template: "%s | infoSoc",
  },
  description:
    "infoSoc is the central platform connecting students with all the societies and clubs at Delhi Technological University (DTU). Discover societies, events, and join the community.",
  applicationName: "infoSoc",
  keywords: [
    "infoSoc",
    "DTU societies",
    "DTU clubs",
    "Delhi Technological University",
    "college societies",
    "student clubs DTU",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "infoSoc",
    url: "https://infosoc.in",
    title: "infoSoc — Societies & Clubs at Delhi Technological University",
    description:
      "infoSoc is the central platform connecting students with all the societies and clubs at Delhi Technological University (DTU).",
    images: [{ url: "/infoSoc.png" }],
  },
  twitter: {
    card: "summary",
    title: "infoSoc — Societies & Clubs at Delhi Technological University",
    description:
      "infoSoc is the central platform connecting students with all the societies and clubs at Delhi Technological University (DTU).",
    images: ["/infoSoc.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/infoSoc.png" type="image/png" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3750452404735470"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
