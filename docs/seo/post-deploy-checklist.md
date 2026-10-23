# Post-deploy checklist — Brain Base

Run this after deploying `seo-geo-pass` to `https://brain-base.darshanregmi.com.np/`.
It takes about five minutes. Do not request indexing until every code check passes.

**Before deploying:** set `NEXT_PUBLIC_SITE_URL=https://brain-base.darshanregmi.com.np` in the deployment environment (no trailing slash).

> As of 2026-10-23 the live site is still the old deployment: `/robots.txt` and `/sitemap.xml` return the 404 page, and the homepage still has the old title and `opacity:0` H1. That is expected until this branch is deployed.

## 1. robots.txt and sitemap.xml return real content

```bash
curl -sS -o /dev/null -w '%{http_code} %{content_type}\n' https://brain-base.darshanregmi.com.np/robots.txt
curl -sS https://brain-base.darshanregmi.com.np/robots.txt
curl -sS -o /dev/null -w '%{http_code} %{content_type}\n' https://brain-base.darshanregmi.com.np/sitemap.xml
curl -sS https://brain-base.darshanregmi.com.np/sitemap.xml
```

- [ ] Both return `200`, not an HTML 404 page.
- [ ] `robots.txt` allows `*`, disallows the private prefixes, and has a `Sitemap:` line.
- [ ] `sitemap.xml` contains the homepage URL and **does not** contain `/about`, `/privacy` or `/terms` while they are placeholders.

## 2. View source on the homepage

```bash
curl -sS https://brain-base.darshanregmi.com.np/ | grep -E '<title>|rel="canonical"|og:url|<h1'
```

- [ ] Title is `Open-source second brain app for notes & focus | Brain Base`.
- [ ] Canonical is `https://brain-base.darshanregmi.com.np/`.
- [ ] `og:url` is `https://brain-base.darshanregmi.com.np/`.
- [ ] Exactly one `<h1>`, and its style does **not** contain `opacity:0`.
- [ ] Optional: the HTML contains `<main>`.

Check the raw HTML (`view-source:`), not the rendered DOM. Raw HTML is what most crawlers see.

## 3. Auth and private routes

```bash
for p in /sign-in /sign-up /forgot-password /dashboard /notes; do
  echo "== $p"
  curl -sS -o /dev/null -D - "https://brain-base.darshanregmi.com.np$p" | grep -iE '^(HTTP/|location:)'
done
curl -sS https://brain-base.darshanregmi.com.np/sign-in | grep -o '<meta name="robots"[^>]*>'
```

- [ ] Auth pages return `200` with `<meta name="robots" content="noindex, follow">`.
- [ ] `/dashboard` and `/notes` return `307` with `location: /sign-in`.
- [ ] No private note content appears in any public response.
- [ ] `/about`, `/privacy`, `/terms` return `200` with `noindex` while they are drafts.

## 4. Run the SEO check against live

```bash
pnpm seo:check https://brain-base.darshanregmi.com.np
# or:
SEO_BASE_URL=https://brain-base.darshanregmi.com.np pnpm seo:check
```

- [ ] Output ends with `1 URLs checked, 0 failure(s)` (the count grows if you add public pages to the sitemap).
- [ ] All six AI user agents report `ok`.

If it fails, fix the URL/origin or the deployment before continuing. The check is read-only.

## 5. External tools (paste these exact URLs)

| Tool | Open | Paste / enter |
|---|---|---|
| PageSpeed Insights | https://pagespeed.web.dev/ | `https://brain-base.darshanregmi.com.np/` |
| PageSpeed direct link | `https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fbrain-base.darshanregmi.com.np%2F` | — |
| Lighthouse (local Chrome) | DevTools → Lighthouse → Analyze page load | `https://brain-base.darshanregmi.com.np/` |
| Lighthouse CLI | Terminal | `npx lighthouse https://brain-base.darshanregmi.com.np/ --view` |
| Rich Results Test | `https://search.google.com/test/rich-results?url=https%3A%2F%2Fbrain-base.darshanregmi.com.np%2F` | — |
| Schema.org validator | https://validator.schema.org/ | `https://brain-base.darshanregmi.com.np/` |

- [ ] PageSpeed mobile and desktop recorded. Note the date and scores.
- [ ] Lighthouse SEO and Accessibility have no serious failures. (Best Practices/Performance may vary; record, don't guess.)
- [ ] Rich Results Test detects the structured data that is eligible. Not every schema type produces a rich result.
- [ ] Schema.org validator reports no errors (warnings are worth reading).
- [ ] **UNVERIFIED in the repo environment:** Lighthouse, PageSpeed and both validators were not run here because no Chrome/Chromium was installed. Do not record them as passing until you run them.

## 6. Search Console and Bing

**Google Search Console — https://search.google.com/search-console**

- [ ] Add/verify the property: `https://brain-base.darshanregmi.com.np/` (URL-prefix) or the domain property `darshanregmi.com.np` (DNS).
- [ ] Sitemaps → submit `https://brain-base.darshanregmi.com.np/sitemap.xml`.
- [ ] URL Inspection → paste `https://brain-base.darshanregmi.com.np/` → Test live URL → Request indexing when it passes.
- [ ] Check Security & Manual Actions.
- [ ] Leave the page eligible for Search generative AI features (do not opt out unless you mean to).
- [ ] Record the property type and submit date.

**Bing Webmaster Tools — https://www.bing.com/webmasters**

- [ ] Add/verify the site.
- [ ] Sitemaps → submit `https://brain-base.darshanregmi.com.np/sitemap.xml`.
- [ ] Optional: enable IndexNow.

## 7. When the trust pages are ready

The pages `/about`, `/privacy` and `/terms` are currently drafts with `[TODO: owner to fill in]` markers and `noindex`. To publish:

1. Replace every TODO with real, approved facts.
2. Remove `noIndexMetadata(...)` from that page's `metadata` and use normal metadata.
3. Pass `showDraftNotice={false}` to that page's `TrustPage` (or remove the notice).
4. Add the URL to `src/app/sitemap.ts`.
5. Re-run `pnpm seo:check <url>`, then request indexing for the new page.

Do not remove noindex while any TODO remains.

## Record the run

| Date | Deploy | seo:check | PageSpeed mobile | Lighthouse SEO/a11y | Rich Results | GSC submitted | Notes |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |
