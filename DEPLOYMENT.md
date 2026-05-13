# Deploying Brain Base

Step-by-step guide to ship Brain Base to production. Recommended path is
**Vercel + a managed Postgres** (Neon, Supabase, or Vercel Postgres) — that's
what the rest of this doc assumes. The same shape works on Railway, Render,
Fly.io, or any Node 20+ host.

---

## 0. Pre-flight checklist

Before you click "Deploy", run these locally to catch problems early:

```bash
pnpm install
pnpm exec tsc --noEmit          # types clean
pnpm lint                        # ESLint clean
pnpm build                       # production build succeeds
```

All three must pass. If they don't, fix them before deploying — the build
will fail in CI for the same reasons.

---

## 1. Create a Postgres database

SQLite (`file:./prisma/dev.db`) **does not work** in production on Vercel —
the serverless filesystem is read-only and ephemeral. Pick one:

| Provider            | Free tier | Setup link                                |
| ------------------- | --------- | ----------------------------------------- |
| **Neon**            | Yes       | <https://console.neon.tech/>              |
| **Supabase**        | Yes       | <https://supabase.com/dashboard>          |
| **Vercel Postgres** | Yes       | Add from the Vercel project's Storage tab |
| **Railway**         | Trial     | <https://railway.app/>                    |

After creating the database, copy its connection string. It will look like:

```
postgresql://USER:PASS@HOST:5432/DBNAME?sslmode=require
```

Save it — you'll paste it as `DATABASE_URL` in step 4.

---

## 2. Switch Prisma to Postgres

Edit `prisma/schema.prisma`:

```diff
 datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
   url      = env("DATABASE_URL")
 }
```

Apply the schema to the new database. Run **once** from your local machine
with the production `DATABASE_URL` in your shell:

```bash
DATABASE_URL="postgresql://USER:PASS@HOST:5432/DBNAME?sslmode=require" \
  pnpm exec prisma db push
```

This creates every table (User, Note, Tag, NoteLink, DailyLog, Resource,
ReviewCard, FocusSession, Upload) on the production database.

> **For tracked migrations** (recommended once you have real users), use
> `prisma migrate dev` locally to generate migration files, commit them, and
> add `prisma migrate deploy` to your build command (see step 5).

Commit the schema change:

```bash
git add prisma/schema.prisma
git commit -m "switch prisma provider to postgresql"
git push
```

---

## 3. Push to GitHub

If your repo isn't on GitHub yet:

```bash
gh repo create brain-base --public --source=. --remote=origin --push
```

Or push to an existing remote — Vercel needs a git source to import.

---

## 4. Import to Vercel

1. Visit <https://vercel.com/new> and select your GitHub repo.
2. **Framework preset:** Next.js (auto-detected).
3. **Build command:** leave the default — `pnpm build` already runs
   `prisma generate`.
4. **Output directory:** leave the default.
5. **Install command:** leave the default — Vercel detects `pnpm` from the
   lockfile.
6. **Root directory:** leave as repo root.
7. Set environment variables (next section).
8. Click **Deploy**.

---

## 5. Environment variables

Add these in the Vercel project's **Settings → Environment Variables** (set
them for Production _and_ Preview unless noted):

| Variable               | Required | Example / How to generate                                             |
| ---------------------- | -------- | --------------------------------------------------------------------- |
| `DATABASE_URL`         | Yes      | Postgres connection string from step 1                                |
| `AUTH_SECRET`          | Yes      | `openssl rand -hex 32` (a fresh 32-byte hex string — never reuse dev) |
| `AUTH_URL`             | Yes      | Your production origin, e.g. `https://your-app.vercel.app`            |
| `GITHUB_CLIENT_ID`     | Optional | From GitHub OAuth app                                                 |
| `GITHUB_CLIENT_SECRET` | Optional | From GitHub OAuth app                                                 |
| `GOOGLE_CLIENT_ID`     | Optional | From Google Cloud Console                                             |
| `GOOGLE_CLIENT_SECRET` | Optional | From Google Cloud Console                                             |

> **Critical:** rotate `AUTH_SECRET` for production. Never reuse the value
> from your local `.env`. If it leaks, every existing session JWT becomes
> forgeable until you rotate.

### Migrations on every deploy (recommended)

