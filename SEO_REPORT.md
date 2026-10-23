# SEO & GEO report — Brain Base

**Date:** 2026-10-23
**Branch:** `seo-geo-pass` (local only, not pushed or deployed)
**Live origin:** `https://brain-base.darshanregmi.com.np` (still serving the old deployment)
**Scope:** whole repository, one indexable public page (`/`) plus three noindexed trust drafts, generated `robots.txt` / `sitemap.xml`, metadata, structured data, crawlability, AI/search bot access, content-to-query match.
**Mode:** audit-and-fix, using only facts already in the repo.

## Five-line summary

1. **Site type:** a single-page marketing site for Brain Base, an MIT-licensed, self-hostable second brain app (Next.js 16 App Router, React 19, Prisma/Postgres, NextAuth).
2. **Biggest win:** the public page now explains what the product is in the first paragraph, renders its H1/nav without JavaScript, has accurate per-page metadata and a JSON-LD graph that matches visible content.
3. **Biggest risk:** production is a stale deployment — on `https://brain-base.darshanregmi.com.np`, `/robots.txt` and `/sitemap.xml` return the 404 page, and the live HTML still has the old title, wrong `og:url`, no canonical and an invisible H1. Nothing in this branch matters until it is deployed.
4. **Trust gap:** `/about`, `/privacy` and `/terms` now exist as clearly marked, noindexed drafts, but every owner fact is still a placeholder and the contact channel is unverified. Those are owner decisions, not code fixes.
5. **Not measured:** Lighthouse/Core Web Vitals and external schema validation were not run. They are marked UNVERIFIED, not assumed passing.

## Assumptions (section-2 inputs were blank)

| Input | Inferred value | Source |
|---|---|---|
| Site URL | `https://brain-base.darshanregmi.com.np` | owner-provided live URL; `.env.example`, `src/lib/site.ts`, README |
| Site name | Brain Base | repo |
| Site type | SaaS / open-source developer tool | README, landing |
| Primary topic | Open-source, self-hostable second brain app combining notes, a focus timer, daily logs, a learning tracker and spaced repetition | README, landing |
| Audience | English-speaking developers and productivity-minded individuals | repo positioning |
| Unique value | One quiet, MIT-licensed, self-hostable app for capture, focus, logs and review; no subscription | README, landing |
| Author facts | Darshan Regmi, `https://github.com/darshan-regmi` | README, footer, git remote |
| AI training bots | Allowed (open-source project; no named groups in `robots.ts`) | deliberate default |
| Target queries (hypotheses, not validated) | "open source second brain app", "self-hosted notes app", "free second brain app", "second brain app with spaced repetition", "open source Pomodoro focus timer", "open source Notion/Obsidian alternative" | inferred |
| Content pages | 1 indexable public page (`/`) + 3 noindex trust drafts | route table |
| Mode / depth | audit-and-fix / standard | user prompt |

No search-volume, ranking or competitor data was available. Target queries are hypotheses to validate in Search Console, not facts.

## How this was checked

- Read the route tree, metadata files, `robots.ts`, `sitemap.ts`, manifest, landing components and README.
- Built a production build locally with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, served it with `pnpm start`, and inspected raw HTML with `curl`.
- Ran `pnpm seo:check` (new script, accepts a URL argument or `SEO_BASE_URL`): robots, sitemap, sitemap URLs, title/description/canonical/H1/`<main>`/JSON-LD/noindex, plus requests with six AI crawler user agents.
- Ran `pnpm lint`, `npx tsc --noEmit`, `pnpm build`.
- Inspected the live custom domain read-only. It is stale (see P0); `pnpm seo:check https://brain-base.darshanregmi.com.np` currently fails on missing robots/sitemap, as expected.
- **Not run:** Lighthouse, axe, browser rendering, Google Rich Results Test, Schema Markup Validator, Search Console, Bing Webmaster Tools, WAF/CDN tests. These are UNVERIFIED.

## Audit results

Status reflects the repository after this branch. "Live" notes the production deployment separately.

