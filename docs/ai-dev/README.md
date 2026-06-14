## AI Tools

| Tool                  | Role                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| opencode (big pickle) | Refactoring, bug fixes, code review, feature planning and implementation |
| Claude (Sonnet 4.6)   | Architecture guidance, code generation, debugging                        |
| Gemini (3.5 Flash)    | code generation, debugging                                               |

---

## Development Timeline

The project evolved over **85 commits** across two distinct iterations:

### Iteration 1 (May 11 – May 17) — Foundation

| Date      | Milestone                                                        |
| --------- | ---------------------------------------------------------------- |
| May 11    | Next.js + Express scaffold, Spotify OAuth with NextAuth.js       |
| May 12    | Server Actions for recently played tracks, MongoDB connection    |
| May 13    | Landing page, summary generation pipeline, genre resolution      |
| May 14    | Auth middleware, rate limiting, JWT HS256, StatCard redesign     |
| May 15    | README, seeding script, demo screenshots, Docker Compose         |
| May 16–17 | CORS hardening, security headers, typography refactor, Vercel SI |

**Key output:** A working MVP — user logs in via Spotify, sees an AI-generated personality card, and can share a public link.

### Iteration 2 (June 13 – June 14) — Polish & Fixes

| Date    | Milestone                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------ |
| June 13 | Rebrand to "Reverie", Summary History, time-slot context for AI, new landing animation, privacy page                     |
| June 14 | Diversity algorithm fix, mobile gradient fix, JWT from session, rate-limit adjustment, error handling pass, final README |

**Key output:** Polished UI, mobile-responsive, semantically accurate top-track selection

---

## Workflow

### Iteration 1 — Chat-Based Manual Flow

Iteration 1 followed a manual prompt-copy-paste cycle with Claude and Gemini:

1. **Prompt** — Write a natural-language request describing the feature or fix needed (e.g. "Create a landing page with a gradient heading and Spotify login button").
2. **Review output** — Read the AI-generated code, assess correctness and fit with the existing codebase.
3. **Copy code output** — Manually select and copy the relevant code blocks from the chat interface.
4. **Modify code output** — Paste into the editor, then adjust imports, types, and integration points by hand. Often required 2–3 rounds per feature to align with the real codebase.

There was no tool integration — every change flowed through the clipboard. Context was maintained in a single long-running chat session, which degraded after ~30–40 exchanges as earlier decisions scrolled out of view.

### Iteration 2 — OpenCode Integrated Flow

Iteration 2 used opencode's **Plan mode** and **Build mode**:

1. **Plan mode** — Ask opencode to explore the codebase, understand current state, plan new features, and summarise into review points before the actual implementation. Example: "I want to add summaries history in the dashboard. Can you make a plan for the feature?" triggered a scan of the related codes, returning a structured feature review with todos.
2. **Build mode** — Give opencode concrete implementation tasks. It reads relevant files, proposes edits, and runs verification (build, lint) automatically.
3. **Review & iterate** — Review the output, request corrections or refinements, cross-check with Claude, then run a final build check.

Finally, the code base would be reviewed by both Opencode and Claude for security review. Issues were broken into severity-based batches (Critical → High → Medium → Low). Each fix was verified with `pnpm run build` before proceeding. Parallel reads and edits were used where possible. Decisions were documented in AGENTS.md as they were made.

### Commit Breadown by Severity

From the git history, the fix trajectory was:

| Severity | Example Commits                                                                   |
| -------- | --------------------------------------------------------------------------------- |
| Critical | `Fix: JWT mint from session.user.userId`, `Fix: diversity algorithm`              |
| High     | `Fix: RevealText not showing up in mobile browser`, `Fix: Correct word breaking`  |
| Medium   | `Fix: broken url in next.config`, `Fix: Frontend URL fallback`, `Fix: camel case` |
| Low      | `Fix: typo`, `Change favicon`, `Remove unused assets`                             |

---

## Key Decisions

