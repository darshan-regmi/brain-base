import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Brain Base is a single-public-page app: the landing page is the only route
 * that renders without a session. Everything else requires auth and is
 * noindex, so they are deliberately absent here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}