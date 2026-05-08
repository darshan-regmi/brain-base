# Run Brain Base locally

Step-by-step instructions to get a fully working dev environment on your
machine. Should take ~3 minutes from a fresh clone.

---

## 1. Prerequisites

| Tool        | Version | Why                                |
| ----------- | ------- | ---------------------------------- |
| **Node.js** | 20.x +  | Required by Next.js 16 / React 19  |
| **pnpm**    | 10.x +  | Project ships a `pnpm-lock.yaml`   |
| **Git**     | any     | Cloning + safe rollbacks           |

```bash
# Verify versions
node -v   # v20.x or higher
pnpm -v   # 10.x or higher
git --version
```

If you don't have pnpm:

```bash
npm install -g pnpm
# or, if you prefer Corepack:
corepack enable && corepack prepare pnpm@latest --activate
```

---

## 2. Clone and install

```bash
git clone https://github.com/darshan-regmi/brain-base.git
cd brain-base
pnpm install
```

`pnpm install` automatically runs `prisma generate` via the `postinstall`
hook, so the Prisma client is ready before your first `pnpm dev`.

---

## 3. Configure environment variables

Copy the template:

```bash
cp .env.example .env
```

Open `.env` and fill in **the two required values**:

```dotenv
# Required — local SQLite path
DATABASE_URL="file:./prisma/dev.db"

# Required — generate with:  openssl rand -hex 32
AUTH_SECRET=<paste-the-32-byte-hex-string-here>

# Required for OAuth callbacks; this default is correct for local dev
AUTH_URL=http://localhost:3000
```

Generate a secret:

```bash
openssl rand -hex 32
```

> **Don't reuse the secret from `.env.example`.** It's a placeholder for the
> file format, not a working value — pasting it as-is will cause NextAuth to
> reject sessions.

### Optional — OAuth providers

If you want GitHub or Google sign-in locally, set the corresponding
client ID + secret. Otherwise leave them blank — email + password works
without them.

| Provider | Get credentials                                                                              | Local callback URL                                       |
| -------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| GitHub   | <https://github.com/settings/developers>                                                     | `http://localhost:3000/api/auth/callback/github`         |
| Google   | <https://console.cloud.google.com/apis/credentials>                                          | `http://localhost:3000/api/auth/callback/google`         |

---

## 4. Initialise the database

```bash
pnpm db:push
```

This creates `prisma/dev.db` (SQLite) and syncs the schema. You can browse
the data any time with:

```bash
pnpm db:studio
```

---

## 5. Start the dev server

```bash
pnpm dev
```

Open <http://localhost:3000> and sign up at `/sign-up`. You'll land on the
Dashboard. ✦

The dev server uses Turbopack, hot-reloads on save, and prints SQL queries
to the terminal so you can see what each interaction touches.

---

## Useful scripts

| Command              | What it does                                       |
| -------------------- | -------------------------------------------------- |
| `pnpm dev`           | Start the dev server on port 3000                  |
| `pnpm build`         | Production build (runs `prisma generate` first)    |
| `pnpm start`         | Run the production server (after `pnpm build`)     |
| `pnpm lint`          | Run ESLint on the whole project                    |
| `pnpm exec tsc --noEmit` | Type-check without emitting files              |
| `pnpm db:push`       | Sync schema → SQLite (no migrations)               |
| `pnpm db:studio`     | Open Prisma Studio                                 |
| `pnpm db:reset`      | Wipe and recreate the local database               |

---

## Troubleshooting

### `MissingSecret: Please define a 'secret'`
`AUTH_SECRET` is missing or empty in `.env`. Generate one with
`openssl rand -hex 32` and restart `pnpm dev`.

### `Cannot find module '@/lib/prisma'` or `@prisma/client`
The Prisma Client wasn't generated. Run:

```bash
pnpm exec prisma generate
```

…or just `pnpm install` again (the `postinstall` hook re-runs it).

### Sign-up succeeds but `/dashboard` won't load
The schema isn't applied. Run `pnpm db:push`, then check
`pnpm db:studio` to verify the `User` table exists.

### Port 3000 is already in use
Either kill the other process, or run on a different port:

```bash
PORT=3001 pnpm dev
```

### Tailwind classes (`bg-vellum-1`, etc.) aren't applying
The token system uses Tailwind v4's `@theme` directive in
`src/app/globals.css`. Restart `pnpm dev` after editing tokens.

### Prisma error after pulling new code
Schema may have changed. Run:

```bash
pnpm exec prisma generate && pnpm db:push
```

### File uploads fail with "Unauthorized"
Sign in first — `/api/upload-resource` requires an authenticated session.

---

## Resetting to a clean slate

If you want to start over without re-cloning:

```bash
pnpm db:reset            # wipes prisma/dev.db
rm -rf .next             # clears Next build cache
pnpm install             # re-runs prisma generate
pnpm dev
```

Done. You're ready to build.
