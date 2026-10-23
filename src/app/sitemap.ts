import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Brain Base is a single-public-page app: the landing page is the only route
 * that renders without a session. Everything else requires auth and is
 * noindex, so they are deliberately absent here.
 *
 * `/about`, `/privacy` and `/terms` are draft placeholders and are noindexed.
 * Add them here only after the owner replaces the TODOs and removes noindex.
 *
 * No `lastModified`: there is no real content-change timestamp to read, and a
 * build-time `new Date()` is fake freshness that Google learns to ignore.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/` }];
}
