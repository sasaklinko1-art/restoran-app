import type { MetadataRoute } from "next";
import { restoran } from "@/lib/restoran";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: restoran.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${restoran.url}/meni`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${restoran.url}/rezervacija`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}