# Sonic-Self

## Overview

### Problem

Music streaming generates enormous amounts of personal listening data, but Spotify's native "Wrapped" feature only surfaces it once a year. Casual listeners have no easy way to understand their music personality on demand - what genres define them, which artists dominate their rotation, and what that says about who they are.

### Outcome

Sonic-Self lets any Spotify user log in, instantly analyse their recent listening history, and receive an AI-generated personality summary with a shareable public link. The result is a personalised, on-demand music identity card that can be shared with friends at any time - not just in December.

- Users receive a personality label (e.g. "The Midnight Aesthete") and a narrative paragraph generated from their real listening data.
- Summaries are publicly shareable via a unique URL with no account required for the viewer.

---

## Demo

**Flow: Login → Analyse → Share**

1. User visits the app and clicks **Connect Spotify**.
2. Spotify OAuth redirects back and NextAuth.js establishes a session.
3. A server action fetches the user's recent tracks and batches artist lookups to resolve genres.
4. The processed payload is sent to the Express backend, which calls the AI adapter and returns a personality summary.
5. The summary is saved to MongoDB with a unique `shareId`.
6. The user sees their personality card and can copy a public link at `/share/[shareId]`.

> Screenshots / GIFs to be added.

---

## Technology Stack

### Frontend

| Technology             | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| Next.js (App Router)   | Framework, routing, server-side rendering         |
| NextAuth.js            | Spotify OAuth session management                  |
| Tailwind CSS           | Styling                                           |
| Framer Motion          | Animation                                         |
| Next.js Server Actions | Spotify API calls (token never exposed to client) |

### Backend

| Technology                   | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| Express.js                   | REST API server                           |
| Mongoose                     | MongoDB ODM                               |
| MongoDB Atlas                | Cloud database — stores summaries         |
| nanoid                       | Unique `shareId` generation               |
| Provider-agnostic AI adapter | Abstraction layer over Groq/Claude/Gemini |
| Groq (Llama 3.3 70B)         | AI narrative and personality generation   |

---

## Development Approach with AI

### AI Tools & Services

| Tool / Model         | Purpose                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| Groq — Llama 3.3 70B | Generates personality label and narrative from listening data              |
| Claude (Anthropic)   | Development assistant - architecture decisions, code generation, debugging |
| Gemini (Google)      | Development assistant - code generation, debugging                         |

### AI Adapter Pattern

The backend uses a provider-agnostic adapter so the underlying AI model can be swapped without changing application code. The active provider is set via the `AI_PROVIDER` environment variable.

```
services/ai/
├── index.js          ← resolves provider from env
└── adapters/
    └── groqAdapter.js
```

### Key Review Points & Decisions

| Review Point                     | Decision                                                                            |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| Where to call the Spotify API    | Kept in Next.js Server Actions — access token never leaves the Next.js layer        |
| Token refresh strategy           | No refresh — 60-minute session is sufficient for the use case                       |
| User storage                     | No user collection in MongoDB — summaries identified by `spotifyUserId` string only |
| Auth between Next.js and Express | Shared secret via `x-api-secret` header (only in Sever components or actions)       |
| Share page auth                  | Public — no login required to view a shared summary                                 |

---

## Installation

