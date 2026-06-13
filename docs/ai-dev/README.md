## AI Tools

### Iteration 1 — Initial Build

| Tool            | Role                                                    |
| --------------- | ------------------------------------------------------- |
| Claude          | *(to be filled)*                                        |
| Gemini          | *(to be filled)*                                        |

### Iteration 2 — Refactor & Polish

| Tool                    | Role                                                      |
| ----------------------- | --------------------------------------------------------- |
| opencode (big pickle)   | Refactoring, bug fixes, testing infra, code review        |
| Claude                  | Architecture guidance, code generation, debugging         |

---

## Development Approach with AI

### Workflow

Iteration 2 used opencode's **Plan mode** and **Build mode**:

1. **Plan mode** — Ask opencode to explore the codebase, understand current state, and summarise progress before making changes. Example: "What did we do so far?" triggered a full scan of the codebase and AGENTS.md, returning a structured progress summary with todos.
2. **Build mode** — Give opencode concrete implementation tasks. It reads relevant files, proposes edits, and runs verification (build, lint, tests) automatically.
3. **Review & iterate** — Review the output, request corrections or refinements, then run a final build check.

### Key Prompts Used (Iteration 2)

- *Plan* — "What did we do so far?" (opencode scanned codebase + AGENTS.md and returned a structured progress summary with todos)
- *Build* — "Fix all the LOW issues from the code review." (batched ~20 fixes: inline confirm/cancel, stable keys, removed orphaned configs, extracted constants, added health endpoint, 404 handler, graceful shutdown, etc.)
- *Build* — "The background image is too large, convert it to WebP." (compressed `bg.png` 307KB → `bg.webp` 165KB, updated reference in `Landing.tsx`)
- *Build* — "selectTopTracks keeps picking songs from the same artist, make it prefer diversity within reason." (changed exact equality to 90% threshold so within-10% tracks from new artists beat same-artist tracks)
- *Build* — "Fix the security issues — spotifyUserId shouldn't come from Props, the share page cache should be no-store, validate avatarUrl is HTTPS." (moved `spotifyUserId` to session, `force-cache` → `no-store`, added `.startsWith("https://")` to schema)
- *Build* — "The gradient text on Infinite Layers doesn't work on Android Chrome — it doesn't render the gradient and wraps mid-word on mobile." (added GPU compositing layer on parent, removed `inline-block` from letter spans for natural word breaks, replaced `\u00A0` with regular space, added `max-md:text-coral max-md:bg-none` mobile fallback)

---

## Reflection

### What worked well

- **Speed of iteration** — AI could generate complete components (NeonLoading, RevealText, StatCard) in seconds, letting focus shift to polish and integration.
- **Architecture guidance** — Claude helped design the provider-agnostic AI adapter pattern early on, which avoided a rewrite when adding the second iteration.
- **Testing setup** — opencode wrote the full backend test suite (vitest + mongodb-memory-server) and Cypress E2E tests in a single session, including mocking strategies for rate limiters and the AI adapter.

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
- **No test strategy from the start** — Tests were only added in the second iteration. Writing them retroactively took longer than it would have if planned earlier.
