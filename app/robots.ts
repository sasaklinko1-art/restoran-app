import type { MetadataRoute } from "next";
import { restoran } from "@/lib/restoran";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${restoran.url}/sitemap.xml`,
  };
}