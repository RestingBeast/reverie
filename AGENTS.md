# Reverie — Agent Guide

## Structure

- `frontend/` — Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- `backend/` — Express.js 5, ESM (`"type": "module"`), plain JavaScript
- Each directory has its own `package.json`, `pnpm-lock.yaml` — no root workspace

## Commands

### Frontend (`frontend/`)

- `pnpm dev` — Next.js dev server (port 3000)
- `pnpm build` — production build
- `pnpm lint` — Biome check (linter + formatter), includes `next` + `react` domain rules, respects `.gitignore` via VCS mode
- `pnpm format` — Biome format --write

### Backend (`backend/`)

- `pnpm dev` — `nodemon --exec "node --env-file=.env.dev" src/app.js`
- `pnpm seed` — seeds MongoDB with 3 sample summaries
- No test suite; placeholder `pnpm test` prints "Error: no test specified"

### Docker

- `docker compose up` in root — runs both services via `compose.yaml` (Node 26, ports 3000 + 5000)

## Environment

- Frontend env file: `.env.development.local` (or `.env.example` as template)
- Backend env file: `.env.dev` (loaded via `--env-file=.env.dev` flag)
- **`JWT_SECRET`** must be set in **both** frontend and backend env files (frontend's `.env.development.local` often missing it)
- **Always use `127.0.0.1` not `localhost`** — Spotify OAuth redirect breaks on localhost

## Architecture rules

### Frontend

- **Spotify API** called from Next.js Server Actions only; access token never leaves server
- **NextAuth.js** with Spotify provider, JWT strategy, 60-minute `maxAge`, no token refresh; scope `user-read-recently-played user-read-email`
- **Auth route**: `api/auth/[...nextauth]/route.ts` exports `authOptions` used by all Server Actions
- **Proxy** (`src/proxy.ts`, replaces deprecated `middleware.ts`): redirects `/` → `/dashboard` if authenticated, `/dashboard` → `/` if not

### Backend

- **Auth**: JWT (HS256, 60s expiry) in `Authorization: Bearer`; `jose` verifies with issuer `"Reverie Client"`; extracts `spotifyUserId` from `sub`
- **No user collection** — summaries embedded with `spotifyUserId` string only
- **Routes**: `POST /api/summaries/generate` (authenticated + rate-limited), `GET /api/summaries/:shareId` (public)
- **AI adapter**: resolved from `AI_PROVIDER` env var; currently only `groq` adapter exists (Llama 3.3 70B via `groq-sdk`)
- **Zod validation** on backend request bodies
- **Rate limiting**: 100 req/15min general, 5 AI generations/hour
- **Backend DNS**: sets Google Public DNS (`8.8.8.8`, `8.8.4.4`) via `dns.setServers()`
- **CORS**: allows `FRONTEND_URL` origin only, methods GET + POST; `app.set("trust proxy", 1)`

## Gotchas

- `JWT_SECRET` must be >= 32 characters (backend fatals on startup otherwise)
- `FRONTEND_URL` required in production (backend fatals if missing)
- Backend uses Express 5 — route handlers can use async without explicit error wrapper (Express 5 handles promise rejections)
- `allowedDevOrigins: ["127.0.0.1"]` in `next.config.ts` — needed for HMR with 127.0.0.1
- Tailwind v4 uses `@tailwindcss/postcss` (not `tailwindcss` PostCSS plugin)
