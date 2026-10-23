import type { Metadata } from "next";

/**
 * Metadata for routes that must stay out of the search index.
 *
 * Two groups need it:
 *
 *  1. Session-gated app routes (`/dashboard`, `/notes`, `/kb`, …). They call
 *     `requireUser()`, which redirects to `/sign-in`. A crawler that follows
 *     that redirect lands on a public 200 page, so the gated URL itself needs
 *     an explicit noindex — robots.txt `disallow` prevents crawling but does
 *     not de-index anything already stored.
 *
 *  2. Auth screens themselves (`/sign-in`, `/sign-up`, `/forgot-password`),
 *     which are thin, low-value, and unique per visitor.
 *
 *  3. Placeholder trust pages (`/about`, `/privacy`, `/terms`). They contain
 *     unresolved `[TODO: owner to fill in]` facts and must stay out of the
 *     index and the sitemap until those are replaced.
 *
 * `follow` stays true so crawlers keep walking the rest of the site.
 */
export function noIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}