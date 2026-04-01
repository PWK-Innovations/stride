# CLAUDE.md

## Project Context
Read `aiDocs/context.md` for full project context, tech stack, and current focus.

## Behavioral Guidelines

### Before Writing Code
- Read `aiDocs/context.md` and relevant docs before starting any work
- Ask my opinion before starting complex or architectural work
- Confirm the approach if there are multiple valid paths
- Read existing code before modifying — understand what's there first

### While Writing Code
- Don't overengineer — keep it simple, solve the current problem
- Follow existing patterns in the codebase
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

### Plans & Roadmaps
- Save plan/roadmap docs in `ai/roadmaps/`, prefixed with date
- Plans: no checkboxes. Roadmaps: use checkboxes for tracking
- When a phase is done: check off roadmap tasks, move docs to `ai/roadmaps/complete/`, update `aiDocs/changelog.md`

## Commands

All commands run from `app/` directory:
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config, ESLint 9)
- `npm run test:all` — Run all CLI integration tests
