import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://popeyes-nutrition-es.vercel.app/sitemap.xml",
  };
}
