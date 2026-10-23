# SEO / GEO owner checklist — Brain Base

Work top to bottom. **P0 items block everything else.** This file lists work that needs deploy access, accounts, or facts only the owner has. Nothing here should be invented or published without verification.

Date: 2026-10-23 · Branch: `seo-geo-pass` · Live origin: `https://brain-base.darshanregmi.com.np`

Short version for after a deploy: `docs/seo/post-deploy-checklist.md`.

---

## P0 — do before measuring anything

- [ ] **Deploy this branch to production.** The live custom domain is still the old deployment as of 2026-10-23: `/robots.txt` and `/sitemap.xml` return the 404 page; the HTML has the old title, `og:url=https://brainbase.pages.dev`, no canonical, and an `opacity:0` H1.
  - After deploy, confirm both files return 200 with real content; page source contains `<main>`, one visible H1, canonical `https://brain-base.darshanregmi.com.np/`, and `og:url` on the same origin. The stale live `/sign-in` also lacks its noindex meta; the local build emits it.
  - Run: `pnpm seo:check https://brain-base.darshanregmi.com.np` (or set `SEO_BASE_URL`).
  - Then run the five-minute `docs/seo/post-deploy-checklist.md`.
- [ ] **Set `NEXT_PUBLIC_SITE_URL` in the deployment environment** to `https://brain-base.darshanregmi.com.np` (no trailing slash). The fallback in `src/lib/site.ts` now matches this origin, but the env var is the explicit source of truth.
- [ ] **Treat the custom domain as canonical.** If you later change domains, add 301/308 redirects from the old host and update `NEXT_PUBLIC_SITE_URL`, README, `sameAs`, canonicals and sitemap in the same change.
- [ ] **Google Search Console:** verify `https://brain-base.darshanregmi.com.np/` or the domain property, submit `/sitemap.xml`, check Security & Manual Actions, and keep the page eligible for Search generative AI features.
- [ ] **Bing Webmaster Tools:** verify, submit the sitemap, enable IndexNow if desired.
- [ ] **Check the CDN/WAF.** In Vercel Firewall/Attack Challenge Mode, make sure Googlebot, Bingbot and the AI agents below are not challenged or blocked. Test with real user agents and record status codes:
  `OAI-SearchBot/1.4`, `ChatGPT-User/1.0`, `Claude-SearchBot/1.0`, `Claude-User/1.0`, `PerplexityBot/1.0`, `Perplexity-User/1.0`.
- [ ] **Choose a monitored contact channel.** The footer now points to `/about#contact`, which is a placeholder. Do not publish an email or form until it is real and monitored.

## P0 — finish the trust pages

`/about`, `/privacy` and `/terms` exist as drafts. They are `noindex, follow` and intentionally absent from the sitemap. Every unresolved fact is marked `[TODO: owner to fill in]`.

- [ ] **Supply the About facts.** Required before publishing:
  - legal name you want shown publicly;
  - monitored contact email;
  - support URL (GitHub Issues or Discussions);
  - private security-report contact;
  - response-time expectation, only if you can commit to one;
  - legal entity and mailing address, if required in your jurisdiction.

  Optional but useful: short first-person bio, role, location, photo, project start date, origin details, confirmed single-user description, production database host/region.

- [ ] **Supply the Privacy facts.** Required before publishing:
  - legal entity / data controller name;
  - monitored privacy contact email;
  - jurisdiction;
  - database host and region;
  - which auth providers are enabled on the hosted instance (GitHub, Google, credentials);
  - whether the host/CDN keeps access logs and for how long;
  - retention and deletion process, including backups;
  - user-rights process for your jurisdiction;
  - international-transfer safeguards, if applicable;
  - effective date;
  - confirmation that there are no advertising/third-party cookies and no analytics (currently true in code).

- [ ] **Supply the Terms facts.** Required before publishing:
  - operator legal name and public URL;
  - governing-law jurisdiction and venue, if applicable;
  - eligibility / minimum age;
  - acceptable-use rules and any storage/rate limits;
  - the permission the operator needs to host, process, back up and display user content;
  - availability commitment (or explicit "as-is");
  - warranty disclaimer and liability limitation, reviewed by a qualified person;
  - termination rules and what happens to data;
  - contact and effective date.

- [ ] **Publish the trust pages only after the facts are real:**
  1. replace every `[TODO: owner to fill in]`;
  2. remove `noIndexMetadata(...)` from that page's `metadata`;
  3. pass `showDraftNotice={false}` to that page's `TrustPage` (or remove the notice);
  4. add the URL to `src/app/sitemap.ts`;
  5. run `pnpm seo:check https://brain-base.darshanregmi.com.np`;
  6. request indexing for the new page.

- [ ] **Have the privacy policy and terms reviewed** by someone qualified in your jurisdiction. They are templates, not legal advice.

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

- **The live custom domain is still the stale build.** Verified: `/robots.txt` and `/sitemap.xml` 404; old title/`og:url`; `opacity:0` H1. Re-check after deploy.
- **Lighthouse / PageSpeed / Core Web Vitals:** not run. No Chrome/Chromium was available in this environment.
- **Browser accessibility audit:** not run (no axe or browser).
- **Rich Results Test / Schema.org validator:** not run against the new build; the live page is stale.
- **Production WAF/CDN behaviour:** not tested. Local AI-bot requests pass; production may differ.
- **Google Search Console / Bing Webmaster Tools:** not connected or inspected.
- **Contact email delivery:** not tested. The old `hello@brainbase.dev` mailto was removed from the footer; `/about#contact` is a placeholder.
- **Trust pages:** drafts only. Not legally reviewed; not indexed; not in the sitemap.
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
