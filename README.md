# Reverie

## Overview

### Problem

Music streaming generates enormous amounts of personal listening data, but Spotify's native "Wrapped" feature only surfaces it once a year. Casual listeners have no easy way to understand their music personality on demand — what genres define them, which artists dominate their rotation, and what that says about who they are.

### Outcome

Reverie lets any Spotify user log in, instantly analyse their recent listening history, and receive an AI-generated personality summary with a shareable public link. The result is a personalised, on-demand music identity card that can be shared with friends at any time.

- Users receive a personality label (e.g. "The Midnight Aesthete") and a narrative paragraph generated from their real listening data.
- Summaries are publicly shareable via a unique URL with no account required for the viewer.

---

## Demo

1. **Log in with Spotify.** The landing page shows a branded "Log in with Spotify" button. Clicking it redirects to Spotify's OAuth consent screen, then back to the dashboard.
    <img width="1920" height="963" alt="image" src="https://github.com/user-attachments/assets/a62288c9-b776-434f-a346-085c0bcdfee7" />

2. **Dashboard loads.** The dashboard displays a time slot picker (Today / Yesterday, split into Full Day, Morning, Afternoon, Evening, Late Night) and a **SummaryHistory** list of any previously generated reveries. Each entry shows the personality label, date, and Share / Delete actions.

3. **Pick a time window and generate.** Select a time slot (e.g. "Morning") and click generate. A server action fetches your recently played tracks from Spotify, batches artist lookups for genres and images, then sends the processed data to the Express backend.
    <img width="1920" height="1326" alt="image" src="https://github.com/user-attachments/assets/94f98fee-e954-4112-8e43-3c10271796ac" />

4. **AI creates your reverie.** The backend builds a prompt from your listening data and calls the AI adapter (Groq — Llama 3.3 70B), which returns a personality label (e.g. "The Midnight Aesthete") and a narrative paragraph. The summary is saved to MongoDB with a unique `shareId`.

5. **View the reverie.** A full-screen modal opens showing your **SummaryCard** — avatar, display name, personality tagline, date, narrative, top tracks, top artists, and top genres. Cards that scroll horizontally for tracks and artists.
    <img width="1920" height="962" alt="image" src="https://github.com/user-attachments/assets/e2929cea-b4bc-458a-9aa8-06623788d2c3" />

6. **Share or delete.** From SummaryHistory, click **Share** on any row to copy a public link (`/share/[shareId]`). Click **Delete** to remove a reverie (with a confirm/cancel step). Past reveries are always accessible from the history list.
    <img width="1920" height="1326" alt="image" src="https://github.com/user-attachments/assets/602caeb9-bfd2-4db7-8c8f-f6df348b57d3" />

7. **Public share page.** Anyone with the link can view the reverie at `/share/[shareId]` — no login required. A "Find your own Reverie" button directs them to the landing page.
    <img width="1920" height="1313" alt="image" src="https://github.com/user-attachments/assets/e4c82819-1add-45dc-a3fb-8eb111aea228" />

8. **Sign out.** Click your profile avatar in the top-right corner, then **Sign Out**. A full-screen "DRIFTING AWAY..." animation plays for 2.5 seconds before redirecting to the landing page.

---

## Technology Stack

### Frontend components

- **Next.js (App Router)** — framework, routing, server-side rendering
- **NextAuth.js** — Spotify OAuth session management (JWT strategy, 60-minute expiry)
- **Tailwind CSS** — styling
- **Framer Motion** — animations
- **Next.js Server Actions** — Spotify API calls (access token never leaves the server)

### Backend components

- **Express.js** — REST API server
- **Mongoose** — MongoDB ODM
- **MongoDB Atlas** — cloud database (summaries only, no user collection)
- **nanoid** — unique `shareId` generation
- **Provider-agnostic AI adapter** — abstraction layer over Groq / Claude / Gemini
- **Groq (Llama 3.3 70B)** — AI narrative and personality generation

---

## Installation

**Prerequisites:** Node.js 18+, MongoDB Atlas account, Spotify Developer account, Groq API key.

- [Spotify Client Guide](https://developer.spotify.com/documentation/web-api/concepts/apps)
- [Groq Quickstart](https://console.groq.com/docs/quickstart)

```bash
# 1. Clone the repository
git clone https://github.com/RestingBeast/Reverie.git Reverie
cd Reverie

# 2. Install frontend dependencies
cd frontend
pnpm install

# 3. Install backend dependencies
cd ../backend
pnpm install
```

**Environment variables — frontend (`.env.development.local`):**

```env
NEXTAUTH_URL=http://127.0.0.1:3000
NEXTAUTH_SECRET=your_nextauth_secret

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_SECRET=your_spotify_client_secret

NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
JWT_SECRET=your_shared_secret
```

**Environment variables — backend (`.env.dev`):**

```env
PORT=5000
FRONTEND_URL=http://127.0.0.1:3000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_shared_secret

AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
```

> **Note:** Use `127.0.0.1` everywhere — never `localhost` — because Spotify OAuth redirects break on localhost.

---

## Usage

```bash
# Start the backend
cd backend
pnpm dev

# Start the frontend (separate terminal)
cd frontend
pnpm dev
```

Visit `http://127.0.0.1:3000`, connect your Spotify account, and generate your summary.

**Seed the database with sample summaries:**

If you'd like to preview shared summaries without connecting your own Spotify account, seed the database:

```bash
cd backend
pnpm seed
```

Public share pages are accessible at:

```
http://127.0.0.1:3000/share/[shareId]
```

---

## Project Structure

```
Reverie/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── not-found.tsx         # Fallback page for errors
│   │   │   ├── privacy/              # Privacy & policy page
│   │   │   ├── dashboard/            # Post-login summary view
│   │   │   └── share/[shareId]/      # Public share page
│   │   ├── actions/                  # Server Actions (Spotify API calls)
│   │   ├── components/               # UI components, animations
│   │   ├── proxy.ts                  # Auth-based route redirection
│   │   └── lib/                      # NextAuth config, API client
│   └── .env.development.local
│
└── backend/
    ├── src/
    │   ├── models/
    │   │   └── summary.model.js      # MongoDB schema
    │   ├── routes/                   # Express route definitions
    │   ├── controllers/              # Request handlers & AI orchestration
    │   ├── middlewares/              # Auth (shared secret), rate limiter
    │   └── services/
    │       └── ai/
    │           ├── index.js          # Provider resolver (env-based)
    │           └── adapters/         # Provider-specific adapters
    ├── .env.dev
    └── scripts/
        └── seed.js                   # Sample data seeder
```