| Area | Before | After | Evidence / notes |
|---|---|---|---|
| Production deployment matches repo | FAIL | FAIL (owner) | On `brain-base.darshanregmi.com.np`, `/robots.txt` and `/sitemap.xml` return the 404 HTML page; live `og:url` is `https://brainbase.pages.dev`; live H1 has `opacity:0`; no canonical. Repo has newer commits than the deployment. |
| `robots.txt` | FAIL (live), partial (repo) | PASS (local) | Generated, allows `*`, disallows private routes, points at sitemap, does not block `/_next`. |
| `sitemap.xml` | FAIL (live), partial (repo) | PASS (local) | One canonical URL. Removed `lastModified: new Date()`, which claimed the page changed on every request. |
| Public page indexable | PASS | PASS | `robots: index, follow`; one canonical `/`. |
| Private/auth routes excluded | PASS | PASS | Session routes 307 to `/sign-in`; app and auth layouts emit `noindex, follow`; private prefixes disallowed in robots. Local build passes; the stale live `/sign-in` currently has no noindex meta. |
| Title and description | FAIL | PASS | Before: layout-level generic title, no page-specific description. After: 59-char title, 152-char description naming the product category, features, license and self-hosting. |
| Canonical | PASS (repo), FAIL (live) | PASS (local) | Self-referencing `https://…/`; root layout intentionally has none. |
| H1 and nav visible without JS | FAIL | PASS | Framer Motion `initial={{ opacity: 0 }}` shipped inline; removed from text-bearing elements. Only decorative `aria-hidden` dots still start at 0. |
| Landmarks | FAIL | PASS | Content wrapped in `<main>`; header/footer outside. |
| Nested interactive elements | FAIL | PASS | `<a><Button /></a>` replaced by a single `ButtonLink` (`motion.a`) in hero, banner, pricing, CTA, navbar, mobile menu. |
| Dead anchors | FAIL | PASS | `#preview` target added; footer "Why Brain Base" now `#why`; "FAQ" points to the new `#questions` section. |
| Structured data describes visible content | FAIL | PASS | Removed `softwareVersion: "1.0.0"` (package is 0.1.0) and `operatingSystem: "Web, iOS, Android"` (web app). JSON-LD now: Organization, Person, WebSite, WebPage, SoftwareApplication, with `offers` $0, MIT license, repo URL, feature list. Properly escaped. |
| Review / rating markup | N/A | N/A | None exists and none was added. No real reviews. |
| FAQPage / HowTo markup | N/A | N/A | Deliberately not added: FAQ rich results ended 2026-05-07; HowTo ended 2023. The six Q&As are plain visible content. |
| Content answers the primary query | FAIL | PASS (partial) | Hero subtitle is now a 44-word answer block; "Common questions" adds six visible Q&As. Still one page, so long-tail coverage is limited. |
| Internal links | FAIL | PASS | Navbar, footer and CTAs point at real sections/routes; author link uses `rel="me"`. |
| Trust signals | FAIL | PARTIAL | Footer's MIT link was a 404 (no LICENSE file); added MIT LICENSE and an author GitHub link. Added `/about`, `/privacy` and `/terms` as explicit noindex drafts with `[TODO]` markers; no verified contact or publishable legal copy yet. |
| AI crawler access | PASS (local) | PASS (local) | `seo:check` requests `/` as OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User: all 200 with correct HTML. Production and CDN/WAF: UNVERIFIED. |
| `llms.txt` | N/A | N/A | Intentionally skipped: this is a product landing page, not a docs/API corpus, and major search engines do not require it. |
| Thin/duplicate pages | PASS | PASS | One indexable URL; the three trust drafts are noindex. No page-per-question doorway pages were created. |
| Performance / Core Web Vitals | UNVERIFIED | UNVERIFIED | No Chrome/Chromium was installed, so Lighthouse could not run. Build is static except `/` (dynamic because of `auth()`). |
| Accessibility | FAIL (partial) | PARTIAL | Nested interactive elements removed; landmarks and input label added; headings normalised. No axe/browser audit. |
| Analytics / measurement | N/A | N/A | No analytics code exists, matching the landing claim "no telemetry, no analytics". Measurement must use Search Console, server logs and referrers. |

