# Sonic-Self — Agent Guide

## Structure
- `frontend/` — Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- `backend/` — Express.js 5, ESM (`"type": "module"`), plain JavaScript
- Each directory has its own `package.json`, `pnpm-lock.yaml` — no root workspace

## Commands

### Frontend (`frontend/`)
- `pnpm dev` — Next.js dev server
- `pnpm build` — production build
- `pnpm lint` — Biome check (linter + formatter), includes `next` + `react` domain rules
- `pnpm format` — Biome format --write

### Backend (`backend/`)
- `pnpm dev` — `nodemon --exec "node --env-file=.env.dev" src/app.js`
- `pnpm seed` — seeds MongoDB with 3 sample summaries
- No test suite; placeholder `pnpm test` prints "Error: no test specified"

## Environment
- Frontend env file: `.env.development.local` (or `.env.example` as template)
- Backend env file: `.env.dev` (loaded via `--env-file=.env.dev` flag)
- **Always use `127.0.0.1` not `localhost`** — Spotify OAuth breaks on localhost

## Architecture rules
- **Frontend → Spotify**: called from Next.js Server Actions only; access token never leaves server
- **Frontend → Backend**: JWT (HS256, 30s expiry) in `Authorization: Bearer` header, minted from shared `JWT_SECRET`
- **Backend auth**: `jose` verifies JWT with issuer `"Sonic-Self Client"`; extracts `spotifyUserId` from `sub`
- **No user collection** — summaries embedded with `spotifyUserId` string only
- **Share pages are public** — no auth required at `/share/[shareId]`
- **AI adapter**: resolved from `AI_PROVIDER` env var; currently only `groq` adapter exists (uses Llama 3.3 70B)
- **Zod validation** on backend request bodies
- **Rate limiting**: 100 req/15min general, 5 AI generations/hour
- **Backend DNS**: sets Google Public DNS (`8.8.8.8`, `8.8.4.4`) via `dns.setServers()`

## Gotchas
- `JWT_SECRET` must be >= 32 characters (backend fatals on startup otherwise)
- `FRONTEND_URL` required in production (backend fatals if missing)
- Backend uses Express 5 — route handlers can use async without explicit error wrapper (Express 5 handles promise rejections)
- `allowedDevOrigins: ["127.0.0.1"]` in `next.config.ts` — needed for HMR with 127.0.0.1
- Tailwind v4 uses `@tailwindcss/postcss` (not `tailwindcss` PostCSS plugin)
- `proxy.ts` in frontend `src/` is unused (README docs only) — not registered as middleware
