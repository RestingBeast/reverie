## AI Tools

### Iteration 1 — Initial Build

| Tool   | Role             |
| ------ | ---------------- |
| Claude | _(to be filled)_ |
| Gemini | _(to be filled)_ |

### Iteration 2 — Refactor & Polish

| Tool                  | Role                                               |
| --------------------- | -------------------------------------------------- |
| opencode (big pickle) | Refactoring, bug fixes, code review |
| Claude                | Architecture guidance, code generation, debugging  |

---

## Development Approach with AI

### Workflow

Iteration 2 used opencode's **Plan mode** and **Build mode**:

1. **Plan mode** — Ask opencode to explore the codebase, understand current state, and summarise progress before making changes. Example: "What did we do so far?" triggered a full scan of the codebase and AGENTS.md, returning a structured progress summary with todos.
2. **Build mode** — Give opencode concrete implementation tasks. It reads relevant files, proposes edits, and runs verification (build, lint) automatically.
3. **Review & iterate** — Review the output, request corrections or refinements, then run a final build check.

### Key Decisions

| Review Point                                          | Decision Made                                                                          |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------- |
| selectTopTracks picks too many songs from one artist  | 90% play-count threshold — within-10% tracks from a new artist beat same-artist tracks |
| TOP_ARTISTS_COUNT mismatches TOP_TRACKS_COUNT         | Changed from 3 to 4 so each top track's artist is represented                          |
| Gradient text broken on Android Chrome mobile         | GPU compositing layer (`isolation: isolate` + `translateZ(0)`) + solid coral fallback  |
| Text wraps mid-word on mobile                         | Removed `inline-block` from letter spans so browsers break at word boundaries          |
| spotifyUserId sent from client in Props               | Moved to server session — extracted from JWT `sub` on the server side                  |
| Share page used `force-cache`                         | Changed to `no-store` to always fetch fresh data                                       |
| avatarUrl not validated on backend                    | Added `.startsWith("https://")` Zod check to reject non-HTTPS URLs                    |
| Background PNG too large (307KB)                      | Converted to WebP (165KB), updated reference in `Landing.tsx`                          |

### Key Prompts Used (Iteration 2)

- _Plan_ — "What did we do so far?" (opencode scanned codebase + AGENTS.md and returned a structured progress summary with todos)
- _Build_ — "Fix all the LOW issues from the code review." (batched ~20 fixes: inline confirm/cancel, stable keys, removed orphaned configs, extracted constants, added health endpoint, 404 handler, graceful shutdown, etc.)
- _Build_ — "The background image is too large, convert it to WebP." (compressed `bg.png` 307KB → `bg.webp` 165KB, updated reference in `Landing.tsx`)
- _Build_ — "selectTopTracks keeps picking songs from the same artist, make it prefer diversity within reason." (changed exact equality to 90% threshold so within-10% tracks from new artists beat same-artist tracks)
- _Build_ — "Fix the security issues — spotifyUserId shouldn't come from Props, the share page cache should be no-store, validate avatarUrl is HTTPS." (moved `spotifyUserId` to session, `force-cache` → `no-store`, added `.startsWith("https://")` to schema)
- _Build_ — "The gradient text on Infinite Layers doesn't work on Android Chrome — it doesn't render the gradient and wraps mid-word on mobile." (added GPU compositing layer on parent, removed `inline-block` from letter spans for natural word breaks, replaced `\u00A0` with regular space, added `max-md:text-coral max-md:bg-none` mobile fallback)

## Reflection

### What worked well

- **Speed of iteration** — AI could generate complete components (NeonLoading, RevealText, StatCard) in seconds, letting focus shift to polish and integration.
- **Architecture guidance** — Claude helped design the provider-agnostic AI adapter pattern early on, which avoided a rewrite when adding the second iteration.

### What was challenging

- **Context retention** — Long conversations lost track of earlier decisions; had to re-explain the project structure or restate decisions.
- **Mobile debugging** — AI couldn't visually inspect layout issues. The gradient text bug on Android Chrome required several rounds of trial-and-error prompts to land on `isolation: isolate` + `translateZ(0)`.
- **Dependency drift** — AI occasionally suggested libraries or APIs that didn't exist in the project's dependency tree (e.g., suggesting `next/middleware` after it was deprecated).

### Changes made during development

- Migrated from a single chat session approach to using opencode with AGENTS.md for persistent context across sessions.
- Added AGENTS.md as a project-level memory document — the AI reads it at session start to avoid re-explaining architecture decisions.
- Shifted from direct Groq SDK calls in route handlers to an adapter pattern after realising a second AI provider would require duplicating logic.

### What was failing

- **Over-reliance on AI** — Early iteration spent too much time polishing animations via AI prompts when core functionality (error handling, sanitisation) was incomplete.
- **Security gaps** — AI didn't flag JSON injection or prompt injection risks on the backend; these had to be identified and fixed later.
