import type { MetadataRoute } from "next";

const BASE_URL = "https://infosoc.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/eventCalendar", "/privacy-policy"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
