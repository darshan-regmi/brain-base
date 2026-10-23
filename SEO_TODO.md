# SEO / GEO owner checklist — Brain Base

Work top to bottom. **P0 items block everything else.** This file lists work that needs deploy access, accounts, or facts only the owner has. Nothing here should be invented or published without verification.

Date: 2026-10-23 · Branch: `seo-geo-pass`

---

## P0 — do before measuring anything

- [ ] **Deploy this branch to production.** The live site is stale: `https://brain-base-lake.vercel.app/robots.txt` and `/sitemap.xml` return the 404 page; the live HTML has the old title, `og:url=https://brainbase.pages.dev`, no canonical and an `opacity:0` H1.
  - After deploy, confirm: both files return 200 with the right content; page source contains `<main>`, one visible H1, canonical `https://brain-base-lake.vercel.app/`, `og:url` on the same origin.
  - Run: `pnpm seo:check` against the deployed URL (the script accepts a URL argument).
- [ ] **Set `NEXT_PUBLIC_SITE_URL` in Vercel** to the final origin (no trailing slash). The fallback in `src/lib/site.ts` matches the current Vercel URL, but an explicit env var prevents future drift.
- [ ] **Pick the permanent domain now if a custom domain is planned.** Moving later means 301/308 redirects from the Vercel host, updating `NEXT_PUBLIC_SITE_URL`, canonicals, sitemap, README and `sameAs`. Do it once.
- [ ] **Google Search Console:** verify the domain property (DNS or HTML), submit `/sitemap.xml`, check Security & Manual Actions, and keep the page eligible for Search generative AI features.
- [ ] **Bing Webmaster Tools:** verify, submit the sitemap, enable IndexNow if desired.
- [ ] **Check the CDN/WAF.** In Vercel Firewall/Attack Challenge Mode, make sure Googlebot, Bingbot and the AI agents below are not challenged or blocked. Test with real user agents and record status codes:
  `OAI-SearchBot/1.4`, `ChatGPT-User/1.0`, `Claude-SearchBot/1.0`, `Claude-User/1.0`, `PerplexityBot/1.0`, `Perplexity-User/1.0`.
- [ ] **Verify the contact channel.** The footer uses `mailto:hello@brainbase.dev`. The domain has mail records, but inbox delivery was not tested. If it is not monitored, replace it with a GitHub Issues/Discussions link or a real address.

## P1 — trust and first-party proof

- [ ] **Add an About page** (`/about`) linked from the footer and navbar. Content that needs owner input:
  - who you are and what you do (real facts only);
  - why you built Brain Base (the README has a one-line origin: juggling five tools — verify and expand);
  - what the project is and is not;
  - how to contact you and where the code lives.
  - Add `Person`/`AboutPage` schema only after the visible copy exists. Code the footer/nav link in the same commit.
- [ ] **Add a privacy policy and terms** (`/privacy`, `/terms`) and link both in the footer. Cover: account data, notes/uploads, auth providers (GitHub/Google/credentials), database hosting, cookies/session, deletion, no analytics/telemetry (currently true), and contact. This is also needed for OAuth consent screens and app directories.
- [ ] **Fix README/database drift.** README says "SQLite locally, Postgres in production", but `prisma/schema.prisma` hard-codes `provider = "postgresql"`. Either restore a working local path or update the setup guide. Developers evaluating a self-hosted app notice this.
- [ ] **Enable GitHub Discussions** (if not already) and link it from the README/site as the support channel.
- [ ] **Add real proof, only if it exists:** launch date, real user/testing numbers, dated screenshots, quotes with permission. Do not add reviews, ratings, awards, logos or testimonials that are not verifiable.
- [ ] **Run Lighthouse and an accessibility audit** (Chrome installed, mobile + desktop) on `/`. Fix real CWV/a11y issues; re-run. Record scores and dates here.
- [ ] **Validate structured data externally:** Google Rich Results Test and Schema Markup Validator on the deployed URL. Expect Organization, WebSite, WebPage, SoftwareApplication — not Review/FAQ rich results.

## P2 — content and distribution

- [ ] **Decide the AI training policy.** Current `robots.ts` allows all crawlers, including training crawlers, on purpose. If you want to disallow training, add named groups (`GPTBot`, `Google-Extended`, `ClaudeBot`, `CCBot`, etc.) and repeat the private-route disallows inside each group. This does not affect search inclusion.
- [ ] **Publish one or two genuinely distinct pages**, not a page per question. Best candidates, in order:
  1. a self-hosting guide with tested steps (different intent from the landing page);
  2. an honest comparison page (Notion/Obsidian/Logseq) only if you have hands-on experience and can avoid invented claims.
  Follow `docs/seo/content-drafts.md`; add internal links from `/` and the footer.
- [ ] **Off-site, earned only:** GitHub repo description/topics, profile README, one Show HN, one or two technical write-ups with canonical links, relevant awesome-list submission if criteria are met. No paid links, fake reviews, mass directory submissions or vote requests.
- [ ] **Optional IndexNow** for Bing after deploy (small script or manual ping on release).
- [ ] **Analytics decision.** The landing page says "no telemetry, no analytics". If you add analytics, update that copy and the privacy policy, and segment AI referrers. If you keep it off, use Search Console + Vercel/server logs.
- [ ] **Re-measure at 4 / 8 / 12 weeks:** indexed pages, sitemap status, query impressions/clicks, AI referrals, bot status codes. Record the numbers in `SEO_REPORT.md` or a new measurement log.
- [ ] **Re-run `pnpm seo:check` after every deploy.** Optional: run it against a preview deployment in CI once the preview URL is available.

---

## Do not

- Do not add `FAQPage` schema for rich results (ended 2026-05-07) or `HowTo` (ended 2023). Keep the visible Q&A as content.
- Do not add `Review`/`AggregateRating` without real, verifiable reviews.
- Do not invent users, testimonials, benchmarks, awards, dates or author credentials.
- Do not create near-duplicate pages for every query, stuff keywords, hide text, or add AI-only instructions.
- Do not change indexed URLs without a 301/308 and same-commit updates to links, canonicals and sitemap.
- Do not block search or AI crawlers to "protect" content that is already public; the app routes are protected by auth and noindex, not by robots alone.
