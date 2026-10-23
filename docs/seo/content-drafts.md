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
- **Owning URL today:** none. Footer links to GitHub.
- **Recommended next page:** `/about` — the highest-value trust addition after deploy.
- **Unique material needed:** real bio, origin story, project principles, contact.

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
| Can I export or delete my data? | Privacy/FAQ | **Verify the feature exists first** |
| Is there a mobile app? | `/` `#questions` | Answer as PWA; do not imply native apps |
| Is it local-first or end-to-end encrypted? | Do not answer yet | **Not verified — do not claim** |
| Does it support Markdown? | `/` feature detail | **Verify before claiming** |
| Can a team use it? | `/` `#questions` | Current copy says single-user; confirm |
| Is it actively maintained? | `/about` or README | Use real release/commit facts, never a fake "updated" date |

## Page briefs

### 1. `/about` (recommended next)

- **Title options:** `About Brain Base and its author | Brain Base` (44) / `Why I built Brain Base — about the project` (42)
- **Description:** `Who builds Brain Base, why it exists, and what the project is deliberately trying not to be. Open source, MIT licensed.` (119)
- **H1:** `Why I built Brain Base`
- **H2s:** What Brain Base is · Why I built it · How it is built · What it is not · Contact
- **Schema:** `AboutPage` + `Person` (only for facts visible on the page).
- **Internal links:** `/`, `#features`, `#pricing`, GitHub repo, contact.

Draft copy (placeholders must be filled or removed):

> Brain Base is an open-source second brain app I built because I was tired of juggling five different tools just to stay on top of my day. It keeps notes, a focus timer, daily logs and a learning tracker in one quiet workspace.
>
> I am [REAL NAME], a [REAL ROLE] based in [PLACE, OPTIONAL]. [ONE OR TWO SENTENCES OF VERIFIABLE BACKGROUND — what you work on, what you have built, or why this problem is yours. No invented credentials.]
>
> I started Brain Base in [REAL MONTH/YEAR]. [ONE OR TWO SENTENCES ON THE ORIGIN — what the first version did, what broke, what changed. Only facts you can stand behind.]
>
> It is built with Next.js, React, Prisma and Postgres, and it is MIT licensed. You can run it yourself, read the code, or use the hosted version at [CURRENT URL]. There is no paid tier and no telemetry.
>
> **What it is not:** a team workspace, a Notion replacement for databases and pages, or a native mobile app. It is a single-user tool for capture, focus, logs and review. [VERIFY "single-user" AGAINST THE AUTH MODEL BEFORE PUBLISHING.]
>
> Contact: [MONITORED EMAIL OR GITHUB ISSUES LINK].

Do not add a photo, location, employer or biography unless it is real and the owner approves it.

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
| Darshan Regmi | JSON-LD Person, footer link | Add `/about` for a first-party bio |
| "Local-first" / E2E encryption | Absent | **Do not claim** unless the architecture supports it |

## Owner facts needed

- [ ] Real name/role/location/photo for `/about` (all optional except name).
- [ ] Origin story details and real start date.
- [ ] Whether hosted sign-up is open to the public, and the canonical URL.
- [ ] Monitored contact channel (email or GitHub Issues/Discussions).
- [ ] Confirmed database support: Postgres only, or SQLite for local dev.
- [ ] Whether export/import exists.
- [ ] Whether analytics will be added (the site currently says none).
- [ ] AI training policy (currently allowed).
- [ ] Any real usage numbers, testimonials or launch coverage — only if verifiable and permitted.
- [ ] Competitor facts for a comparison page, checked on the publication date.

## Definition of done for a new page

- One H1; title ≤ 62 chars; description 70–170 chars; self-canonical.
- Direct answer in the first paragraph; no invented proof.
- At least one internal link from `/` or the footer; descriptive anchor text.
- Added to `sitemap.ts` only if public and indexable.
- `pnpm seo:check` passes after deploy.
- Owner has read it and confirmed every factual claim.