## Scorecard (0–10, judgement based on evidence above)

These scores estimate discoverability readiness, not rankings or citations.

| Dimension | Before | After | Why |
|---|---:|---:|---|
| Crawl and index control | 6 | 9 | Correct robots + sitemap + noindex policy. Not 10 because production is stale and sitemap has one URL. |
| AI crawler access | 6 | 9 | All six tested agents get 200; robots allows them. CDN/WAF unverified. |
| Rendering without JavaScript | 3 | 9 | H1, nav and CTAs now present in raw HTML. |
| Titles, descriptions, canonical | 5 | 9 | Unique, accurate, length-checked. |
| Structured data | 4 | 9 | Accurate graph, no invented ratings/version. External validation unverified. |
| Content-to-query match | 5 | 8 | Direct answer, feature sections, Q&A. One page limits breadth. |
| Trust and E-E-A-T | 3 | 5 | LICENSE and real author link added; About/privacy/terms are noindexed drafts with placeholders, not publishable trust signals yet. |
| Internal links and anchors | 5 | 9 | Dead links fixed; every nav/footer link resolves. |
| Accessibility / agent readiness | 5 | 8 | Valid interactive markup, landmarks, labels; no formal audit. |
| Performance / CWV | — | — | UNVERIFIED. |
| **Overall (excl. performance)** | **4.7** | **8.3** | Average of the nine scored rows. Not a ranking forecast. |

## Changes in this branch

| Commit | What changed |
|---|---|
| `1a796b8` | `fix(seo): describe the app accurately in metadata and JSON-LD` — `src/lib/site.ts`, `src/app/page.tsx`, `layout.tsx`, `sitemap.ts`, `robots.ts`, new `JsonLd.tsx`. Adds accurate title/description, canonical, OG/Twitter, five-node JSON-LD graph, removes fake freshness. |
| `913a34e` | `fix(seo): make landing content readable without JavaScript` — `ButtonLink` in `ui/Button.tsx` + `ui/index.ts`; `landing.tsx` and `navbar.tsx` use it, remove opacity-initial animations, add `<main>`, answer block, `#preview`/`#why`/`#questions`, six visible Q&As, heading and label fixes. |
| `123e3f8` | `test(seo): add crawl and metadata smoke check` — `scripts/seo-check.mjs`, `seo:check` npm script. |
| `ac16b72` | `chore: add MIT license` — fixes the footer/README license link. |
| `90a36b9` | `feat(seo): scaffold noindexed trust pages` — `/about`, `/privacy`, `/terms`, shared `TrustPage`, footer links, noindex + sitemap comments. |
| `5519cac` | `fix(seo): use the live custom domain and configurable check URL` — custom-domain fallback, `.env.example`, README, DEPLOYMENT, `seo:check <url>` / `SEO_BASE_URL`. |
| `2d852a1` | `fix(seo): let a trust page drop the draft notice when published` — `showDraftNotice` prop. |
| docs commit | `docs/seo/post-deploy-checklist.md`, updated `SEO_TODO.md` and `docs/seo/content-drafts.md`, this report. |

## Findings not fixed here

1. **Production is stale (P0).** Deploy this branch. Until then, live robots/sitemap 404, wrong `og:url`, no canonical and invisible H1 remain.
2. **About is a draft.** `/about` exists but is noindexed and full of `[TODO]` markers. The Person node points at GitHub until real bio facts are supplied.
3. **Privacy and terms are drafts.** `/privacy` and `/terms` exist but are noindexed templates with placeholders, not legal advice. They need owner facts and qualified review before publishing.
4. **Contact address unverified.** The old `hello@brainbase.dev` mailto was removed from the footer; `/about#contact` is a placeholder. Add a real, monitored channel before removing noindex.
5. **No first-hand proof on the page.** No user numbers, testimonials, launch date or case studies were invented. Add only if real and dated.
6. **Lighthouse/CWV unverified.** No browser available in this environment.
7. **External schema validation unverified.** The graph is syntactically valid JSON and passes the local checks; validate with Google Rich Results Test after deploy.
8. **CDN/WAF behaviour unverified.** Test the six AI user agents against production.
9. **AI training is allowed by default.** This is a deliberate open-source choice; change only if the owner decides otherwise.
10. **One indexable page.** Long-tail queries need genuinely distinct pages with unique material, not a page per question or a set of placeholder trust pages.
11. **README drift.** README says SQLite locally / Postgres in production, but `prisma/schema.prisma` now hard-codes `provider = "postgresql"`. Fix the docs or restore a working local path; developer trust matters for an open-source project.

