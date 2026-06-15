import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/manage-society", "/cart", "/login", "/register", "/reset-password", "/forgot-password"],
    },
    sitemap: "https://infosoc.in/sitemap.xml",
    host: "https://infosoc.in",
  };
}
