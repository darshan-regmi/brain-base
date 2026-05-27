# Brain Base 🧠

> The app I built because I was tired of juggling 5 different tools just to stay on top of my day.

An open-source, self-hostable second brain — notes, focus timer, daily logs &
learning tracker, all in one place. No subscriptions. No noise.

**🌐 [brain-base-lake.vercel.app](https://brain-base-lake.vercel.app/) — IS NOW LIVE**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Configure environment variables](#3-configure-environment-variables)
  - [4. Initialise the database](#4-initialise-the-database)
  - [5. Run the dev server](#5-run-the-dev-server)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [Self-Hosting](#self-hosting)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Surface                | What it does                                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Quick Capture (⌘K)** | A spotlight modal you can summon from anywhere. Search existing notes or create a new one in one keystroke.                                         |
| **Notes**              | A manuscript-style editor (Fraunces title, Geist body) with debounced autosave, tag editor, and `[[wikilink]]` parsing.                             |
| **Focus Timer**        | A single candle-stroke ring under the desk lamp. 25 / 5 / 15 minute modes, breathing animation when active, attendance dots logged to the database. |
| **Daily Log**          | One page per day, asymmetric two-column layout, rotating prompts, mood + energy sliders. Auto-creates today's entry on first visit.                 |
| **Knowledge Base**     | The "wall" — list view grouped by tag, or a force-directed graph with neighbor highlighting. Driven by `[[wikilinks]]`.                             |
| **Learning Tracker**   | A _Now Reading_ hero strip plus filtered cards for Reading / Course / Watching with candle-thin progress bars.                                      |
| **Spaced Repetition**  | A single index card under the lamp. 3-D flip, four-button rating, SM-2 scheduling.                                                                  |
| **PWA**                | Installs like a native app. Service worker caches the app shell for offline reads.                                                                  |

---

## Tech Stack

| Layer     | Tech                                                           |
| --------- | -------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack, React 19, React Compiler)   |
| Language  | TypeScript 5                                                   |
| Styling   | Tailwind CSS v4 (token-driven via `@theme`)                    |
| Animation | Framer Motion                                                  |
| Auth      | NextAuth v5 (`next-auth@5-beta`) — Credentials, GitHub, Google |
| Database  | Prisma 6 — SQLite locally, Postgres in production              |
| Graph     | `react-force-graph-2d`                                         |
| Shaders   | `@paper-design/shaders-react` (landing + auth surfaces only)   |

---

## Getting Started

### Prerequisites

- **Node.js 20+** (Next 16 requires it)
- **pnpm 10+** — the project ships a `pnpm-lock.yaml` and uses pnpm workspaces

```bash
# Install pnpm if you don't have it
pnpm install -g pnpm
```

### 1. Clone the repository

```bash
git clone https://github.com/darshan-regmi/brain-base.git
cd brain-base
```

### 2. Install dependencies

```bash
pnpm install
```

This will also run `prisma generate` automatically (via the `postinstall`
hook), so the Prisma Client is ready before you start coding.

### 3. Configure environment variables

Create your local `.env` file from the template:

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

```bash
# Database — SQLite locally
DATABASE_URL="file:./prisma/dev.db"

# NextAuth — REQUIRED
AUTH_SECRET=                    # generate one (see below)
AUTH_URL=http://localhost:3000

# OAuth — optional (leave blank to use email/password only)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Generate `AUTH_SECRET`** — pick one:

```bash
# Option A — NextAuth helper (writes it directly to .env.local)
pnpm dlx auth secret

# Option B — manual
openssl rand -base64 32
```

**Optional OAuth setup:**

- **GitHub:** [Create an OAuth app](https://github.com/settings/developers) →
  Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
- **Google:** [Create OAuth credentials](https://console.cloud.google.com/apis/credentials)
  → Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

If you skip OAuth, email + password sign-up still works.

### 4. Initialise the database

```bash
pnpm db:push
```

This creates `prisma/dev.db` and syncs the schema. You can run
`pnpm db:studio` any time to open Prisma Studio and inspect the data.

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up at
`/sign-up`, then you're dropped into `/dashboard`. ✦

> **FOR MORE DETAILED GUIDE PLEASE REFER TO RUN-LOCALLY.md**

---

## Available Scripts

| Command          | What it does                                        |
| ---------------- | --------------------------------------------------- |
| `pnpm dev`       | Start the dev server with Turbopack on port 3000    |
| `pnpm build`     | Build for production (runs `prisma generate` first) |
| `pnpm start`     | Start the production server                         |
| `pnpm lint`      | Run ESLint                                          |
| `pnpm db:push`   | Sync Prisma schema → database (no migrations)       |
| `pnpm db:studio` | Open Prisma Studio                                  |
| `pnpm db:reset`  | Wipe and recreate the database                      |

---

## Project Structure

```
brain-base/
├── prisma/
│   └── schema.prisma           # User, Note, Tag, NoteLink, DailyLog,
│                               # Resource, ReviewCard, FocusSession, Upload
├── public/
│   └── sw.js                   # PWA service worker
├── src/
│   ├── app/
│   │   ├── (auth)              # /sign-in, /sign-up, /forgot-password
│   │   ├── api/auth            # NextAuth handler + /register
│   │   ├── api/upload-resource # POST file → DB (PDF/DOCX/PPTX)
│   │   ├── api/files/[id]      # GET streamed file (owner-only)
│   │   ├── actions/            # Server actions: notes, log, focus, review, resources, profile
│   │   ├── dashboard/          # / dashboard (real DB queries)
│   │   ├── notes/[id]          # Manuscript editor
│   │   ├── focus/              # Pomodoro
│   │   ├── log/[date]/         # Daily journal
│   │   ├── kb/                 # Knowledge base (list + graph)
│   │   ├── learn/              # Learning tracker
│   │   ├── review/             # Spaced repetition
│   │   ├── manifest.ts         # PWA manifest
│   │   ├── layout.tsx          # Root layout — fonts + SessionProvider
│   │   ├── page.tsx            # Landing
│   │   └── globals.css         # Design tokens (@theme)
│   ├── components/
│   │   ├── ui/                 # Surface, CandleButton, GhostButton, Field,
│   │   │                       # TagPill, StatCard, Wordmark, MeshBackdrop, motion
│   │   ├── app/                # AppSidebar, AppTopbar, Spotlight, Providers, RegisterSW
│   │   ├── landing.tsx         # Multi-section landing page
│   │   └── navbar.tsx          # Auth-aware top nav
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth-helpers.ts     # requireUser(), getOptionalUser()
│   │   ├── notes.ts            # Note queries + dashboard stats
│   │   ├── wikilinks.ts        # [[link]] parser + sync
│   │   ├── dates.ts            # Date helpers
│   │   ├── sm2.ts              # Spaced-repetition algorithm
│   │   └── utils.ts            # cn() helper
│   └── auth.ts                 # NextAuth v5 config
├── .env.example
├── next.config.ts
└── package.json
```

---

## Design System

Brain Base is built on **Lamplight Editorial** — a dark, literary workspace
lit by candlelight. Design tokens live in `src/app/globals.css`:

- **Type** — Fraunces (display), Geist (body), Geist Mono (timer / keyboard
  hints). All wired via `next/font` in `src/app/layout.tsx`.
- **Color** — ink (canvas) + vellum (translucent paper) + a single candle
  accent (`#FAF3E1 → #F5E7C6`). No second accent.
- **Motion** — three primitives (bloom / hover / press) plus one timer-only
  _breathing_ exception. Lives in `src/components/ui/motion.ts`.
- **Surfaces** — mesh gradient shaders are scoped to `/`, `/sign-in`,
  `/sign-up`, `/forgot-password` only. App pages stay flat for performance.

Compose UI primitives from `src/components/ui/` rather than reaching for
inline `rgba()` styles.

---

## Production Build

```bash
pnpm build
pnpm start
```

The build runs `prisma generate` first, then compiles the Next app with
Turbopack. Pages are split between static (landing, sign-in, sign-up,
forgot-password) and dynamic (everything authenticated).

---

## Deployment

**Recommended:** Vercel.

1. Push the repo to GitHub.
2. Import it on [vercel.com/new](https://vercel.com/new). Framework preset:
   **Next.js**. Build command stays as the default — `pnpm build` already runs
   `prisma generate`.
3. **Switch the database** — SQLite isn't persistent on Vercel's serverless
   filesystem. Provision Postgres (Neon, Supabase, or Vercel Postgres), then
   change `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   Run `pnpm exec prisma db push` once locally against the production URL (or
   set up `prisma migrate deploy` in your build pipeline).
4. **Set environment variables** in Vercel (same keys as `.env.example`):
   - `DATABASE_URL` — your Postgres connection string
   - `AUTH_SECRET` — generate with `openssl rand -hex 32`
   - `AUTH_URL` — your production origin (e.g. `https://your-app.vercel.app`)
   - Optional: `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`,
     `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
5. **Update OAuth callback URLs** to your production domain:
   - GitHub → `https://your-app.vercel.app/api/auth/callback/github`
   - Google → `https://your-app.vercel.app/api/auth/callback/google`

**File uploads** (PDF/DOCX/PPTX in the Learning tab) are stored as Bytes in
the database, so they work on Vercel out of the box without object storage.
The 25 MB cap keeps row sizes reasonable; bump `MAX_BYTES` in
`src/app/api/upload-resource/route.ts` if you need more.

**Cloudflare Pages** also works — same setup, but you'll need to wire
`@cloudflare/next-on-pages` into the build.

> **FOR MORE DETAILED GUIDE PLEASE REFER TO DEPLOYMENT.md**

---

## Self-Hosting

Brain Base runs anywhere Node 20+ is available — your laptop, a Raspberry
Pi, a $5 droplet.

```bash
git clone https://github.com/darshan-regmi/brain-base.git
cd brain-base
cp .env.example .env
# fill in AUTH_SECRET (and optionally OAuth keys)
pnpm install
pnpm db:push
pnpm build
pnpm start
```

A Docker setup is planned — [contributions welcome](#contributing).

---

## Troubleshooting

**`MissingSecret: Please define a 'secret'`**
Your `AUTH_SECRET` is missing or empty in `.env` (Next does **not** load
`.env.example`). Generate one with `pnpm dlx auth secret` and restart the dev
server.

**`Cannot find module '@/lib/prisma'`**
Run `pnpm install` (which triggers `prisma generate`), or run
`pnpm exec prisma generate` directly.

**Sign-up succeeds but `/dashboard` won't load**
Make sure `pnpm db:push` has been run — the User table needs to exist before
auth can create a session. Run `pnpm db:studio` to verify rows.

**OAuth redirects to `/sign-in?error=Configuration`**
Either `AUTH_SECRET` is missing or your provider client ID/secret is wrong.
Check the dev-server logs for the exact reason.

**Tailwind classes like `bg-vellum-1` aren't applying**
The token system uses Tailwind v4's `@theme` directive in `src/app/globals.css`.
Restart the dev server after editing tokens.

**`Build error: workspace root` warning**
There's a parent `package-lock.json` somewhere up your filesystem. The
`turbopack.root` in `next.config.ts` already pins this — restart the dev
server if the warning persists.

---

## Roadmap

- [x] Coming soon page
- [x] Hero section and login pages
- [x] Project setup & auth (NextAuth v5 + Prisma + SQLite)
- [x] Quick capture + notes (⌘K spotlight, manuscript editor, autosave)
- [x] Focus timer (candle-ring Pomodoro + attendance log)
- [x] Daily log (asymmetric layout + 14-day dateline + mood / energy)
- [x] Knowledge base with linked notes (`[[wikilinks]]`, list + force graph)
- [x] Learning tracker (Reading / Course / Watching with progress)
- [x] Spaced repetition reminders (SM-2)
- [x] Dark mode (Lamplight Editorial, committed — no light mode)
- [x] PWA support (manifest + service-worker shell cache)
- [ ] Docker setup
- [x] Public launch 🚀

---

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create your branch — `git checkout -b feature/your-feature`
3. Commit — `git commit -m 'add: your feature'`
4. Push — `git push origin feature/your-feature`
5. Open a Pull Request

Please open an issue first for major changes so we can discuss the approach.

---

## License

MIT © [Darshan Regmi](https://github.com/darshan-regmi)

---

<p align="center">
  Built in public with ☕ and too many open tabs.
</p>
