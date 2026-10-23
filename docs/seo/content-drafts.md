# Content drafts and topic map — Brain Base

Working notes for future content. **Nothing here is published.** Copy in `[brackets]` is a fact only the owner can supply; do not replace it with a guess. The site currently has one public page (`/`), so the default is to add a **section** to an existing page, not a new URL.

Date: 2026-10-23

## Guardrails

- One search intent per page. Add a page only when the intent is distinct and the page has material no other page has.
- Answer the query in the first 40–60 words, then add detail.
- No invented numbers, reviews, awards, dates, quotes, credentials or case studies. No "as seen in" without a real link.
- No keyword stuffing, hidden text, doorway pages or near-duplicates.
- No `FAQPage`/`HowTo` schema for rich results; visible Q&A only.
- Competitor facts (pricing, features, licenses) change. Verify and date any comparison before publishing.
- Keep the owner's voice: plain, specific, unhyped.

## What the landing page already covers

| Section | Anchor | Query it serves |
|---|---|---|
| Hero answer block | top | What is Brain Base? / open-source second brain app |
| Features (6 cards) | `#features` | notes, focus timer, daily log, knowledge base, learning tracker, spaced repetition |
| Philosophy | `#why` | why one calm workspace instead of five tools |
| Preview mockup | `#preview` | what the app looks like |
| Pricing | `#pricing` | free / MIT / no subscription |
| Common questions (6) | `#questions` | definition, cost, self-hosting, data location, Notion/Obsidian difference, offline/PWA |
| Footer | — | GitHub, license, author, contact |

## Topic map

Four clusters, one owning page each. Do not spin up a URL per question.

### Cluster A — Second brain fundamentals

- **Intent:** "what is a second brain app", "how to organize notes and ideas", "second brain workflow".
- **Owning URL today:** `/` (`#questions`, `#features`).
- **Possible future page:** `/guides/second-brain` — only with a concrete, first-hand workflow and real screenshots. Otherwise keep it as a section.
- **Unique material needed:** a capture → process → focus → log → review walkthrough using actual Brain Base screens, plus what the owner personally does and what did not work.

### Cluster B — Open source and self-hosting

- **Intent:** "open source second brain app", "self-hosted notes app", "free Notion/Obsidian alternative", "Brain Base self host".
- **Owning URL today:** `/` (hero, pricing, `#questions`).
- **Recommended next page:** `/self-hosting` — distinct intent (setup) and genuinely useful material (tested steps, env vars, Postgres, auth).
- **Unique material needed:** verified install/deploy steps. The README currently disagrees with `prisma/schema.prisma` about SQLite vs Postgres; resolve that first.

### Cluster C — Features and workflow

- **Intent:** "notes app with wikilinks", "Pomodoro timer with daily log", "spaced repetition app", "open source PKM with graph".
- **Owning URL today:** `/` (`#features`, `#preview`).
- **Possible future pages:** none yet. Feature sub-pages would be thin until each has screenshots, limitations and a real workflow.
- **Unique material needed:** honest capability/limits (single-user, web/PWA, what sync does and does not do).

### Cluster D — Pricing and alternatives

- **Intent:** "free second brain app", "Brain Base vs Notion", "Obsidian alternative open source", "is Brain Base free".
- **Owning URL today:** `/` (`#pricing`, `#questions`).
- **Possible future page:** `/compare/notion-obsidian` — only if the owner has hands-on experience and the table can be kept current and dated.
- **Unique material needed:** a fair comparison, including where Brain Base is worse (ecosystem, plugins, mobile apps, collaboration).

### Cluster E — Project and author trust

- **Intent:** branded ("Brain Base Darshan Regmi", "who made Brain Base").
- **Owning URL today:** `/about` (owner facts filled in; noindex pending review).
- **Recommended next step:** review the facts, then publish after the Privacy Policy and Terms review; it is the highest-value trust addition after deploy.
- **Unique material needed:** maintainer identity, project start, hosting details, and contact.

## Home page metadata options

Current title (59 chars, recommended):

> Open-source second brain app for notes & focus | Brain Base

Alternatives:

1. `Open-source second brain app — notes & focus | Brain Base` (57)
2. `Free, open-source second brain app | Brain Base` (47)
3. `Open-source second brain app for notes, focus | Brain Base` (58)

Descriptions:

1. Current (152 chars):
   > Brain Base is an open-source second brain app with notes, wikilinks, a focus timer, daily logs and spaced repetition. Free, MIT licensed, self-hostable.
2. Alternative (142 chars):
   > A free, MIT-licensed second brain: notes with wikilinks, a Pomodoro timer, daily logs, a learning tracker and spaced repetition. Self-host it.

Keep the description about the product, not a keyword list. If the page changes materially, update the description only when it is no longer accurate.

## Question map

Six questions are already visible on `/` and should stay there. Future questions go to the owning page/section below.

| Question | Where it belongs | Status |
|---|---|---|
| What is a second brain app? | `/` `#questions` | Live |
| Is Brain Base free? | `/` `#questions` + `#pricing` | Live |
| Can I self-host Brain Base? | `/` `#questions`, then `/self-hosting` for steps | Live; detail page pending |
| Where is my data stored? | `/` `#questions`; privacy policy | Live; policy pending |
| How is it different from Notion or Obsidian? | `/` `#questions`; comparison page if justified | Live (short); comparison pending |
| Does it work offline? | `/` `#questions` | Live |
| What do I need to run it myself? | `/self-hosting` | Not written |
| How does the spaced-repetition scheduling work? | `/` feature section or guide | Verify SM-2 implementation before expanding |
| Can I export or delete my data? | Privacy/FAQ | Verified: items can be deleted in-app; account deletion/export by request |
| Is there a mobile app? | `/` `#questions` | Answer as PWA; do not imply native apps |
| Is it local-first or end-to-end encrypted? | Do not answer yet | **Not verified — do not claim** |
| Does it support Markdown? | `/` feature detail | **Verify before claiming** |
| Can a team use it? | `/` `#questions` | Confirmed single-user; no sharing or team features |
| Is it actively maintained? | `/about` or README | Use real release/commit facts, never a fake "updated" date |

## Page briefs

### 1. `/about` (owner facts filled, noindex pending review)

- **Title:** `About Brain Base` (16)
- **Description:** `About Brain Base: the open-source second brain app, who maintains it, how it is built, and how to get support.` (112)
- **H1:** `About Brain Base`
- **H2s:** What Brain Base is · Why it exists · Who builds it · How it is built · What it is not · Contact
- **Schema:** `AboutPage` + `Person` (only for facts visible on the page).
- **Internal links:** `/`, `#features`, `#pricing`, GitHub repo, contact.
- **Current state:** `src/app/about/page.tsx` has the owner facts filled in, `noindex`, and no sitemap entry. Do not index it until the owner review is complete.
- **Confirmed facts:** Darshan Regmi, individual, Nepal; project started early 2026; public bio links to GitHub; Neon Postgres in AWS US East 1 (N. Virginia); Vercel hosting; email/password, GitHub and Google sign-in; single-user, no sharing.
- **Still needed:** owner review of the page and contact wording; publish only after the legal pages are reviewed.

### 2. `/self-hosting` (after README is accurate)

- **Title options:** `Self-host Brain Base — open-source setup guide` (46) / `How to self-host Brain Base (Next.js + Postgres)` (48)
- **Description:** `Run Brain Base on your own machine or server: requirements, environment variables, database setup, auth and deployment notes.` (125)
- **H1:** `Self-host Brain Base`
- **H2s:** What you need · 1. Clone and install · 2. Configure environment · 3. Set up the database · 4. Run locally · 5. Deploy · Troubleshooting · Security notes
- **Unique material:** exact tested commands, required env vars (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, optional OAuth), Postgres requirement, and what to do when auth redirects fail.
- **Do not publish until:** the SQLite/Postgres contradiction in the README is resolved and every command has been run from a clean checkout.

### 3. `/compare/notion-obsidian` (only if hands-on)

- **Title:** `Brain Base vs Notion and Obsidian — honest comparison` (53)
- **Description:** `A fair look at where Brain Base fits next to Notion, Obsidian and Logseq — including the things those tools do better.` (118)
- **H1:** `Brain Base vs Notion, Obsidian and Logseq`
- **Structure:** one-paragraph verdict → comparison table → "choose Brain Base if…" → "choose something else if…" → dated sources.
- **Table rows:** license, self-hosting, notes/backlinks, daily notes, focus timer, spaced repetition, offline, collaboration, plugin ecosystem, current price.
- **Rules:** verify every competitor cell on the date of publication; link sources; state the date; do not claim superiority where it is not true. This page is not worth publishing as a keyword play.

