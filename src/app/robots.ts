import type { MetadataRoute } from "next";
import { PRIVATE_ROUTES, SITE_URL } from "@/lib/site";

/**
 * Session-gated routes redirect to /sign-in via requireUser(), so a crawler
 * that follows the redirect ends up indexing a public sign-in page. Disallow
 * them here so crawl budget stays on the landing page.
 *
 * Disallow alone does NOT remove an already-indexed URL — the matching
 * `robots: { index: false }` on those routes does that part.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...PRIVATE_ROUTES],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}