| Review Point                              | Decision Made                                                                                  | Related Commits                                                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Rebrand from "Sonic-Self" to "Reverie"    | Full rename across codebase, new landing animation                                             | `ed23752 Rebrand` + `27f53ce Rebrand` + `1fba27a New Landing Page Animation`                                 |
| Data model — user collection or embedded? | No user collection — `spotifyUserId` embedded directly on summary documents                    | `74aaf3d Generate summary and save it to database`                                                           |
| AI provider coupling                      | Provider-agnostic adapter pattern (`services/ai/index.js` + `adapters/`)                       | `a4bcca5 Revise README for project details` (adapter pattern documented)                                     |
| Auth between Next.js and Express          | JWT (HS256, 60s expiry) in `Authorization: Bearer`; issuer `"Reverie Client"`                  | `15566af Implemented short-lived token for improved security` + `90559fc Change JWT token expiration to 60s` |
| API safeguard strategy                    | Two-tier rate limiting: 100 req/15min general, 50 AI generations/hour                          | `fd8cfa1 API Safeguards (rate-limiting and secret handshake)` + `6038221 Adjust rate limiting`               |
| Security headers                          | Helmet.js with CORS restricted to `FRONTEND_URL` origin only, GET + POST + DELETE methods only | `652363f Security Headers` + `d0b27c4 Improve CORS config`                                                   |
| LLM prompt quality                        | Time-slot context injected into AI prompt so narrative reflects time-of-day patterns           | `44e98f6 Feat: time slots` + `8e41a16 Feat: give context to LLM about listening session`                     |
| Summary History feature                   | Dashboard displays all past summaries with inline delete (confirm/cancel via local state)      | `c020e65 Feat: Summary History`                                                                              |
| selectTopTracks diversity                 | 90% play-count threshold — within-10% tracks from a new artist beat same-artist tracks         | `9d3626e Fix: diversity algorithm`                                                                           |
| spotifyUserId exposure                    | Removed from client Props; extracted from JWT `sub` claim server-side                          | `1a02287 Fix: JWT mint from session.user.userId`                                                             |
| Typography system                         | Refactored to consistent font-display/font-body tokens across all components                   | `bd8e633 Typography Refactor`                                                                                |

---

## Key Prompts Used

### Phase 1 — Ideation & Architecture Planning (Claude)

1. **Project viability**: "Would it possible to export spotify listening history and make something like spotify wrapped? Could this be done?" — Claude confirmed the Spotify Web API exposes recently played tracks via GET /me/player/recently-played, and that a personality summary could be generated by feeding listening data into an LLM. This validated the core concept and led to the decision to use NextAuth.js for Spotify OAuth.

2. **Stack architecture**: "So I am thinking about using Next.js for frontend, and Express for backend. Would I need a database? If I need a database, I am thinking about using MongoDB. Planned Features include: Logging in with Spotify, Generating personality summaries and narrative based on Recent Listening History" — Claude recommended MongoDB for storing generated summaries with a unique shareId for public access.

3. **Repo structure**: "Do I create separate repo for front-end and back-end, or a monorepo? I prefer simplicity." — Claude recommended separate directories within a single repo with independent package.json files and no root workspace, avoiding monorepo tooling complexity (Turborepo, Nx) that wasn't needed for a two-service project. This decision is reflected in the final project layout.

### Phase 2 — Feature Implementations & Bug Fixes (Claude, Gemini & Opencode)

4. **Spotify API boundary**: "I think I might want to generate a personality along with the summary. I want to know where should I call the Spotify API. I am thinking about getting the recent playing tracks via a server component in NextJS and passing the tracks to the backend. I feel iffy about sending the access_token to the backend." — Claude confirmed that Server Actions were the right place for Spotify calls and that the backend should never see the Spotify access token. The backend receives only the processed listening data (tracks, artists, genres) and the JWT-authenticated spotifyUserId.

5. **AI provider abstraction**: "For AI narrative generation, I want to know what are some free options? I want to write the generation logic in a way that if I decide to change the model, I wouldn't have to rewrite much code. I want code separation." — Claude surveyed free tier options (Groq Llama 3, Claude free tier, Gemini API free tier) and recommended a provider-agnostic adapter pattern. The resulting `services/ai/index.js` + `adapters/groqAdapter.js` architecture meant switching providers only requires adding a new adapter file and changing the `AI_PROVIDER` env var.

6. **Dashboard & summary management**: "I want to give the users the ability to manage their summaries. Can you help me with the dashboard overhaul? I also want to include a way to copy the share link. Can you suggest me some layout? Do you think the generated summary should move to a separate page?" — Claude proposed separating the summary view from the dashboard into a dedicated modal within the page. This introduced the Summary History feature and the inline delete UI (replacing the browser `window.confirm()` with a local state confirm/cancel pattern).

### Phase 3 — Refactoring (Opencode & Claude)