## Off-site plan (earned, no spam)

Goal: real mentions that can be cited by search and AI answer engines. There is no guarantee any outlet will link or rank.

1. **GitHub repo hygiene.** Ensure the repo description, topics (`second-brain`, `notes`, `pomodoro`, `spaced-repetition`, `self-hosted`, `nextjs`) and README match the site. Pin the repo on the author profile.
2. **Author profile.** Add Brain Base to the GitHub profile README with a plain description and link. This supports the `Person`/`Organization` entity.
3. **Launch posts once.** A factual Show HN and one or two community posts (for example r/selfhosted, r/ObsidianMD, r/PKMS) only where self-promotion rules allow. Lead with what it does and what it does not do; no vote requests.
4. **Technical write-ups.** One or two posts on dev.to/Hashnode about a real implementation decision (SM-2 scheduling, wikilink graph, PWA offline shell), with a canonical link back to the site. Useful to developers, not keyword filler.
5. **Open-source directories.** Submit to awesome-selfhosted or similar only if the project meets the list's criteria. No paid link schemes, no fake reviews, no mass directory blasts.
6. **Release notes.** Tag real versions with honest changelogs; link releases from the README.

## Measurement plan

Baseline before the next deploy, then at 4, 8 and 12 weeks. Record numbers; do not promise movement.

| Signal | Where | What to record |
|---|---|---|
| Indexing | Google Search Console / Bing Webmaster Tools | Pages indexed, sitemap discovered, crawl errors, manual actions |
| Queries | Search Console | Impressions/clicks for the target-query hypotheses; new query phrases |
| AI inclusion | Search Console generative-AI setting; manual checks | Whether the page is eligible/included; test prompts in ChatGPT, Claude, Perplexity |
| AI referrals | Vercel logs / server logs | Requests with AI user agents and referrers (if analytics is added, segment by referrer) |
| Bot access | Production logs | 200 vs 403 for the six AI agents and Googlebot/Bingbot |
| Engagement | Search Console / optional privacy-friendly analytics | CTR, scroll or outbound clicks — only if the "no analytics" claim is updated |
| Content | Manual | Which questions get impressions; add sections to the owning page, not new thin pages |

Re-run `pnpm seo:check <url>` after every deploy. Keep `NEXT_PUBLIC_SITE_URL` set to the final origin.

## After deploy

Run `docs/seo/post-deploy-checklist.md` (about five minutes): real robots/sitemap, raw-source title/canonical/`og:url`/H1, auth noindex and private redirects, `pnpm seo:check https://brain-base.darshanregmi.com.np`, then Lighthouse/PageSpeed, Rich Results Test, Schema.org validator, Search Console and Bing Webmaster Tools.

## Expectations

- This branch fixes crawlability, rendering, metadata accuracy and structured-data truthfulness. It does **not** guarantee rankings, rich results or AI citations.
- Indexing and query data need days to weeks after deploy. Re-measure at 4/8/12 weeks.
- The largest remaining lever is not more markup: it is deploying the current code and adding real, first-party proof (About, privacy, contact, honest project history).

## Related files

- `SEO_TODO.md` — owner actions, prioritised, including the exact trust-page facts needed.
- `docs/seo/post-deploy-checklist.md` — five-minute production check.
- `docs/seo/content-drafts.md` — topic map, title/description options, page briefs, pending facts.
- `scripts/seo-check.mjs` — repeatable local/preview/live check (`pnpm seo:check <url>` or `SEO_BASE_URL`).
