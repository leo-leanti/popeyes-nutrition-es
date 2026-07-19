import type { MetadataRoute } from "next";
import { ALL_ITEMS } from "@/data/menu";

const BASE = "https://popeyes-nutrition-es.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/metodo`, changeFrequency: "yearly", priority: 0.5 },
    ...ALL_ITEMS.map((item) => ({
      url: `${BASE}/producto/${item.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