7. **Typography & design system**: "Currently, the code base is super messy and the typography is not consistent. Can you help me refactor? Before you help me refactor, can you suggest some fonts or colors that might got well with site?" — Claude recommended a pair of fonts (a display font for headings, a body font for text) and a coral/amber/white color palette. This led to the `bd8e633 Typography Refactor` commit which introduced `font-display` and `font-body` utility classes and consolidated all color tokens. The inconsistent font classes that had accumulated during the Gemini provider swap were reconciled.

8. **Delete confirmation UI**: "When the user deletes a summary, the browser window pops up. It's kind of ugly. Can you help me design the UI?" — the default `window.confirm()` dialog was replaced with an inline confirmation pattern using local React state. A "Confirm Delete / Cancel" button pair slides in when the user clicks delete, matching the site's dark theme and avoiding the browser-native dialog box.

### Phase 4 — Security Review & Triage (Opencode & Claude)

9. **Codebase scan**: "Scan the codebase for potential issues, bugs, and improvements" — opencode read every source file, identified ~25 issues, and sorted them into Critical (4), High (5), Medium (7), and Low (9) buckets with exact file paths and suggested fixes.

10. **Issue triage — Critical/High**: "Fix the Critical and High issues" — applied in a single batch with `pnpm build` verification. Fixed JWT extraction from `session.user.userId` (security), diversity algorithm in `selectTopTracks` (correctness), mobile RevealText (rendering), and word-breaking on mobile (layout).

11. **Issue triage — Medium/Low**: "Fix the Medium and Low issues" — second batch covering broken `next.config` URL, Frontend URL fallback in proxy, camelCase inconsistencies, typo fixes, favicon replacement, unused asset cleanup, and character limit adjustments.

---

## Reflection

### What worked well

- **Speed of iteration** — AI could generate complete components (NeonLoading, RevealText, StatCard) in seconds, letting focus shift to polish and integration.
- **Architecture guidance** — Claude helped design the provider-agnostic AI adapter pattern early on, which avoided a rewrite when adding the second iteration. The adapter layer (`services/ai/index.js` + `adapters/`) was designed in a single architecture conversation.
- **Severity-based batching** — Processing fixes in Critical → High → Medium → Low order with build verification at each stage prevented regression cascades. The June 14 batch processed ~20 fixes across 4 severity levels.
- - **Codebase scan** — Gave clear direction and a concrete list of tasks before implementation.
- **AGENTS.md progress log** — Maintained context across the session and made it easy to resume work.

### What was challenging

- **Context retention** — Long conversations lost track of earlier decisions; had to re-explain the project structure or restate decisions. This was the direct motivation for creating AGENTS.md (`0dcc8f4 Chores: regenerate AGENTS.md`).
- **Provider swap mid-stream** — Claude usage limits forced a mid-feature switch to Gemini, which produced subtly different code patterns and caused typography inconsistencies that required a dedicated refactor commit.
- **Mobile debugging** — AI couldn't visually inspect layout issues. The gradient text bug on Android Chrome required several rounds of trial-and-error prompts to land on `isolation: isolate` + `translateZ(0)`. The fix spanned 3 commits: `0bddf4e` → `931c782` → `833bc93`.
- **Dependency drift** — AI suggested `next/middleware` (deprecated in Next.js 16), `@tailwindcss/typography` (not installed), and `@vercel/analytics` (only speed-insights exists), all of which had to be cross-checked against `package.json`.

### Changes made during development

- Migrated from a single chat session approach to using opencode with AGENTS.md for persistent context across sessions (after ~40 commits of context-loss churn).
- Added AGENTS.md as a project-level memory document — the AI reads it at session start to avoid re-explaining architecture decisions.
- Shifted from direct Groq SDK calls in route handlers to an adapter pattern after realising a second AI provider would require duplicating logic.
- Switched from a separate user collection to embedding `spotifyUserId` directly on the summary document — one fewer MongoDB collection to manage.
- Removed `next/middleware` in favour of a proxy file (`src/proxy.ts`) after Next.js 16 deprecated the middleware API for this use case.

### What Was Failing

- **Spotify 50-track window** — API only returns the 50 most recently played tracks, often missing sessions from earlier in the day since `after` pagination doesn't support arbitrary time-range filtering reliably.
- **Prioritisation inverted** — Disproportionate effort went into animations before core error handling, input sanitisation, and edge cases were complete.
- **Static auth secret during iteration 1** — The `INTERNAL_API_SECRET` shared between Next.js and Express lacks rotation, expiry, or scoping — every server action uses the same static token.