### 4. `/guides/second-brain` (optional pillar)

- **Title:** `How to build a second brain you actually review` (47)
- **Description:** `A practical capture → focus → daily log → review loop, with the trade-offs and the parts most systems skip.` (107)
- **H1:** same as title
- **Structure:** the loop → what to capture → how to process → how to review → a weekly reset → failure modes → a worked example with real screenshots.
- **Unique material:** the owner's actual routine and screenshots. Without them this is generic advice and should stay unpublished.

## Entity coverage

Search and answer engines associate the page with entities it names clearly. Mention these naturally where true; do not stuff.

| Entity | Where it appears now | Gap / action |
|---|---|---|
| Brain Base | Title, H1, JSON-LD, body | Good |
| Second brain / PKM | Hero, Q&A | Good |
| Notes, wikilinks, backlinks | Features, JSON-LD | Good |
| Focus timer / Pomodoro | Features, JSON-LD | "Pomodoro" is in README; confirm it appears in visible copy |
| Daily log / journal | Features, JSON-LD | Good |
| Spaced repetition / SM-2 | Features, Q&A | SM-2 only in README; add one visible sentence if accurate |
| PWA / offline | Q&A | Good |
| Open source / MIT | Hero, pricing, footer | Good |
| Self-hosting / Vercel / Postgres | Hero, Q&A, README | Vercel/Postgres are not on the landing page; add via `/self-hosting` |
| Next.js / React / Prisma | README, JSON-LD not needed | Developer audience; `/about` or self-hosting page |
| Notion | Q&A | Good |
| Obsidian | Q&A | Good |
| Logseq | Not mentioned | Add only in a real comparison |
| Markdown | Not confirmed | **Verify support before claiming** |
| Darshan Regmi | JSON-LD Person, footer link, `/about` | `/about` facts filled; noindex pending review |
| "Local-first" / E2E encryption | Absent | **Do not claim** unless the architecture supports it |

## Owner facts needed

### Trust pages (owner facts supplied; noindex pending review)

- [x] `/about`: Darshan Regmi, individual, Nepal; early 2026 start; GitHub profile instead of a bio; GitHub Issues support; privacy/security by requesting a private channel on GitHub (the profile has no public email); best-effort response; no public mailing address; Neon Postgres in AWS US East 1 (N. Virginia); Vercel hosting; single-user confirmed.
- [x] `/privacy`: Darshan Regmi, individual, Nepal; GitHub Issues and a private channel requested on GitHub; Neon/AWS US East 1; Vercel standard logs; email/password, GitHub and Google auth; delete-in-app and account action by request; Neon default backups; no analytics or advertising cookies; effective when published.
- [x] `/terms`: Darshan Regmi, individual, Nepal; custom-domain URL; no stated minimum age; conservative acceptable-use list; limited content licence; as-is availability; Nepal law; termination for abuse; GitHub Issues/public and private channel on request; effective when published.
- [ ] Qualified legal review of the Privacy Policy and Terms before removing `noindex`.

### Content and product

- [x] Name for `/about`: Darshan Regmi. No public role, location, photo or personal bio; the page links to GitHub instead.
- [x] Project start: early 2026. No further origin-story details supplied.
- [x] Canonical URL: `https://brain-base.darshanregmi.com.np`. Hosted sign-up is public.
- [x] Contact channel: GitHub Issues for public support; ask for a private channel there. The GitHub profile lists no public email.
- [x] Database support: Postgres only in `prisma/schema.prisma`; README still needs fixing.
- [x] Export/import: full export is not implemented; individual items can be deleted in-app; account deletion/export is by request.
- [x] Analytics: none. The landing page's "no telemetry, no analytics" claim is still accurate.
- [ ] AI training policy (currently allowed).
- [ ] Any real usage numbers, testimonials or launch coverage — only if verifiable and permitted.
- [ ] Competitor facts for a comparison page, checked on the publication date.

## Definition of done for a new page

- One H1; title ≤ 62 chars; description 70–170 chars; self-canonical.
- Direct answer in the first paragraph; no invented proof.
- At least one internal link from `/` or the footer; descriptive anchor text.
- Remove the noindex rule if the page was a draft.
- Added to `sitemap.ts` only if public and indexable.
- `pnpm seo:check` passes after deploy.
- Owner has read it and confirmed every factual claim.
