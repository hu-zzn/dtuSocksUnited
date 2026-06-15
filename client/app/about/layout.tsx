import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "infoSoc is the central platform connecting students with all the societies and clubs at Delhi Technological University. Meet the core team and connect with us.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About infoSoc",
    description:
      "infoSoc is the central platform connecting students with all the societies and clubs at Delhi Technological University.",
    url: "https://infosoc.in/about",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
