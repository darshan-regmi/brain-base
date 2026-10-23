# SEO / GEO owner checklist — Brain Base

Work top to bottom. **P0 items block everything else.** This file lists work that needs deploy access, accounts, or facts only the owner has. Nothing here should be invented or published without verification.

Date: 2026-10-23 · Branch: `seo-geo-pass` · Live origin: `https://brain-base.darshanregmi.com.np`

Short version for after a deploy: `docs/seo/post-deploy-checklist.md`.

---

## P0 — do before measuring anything

- [x] **Deploy this branch to production.** Deployed on 2026-10-23 at `9e50fad`; the live custom domain now serves the new build.
  - Verified: `/robots.txt` and `/sitemap.xml` return 200; page source has `<main>`, one visible H1, canonical `https://brain-base.darshanregmi.com.np/`, and `og:url` on the same origin; `/sign-in` emits its noindex meta.
  - `pnpm seo:check https://brain-base.darshanregmi.com.np` passes: six AI bots 200, zero failures.
  - Continue with the five-minute `docs/seo/post-deploy-checklist.md`.
- [ ] **Set `NEXT_PUBLIC_SITE_URL` in the deployment environment** to `https://brain-base.darshanregmi.com.np` (no trailing slash). The fallback in `src/lib/site.ts` now matches this origin, but the env var is the explicit source of truth.
- [ ] **Treat the custom domain as canonical.** If you later change domains, add 301/308 redirects from the old host and update `NEXT_PUBLIC_SITE_URL`, README, `sameAs`, canonicals and sitemap in the same change.
- [ ] **Google Search Console:** verify `https://brain-base.darshanregmi.com.np/` or the domain property, submit `/sitemap.xml`, check Security & Manual Actions, and keep the page eligible for Search generative AI features.
- [ ] **Bing Webmaster Tools:** verify, submit the sitemap, enable IndexNow if desired.
- [ ] **Check the CDN/WAF.** In Vercel Firewall/Attack Challenge Mode, make sure Googlebot, Bingbot and the AI agents below are not challenged or blocked. Test with real user agents and record status codes:
  `OAI-SearchBot/1.4`, `ChatGPT-User/1.0`, `Claude-SearchBot/1.0`, `Claude-User/1.0`, `PerplexityBot/1.0`, `Perplexity-User/1.0`.
- [x] **Choose a monitored contact channel.** Public support and bug reports point to GitHub Issues. Privacy and security reports also start on GitHub: open an issue and ask for a private channel without posting sensitive details. The GitHub profile has no public email (checked via the GitHub API). The footer links to `/about#contact`. No email or form is published.

## P0 — trust pages: facts supplied, awaiting review

`/about`, `/privacy` and `/terms` are filled in. They remain `noindex, follow` and excluded from the sitemap until the owner and, for the legal pages, a qualified reviewer sign off.

- [x] **Owner facts supplied.** Confirmed:
  - operator: Darshan Regmi, individual, Nepal;
  - public support: GitHub Issues;
  - private privacy/security contact: request a private channel via GitHub Issues (the GitHub profile lists no public email);
  - response time: best effort, no guarantee;
  - project start: early 2026;
  - public bio: link to GitHub only;
  - database: Neon, AWS US East 1 (N. Virginia);
  - hosting: Vercel, standard request logs;
  - auth: email/password, GitHub and Google;
  - deletion/export: individual items in-app; account action by request;
  - backups: Neon default retention;
  - minimum age: none stated;
  - content licence: limited licence to host, process, back up and display;
  - liability/availability: conservative as-is terms under Nepal law;
  - effective date: set on publication.

- [ ] **Review the About page.** Check the project start date, maintainer link, hosting details and contact wording.
- [ ] **Have the Privacy Policy and Terms reviewed** by someone qualified in Nepal. They are templates, not legal advice.
- [ ] **Publish only after review:**
  1. remove `noIndexMetadata(...)` from that page's `metadata`;
  2. pass `showDraftNotice={false}` to that page's `TrustPage` (or remove the notice);
  3. add the URL to `src/app/sitemap.ts`;
  4. run `pnpm seo:check https://brain-base.darshanregmi.com.np`;
  5. request indexing for the new page.

## P1 — trust and first-party proof

- [ ] **Fix README/database drift.** README says "SQLite locally, Postgres in production", but `prisma/schema.prisma` hard-codes `provider = "postgresql"`. Either restore a working local path or update the setup guide. Developers evaluating a self-hosted app notice this.
- [ ] **Enable GitHub Discussions** (if not already) and link it from the README/site as the support channel.
- [ ] **Add real proof, only if it exists:** launch date, real user/testing numbers, dated screenshots, quotes with permission. Do not add reviews, ratings, awards, logos or testimonials that are not verifiable.
- [ ] **Run Lighthouse and an accessibility audit** (Chrome installed, mobile + desktop) on `/`. Fix real CWV/a11y issues; re-run. Record scores and dates here.
- [ ] **Validate structured data externally:** Google Rich Results Test and Schema.org validator on the deployed URL. Expect Organization, WebSite, WebPage, SoftwareApplication — not Review/FAQ rich results.

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
- [ ] **Re-run `pnpm seo:check <url>` after every deploy.** It also accepts `SEO_BASE_URL`, so it can run against a preview deployment in CI once the preview URL is available.

---

## UNVERIFIED (as of 2026-10-23)

- **Lighthouse / PageSpeed / Core Web Vitals:** not run. No Chrome/Chromium was available in this environment.
- **Browser accessibility audit:** not run (no axe or browser).
- **Rich Results Test / Schema.org validator:** not run against the deployed build.
- **Production WAF/CDN behaviour:** not tested beyond the six AI user agents in `pnpm seo:check`; Vercel's dashboard controls were not inspected.
- **Google Search Console / Bing Webmaster Tools:** not connected or inspected.
- **Contact delivery:** there is no published email. Support goes through GitHub Issues; privacy/security go through a private channel requested on GitHub. The GitHub profile's email is null, and the private-channel flow was not tested.
- **Trust pages:** owner facts are filled in, but they are not legally reviewed, not indexed, and not in the sitemap.
- **AI training policy:** currently allowed by default; owner decision, not verified against a legal or business requirement.
- **Analytics/AI referrals:** no analytics code exists, so no referral data is available yet.

---

## Do not

- Do not add `FAQPage` schema for rich results (ended 2026-05-07) or `HowTo` (ended 2023). Keep the visible Q&A as content.
- Do not add `Review`/`AggregateRating` without real, verifiable reviews.
- Do not invent users, testimonials, benchmarks, awards, dates, contact details, legal entities or author credentials.
- Do not create near-duplicate pages for every query, stuff keywords, hide text, or add AI-only instructions.
- Do not change indexed URLs without a 301/308 and same-commit updates to links, canonicals and sitemap.
- Do not block search or AI crawlers to "protect" content that is already public; the app routes are protected by auth and noindex, not by robots alone.