**Prerequisites:** Node.js 18+, MongoDB Atlas account, Spotify Developer account, Groq API key.
- [Spotify Client Guide](https://developer.spotify.com/documentation/web-api/concepts/apps)
- [Groq Quickstart](https://console.groq.com/docs/quickstart)

```bash
# 1. Clone the repository
git clone https://github.com/RestingBeast/sonic-self.git sonic-self
cd sonic-self

# 2. Install frontend dependencies
cd frontend
# Using pnpm
pnpm install

# OR using npm
npm install

# 3. Install backend dependencies
cd ../backend
# Using pnpm
pnpm install

# OR using npm
npm install
```

**Environment variables — frontend (`.env.development.local`):**

```env
NEXTAUTH_URL=http://127.0.0.1:3000
NEXTAUTH_SECRET=your_nextauth_secret

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_SECRET=your_spotify_client_secret

NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
INTERNAL_API_SECRET=your_shared_secret
```

**Environment variables — backend (`.env.dev`):**

```env
PORT=5000
FRONTEND_URL=http://127.0.0.1:3000
MONGO_URI=your_mongodb_atlas_uri
INTERNAL_API_SECRET=your_shared_secret

AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
```

### Note: We cannot use localhost as Spotify API redirects to 127.0.0.1\_

## Usage

```bash
# Start the backend
cd backend
# Using pnpm
pnpm run dev

# OR using npm
npm run dev

# Start the frontend (separate terminal)
cd frontend
# Using pnpm
pnpm run dev

# OR using npm
npm run dev
```

Visit `http://127.0.0.1:3000`, connect your Spotify account, and generate your summary.

**Seed the database with sample summaries:**
If you don't want to create Spotify Client, you can seed the database and see three examples of shared summaries

```env
FRONTEND_URL=http://127.0.0.1:3000
MONGO_URI=your_mongodb_atlas_uri
```

You will need these two variables in your `.env.dev`

```bash
cd backend
# Using pnpm
pnpm run seed

# OR using npm
npm run seed
```

Public share pages are accessible at:

```
http://localhost:3000/share/[shareId]
```

---

## Project Structure

```
Sonic-Self/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── not-found.tsx         # Fallback page for errors
│   │   │   ├── privacy/              # Privacy & Policy Page
│   │   │   ├── dashboard/            # Post-login summary view
│   │   │   └── share/[shareId]/      # Public share page
│   │   ├── actions/                  # Server Actions (Spotify API calls)
│   │   ├── components/               # Animations, Buttons, etc
│   │   ├── proxy.ts                  # Redirection based on authetication
│   │   └── lib/                      # NextAuth config, API client
│   └── .env.development.local
│
└── backend/
    ├── src/
    │   ├── models/
    │   │   └── summary.model.js      # MongoDB schema
    │   ├── routes/                   # Express routes
    │   ├── controllers/              # Request handlers
    │   ├── middlewares/              # Auth (shared secret), rate limiter
    │   └── services/
    │       └── ai/
    │           ├── index.js          # Provider resolver
    │           └── adapters/         # groqAdapter.js, etc.
    ├── .env.dev
    └── scripts/
        └── seed.js                   # Sample data seeder
```

---

## Reflection

**What worked well:**

- Keeping Spotify API calls exclusively in Server Actions. The access token never touches the client or the Express layer.
- The provider-agnostic AI adapter proved really useful. People with any AI subscriptions can write their own adapter and change the env variable
- Using `nanoid` for `shareId` and skipping a user collection kept the data model lean and the public share flow stateless.

**What was challenging:**

- The processing of an artist's genres and avatar need to be done after fetching two responses from the Spotify API
- Mobile responsiveness was a real hassle since the site focused more on UI and UX
- NextAuth.js session management with Spotify has edge cases around token expiry. The decision to not implement refresh and rely on a 60-minute session was a deliberate simplification

**Changes made during development:**

- Initially planned to store user data in a separate collection. Dropped in favour of embedding `spotifyUserId` directly on the summary — simpler logic.
- Moved from a direct Groq SDK call in the route handler to the adapter pattern after realising a second AI provider would require duplicating logic.
- Summary model had some additonal fields added and animations were added to mitigates the emptiness of the card
- Added rate-limiting middleware to stop the spamming of AI related endpoint

**What was failing:**

- the Summary models had to modified too many times, needed to carefully inspect the Spotify API response first
- The shared API secret was used to for the client and server handshake, not sure if it's a good way or not
- Spent too much time on animations and frontend design, ignoring some functionaliy like input-sanitation, error-handling
- There are major glaring security issues like json injections and propmt injections, never really sanitized on the backend side
