# CLAUDE.md

## Project Context

Stride is an AI-powered daily planner for knowledge workers with unstructured schedules. Users add tasks (text, photos, voice), connect their calendar, and hit "Plan my day" — an agentic AI builds and maintains the schedule throughout the day. Delivered as a Next.js PWA with a standalone desktop widget.

Read `aiDocs/context.md` for full project context, tech stack, and current focus.

## Critical Files to Review

- `aiDocs/context.md` — project knowledge base: overview, tech stack, app structure, current focus
- `aiDocs/prd.md` — requirements source of truth: target users, success metrics, feature priorities
- `aiDocs/mvp.md` — scope anchor: what's in vs. out for the current deliverable
- `aiDocs/architecture.md` — system design decisions: data flows, database schema, AI architecture
- `aiDocs/coding-style.md` — code conventions: TypeScript, Tailwind, naming, formatting
- `aiDocs/changelog.md` — high-level change log: update before every commit

## Behavioral Guidelines

### Before Writing Code
- Read `aiDocs/context.md` and relevant docs before starting any work
- Ask my opinion before starting complex or architectural work
- Confirm the approach if there are multiple valid paths
- Read existing code before modifying — understand what's there first

### Code Style
- Keep solutions simple and focused on requirements
- Don't add features not in the PRD — this is MVP only
- Follow existing patterns in the codebase
- Change code as if it was always this way (no compatibility layers)
- Don't over-engineer — we can add complexity later. Additional features go in future roadmaps
- Use TypeScript strict mode with proper types — no `any`, use `unknown` or explicit types
- Follow `aiDocs/coding-style.md` for naming, formatting, Tailwind, and component patterns
- Use the olive design system from `ai/guides/reference/oatmeal-olive-instrument/`
- Keep functions small and focused
- Structured logging via `lib/logger.ts` — no raw `console.*` calls

### When Uncertain
- Flag uncertainty instead of guessing — say "I'm not sure about X"
- Check reference docs in `ai/guides/` before guessing API usage
- When in doubt about scope, check `aiDocs/mvp.md` for what's in vs. out

### Code Quality
- Meaningful variable and function names
- No unnecessary comments — code should be self-documenting
- Keep commits incremental and meaningful
- Never commit API keys or secrets — use env vars (see `.env.example`)

## Plans & Roadmaps

- Save plan/roadmap docs in `ai/roadmaps/`, prefixed with date
- Plans: no checkboxes (implementation details). Roadmaps: use checkboxes (task tracking)
- When a phase is done: check off roadmap tasks, move docs to `ai/roadmaps/complete/`, update `aiDocs/changelog.md`

## Commands

All commands run from `app/` directory:
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config, ESLint 9)
- `npm run test:all` — Run all CLI integration tests
