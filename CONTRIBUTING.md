# Contributing to brain-base

Thanks for taking the time to contribute! Brain Base is an open-source, self-hostable second brain: notes, a focus timer, daily logs and a learning tracker.

> **`main` is protected.** Every change lands through a pull request. Direct
> pushes, force-pushes and branch deletion are blocked for everyone except the
> maintainer. If you have write access, work on a branch and open a PR — please
> don't merge your own.

## Workflow

1. Start from an up-to-date `main`:

   ```bash
   git fetch origin
   git switch -c feat/short-description origin/main
   ```

2. Make your change and commit it (see [Commit style](#commit-style)).
3. Push the branch and open a PR against `main`:

   ```bash
   git push -u origin feat/short-description
   ```

4. A maintainer reviews and merges.

If you already committed to your local `main`, move the work to a branch:

```bash
git switch -c feat/my-change
git branch -f main origin/main
```

## Local setup

Node.js 20+ and pnpm.

```bash
pnpm install
cp .env.example .env
pnpm dlx auth secret
pnpm db:push
pnpm dev
```

## Checks

Run these before opening a PR:

```bash
pnpm lint
pnpm build
```

## Commit style

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`,
`docs:`, `refactor:`, `test:`, `chore:`. Keep the subject imperative and under
~72 characters; put the "why" in the body.

Branch names: `feat/…`, `fix/…`, `docs/…`, `refactor/…`.

## Guidelines

- Keep each PR focused on one change; split unrelated work.
- Don't reformat or rename untouched code — it makes review harder.
- Add or update documentation when behaviour changes.
- **Never commit secrets** (`.env`, API keys, service-account JSON, tokens).
  Use the example env files and your own local values.
- Match the existing style and structure of the codebase.
- Self-hosting should stay a first-class path — don't add mandatory cloud services.
- Keep the UI keyboard-friendly (the spotlight and editor are core flows).
- Never commit `.env` files or secrets.

## Reporting issues

Open an issue with what you expected, what happened, and how to reproduce it.
Include your OS, runtime version, and any relevant logs (redact secrets).

## Questions

Open an issue or start a discussion in the repository — we're happy to help.
