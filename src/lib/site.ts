/**
 * Canonical site origin.
 *
 * Used for metadataBase, canonicals, OG urls, robots and the sitemap so the
 * domain lives in exactly one place. Previously these were hard-coded to
 * `https://brainbase.pages.dev` in the root layout, which is not the deployed
 * host — every share card and canonical pointed at the wrong origin.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment. The fallback matches
 * the live URL in the README; no trailing slash.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://brain-base-lake.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Brain Base";

export const REPO_URL = "https://github.com/darshan-regmi/brain-base";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Routes that require a session. They `redirect("/sign-in")` via requireUser(),
 * which means a crawler that follows the redirect lands on a public 200 page —
 * so these are both disallowed in robots.txt and marked noindex.
 */
export const PRIVATE_ROUTES = [
  "/dashboard",
  "/notes",
  "/kb",
  "/focus",
  "/log",
  "/learn",
  "/review",
  "/api",
  "/actions",
] as const;