If you've moved off `db push` and started using migrations, change Vercel's
build command to apply them automatically:

```
pnpm exec prisma migrate deploy && pnpm build
```

---

## 6. Configure OAuth callbacks (optional)

If you set GitHub / Google credentials in step 5, update the callback URLs
in the provider's dashboard to point at your production origin:

| Provider | Callback URL                                           |
| -------- | ------------------------------------------------------ |
| GitHub   | `https://your-app.vercel.app/api/auth/callback/github` |
| Google   | `https://your-app.vercel.app/api/auth/callback/google` |

If you'll use Vercel Preview deployments with OAuth, add the preview origin
as an additional callback URL on the provider too.

---

## 7. Update production metadata

`src/app/layout.tsx` hard-codes the OG / metadata base URL. Edit it before
your first prod deploy:

```diff
- metadataBase: new URL("https://brainbase.pages.dev"),
+ metadataBase: new URL("https://your-app.vercel.app"),
```

…and the `openGraph.url` field on the same object. Commit + push.

---

## 8. First deploy & verify

1. Trigger the deploy (auto on push, or **Redeploy** from the Vercel UI).
2. Watch the build log — you should see:
   - `prisma generate` finish
   - Next.js compile clean
   - "Generating static pages" run
3. Once green, open the production URL.
4. Sign up at `/sign-up` with a test email.
5. Land on `/dashboard` — the live clock should tick, stats should be zeros.
6. Click **New Note** in the sidebar → create a note → confirm autosave.
7. Open `/focus` → start a 1-minute custom timer to test completion notice.
8. Open `/learn` → upload a small PDF to test `/api/upload-resource`.

If any step fails, check **Vercel → Deployments → [your build] → Runtime
Logs** for the error.

---

## File uploads on Vercel

PDF / DOCX / PPTX uploads on the Learning tab go through
`/api/upload-resource`, which writes the bytes to the `Upload` table in
Postgres and serves them back via `/api/files/[id]`. **No object storage is
required** — uploads work out of the box on Vercel's serverless runtime.

The 25 MB cap (`MAX_BYTES` in `src/app/api/upload-resource/route.ts`) is
intentional — it keeps Postgres rows small enough for Neon / Supabase free
tiers. Bump it if you have more headroom.

For very large files or high upload volume, switch to an object store
(Vercel Blob, S3, R2). The change is local to those two route files.

---

## Custom domain (optional)

In Vercel: **Settings → Domains → Add** → follow the DNS instructions.
After the domain is live:

1. Update `AUTH_URL` env var to the new origin.
2. Update `metadataBase` in `src/app/layout.tsx` and redeploy.
3. Update OAuth callback URLs in GitHub / Google.

---

## Self-hosting (alternative to Vercel)

Brain Base runs anywhere Node 20+ is available — a $5 droplet works fine.

```bash
git clone https://github.com/darshan-regmi/brain-base.git
cd brain-base
cp .env.example .env
# fill in DATABASE_URL, AUTH_SECRET, AUTH_URL
pnpm install
pnpm exec prisma db push        # or migrate deploy
pnpm build
pnpm start                       # listens on $PORT (default 3000)
```

Put it behind nginx / Caddy with a TLS cert. The service worker
(`public/sw.js`) requires HTTPS in production for the PWA install prompt.

---

## Post-deploy checklist

- [ ] Sign-up works end-to-end on the prod domain
- [ ] Sign-in with credentials works
- [ ] Sign-in with each enabled OAuth provider works
- [ ] `/notes` autosave persists after a hard refresh
- [ ] `/focus` timer survives a refresh and triggers the chime + flash
- [ ] `/review` accepts a CSV import
- [ ] `/learn` accepts a PDF upload and the file streams back from
      `/api/files/[id]`
- [ ] `metadataBase` and OG image render correctly when sharing the URL
- [ ] `AUTH_SECRET` is unique to production (not the dev value)
- [ ] Database backups are enabled on your Postgres provider

---

## Rollback

Vercel keeps every deployment. To roll back:

**Settings → Deployments → [previous green build] → Promote to Production**.

Database changes don't roll back automatically — if a recent migration
broke production, you'll need to revert the schema change and run
`prisma migrate deploy` again. Always back up before destructive
migrations.
