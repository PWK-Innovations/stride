# Changelog

High-level changes; add a line or two here when you commit and push.

---

## 2026-02-09

- Added aiDocs: coding-style.md, changelog.md.
- Updated context.md to reference coding style and changelog in Critical Files to Review.
- **Architecture:** Standardized on Supabase for auth, database (PostgreSQL), and storage (task photos). Updated architecture.md, context.md, mvp.md, and prd.md.
- **AI:** Added OpenAI API for schedule construction; documented in architecture.md, context.md, mvp.md, prd.md. Google Calendar attached per user (tokens in Supabase).
- **Context:** Rewrote context.md for accuracy (MVP description, tech stack, secrets). Removed outdated 7-week scope reference.
- **Roadmaps:** Deleted outdated ai/roadmaps files (2026-02-09-ai-daily-planner-roadmap.md and -concise.md).
- **Template:** Added reference/oatmeal-olive-instrument/ as template style; updated context.md and coding-style.md to reference it.
- **PRD:** Added competitive landscape (Motion, Reclaim.ai, Akiflow) and differentiators; added pricing/GTM section ($12-15/mo, student discount, Product Hunt launch); clarified P1 calendar integration (Google for MVP, Outlook/Apple later); added Jira/Linear/GitHub integration for engineers.
- **API Guides:** Added `ai/guides/openai-api-reference.md` and `ai/guides/google-calendar-api-reference.md` with practical examples for Stride's scheduling engine, photo-to-task, and calendar integration.
- **Cursor Rules:** Created `.cursorrules` file that references context.md and key documentation for AI-assisted development.
- **Implementation Plan:** Created `ai/roadmaps/2026-02-09-stride-implementation-plan.md` with 7 phases from foundation to scale; emphasizes clean code, MVP-first approach, and avoiding over-engineering.
- **Phase Plans & Roadmaps:** Created detailed plan and roadmap docs for Phases 0-5 in `ai/roadmaps/`:
  - Phase 0: Foundation (project setup, database, integration tests)
  - Phase 1: Core Data Flow (task CRUD, calendar, AI scheduling, "Build my day")
  - Phase 2: UI & PWA (timeline view, responsive design, PWA setup, notifications)
  - Phase 3: Photo-to-Task (photo upload, OpenAI OCR, task extraction)
  - Phase 4: Polish & Validation (error handling, UX improvements, internal dogfooding)
  - Phase 5: Beta Launch (analytics, beta users, rapid iteration)
  - Each phase has a plan doc (implementation details) and roadmap doc (task checklist) that reference each other.
- **Alignment review:** Fixed context.md (##Behavior → ## Behavior; removed stray `|`; ai/changelog.md → aiDocs/changelog.md). Added "Guides & Roadmaps" section in context.md pointing to ai/guides and ai/roadmaps. Created Phase 6 (Secondary Features) and Phase 7 (Scale & Monetization) plan and roadmap docs so all phases have sub-plans. Updated main implementation plan Next Steps to reference phase docs.
- **Phase 0-2 Complete:** Implemented full MVP through Phase 2. Next.js app running at localhost:3001 with home, pricing, about, and app pages. All components from oatmeal-olive-instrument template copied and adapted. Task CRUD, AI scheduling, timeline view, PWA, and notifications all implemented. Roadmaps updated with checkboxes.

## 2026-02-22

- **Auth Infrastructure (Phase 0.4):** Rewrote `lib/supabase/client.ts` to use `createBrowserClient` from `@supabase/ssr` (replaced singleton). Rewrote `lib/supabase/server.ts` to use `createServerClient` with `next/headers` cookie handling; kept `supabaseAdmin` export. Created `lib/supabase/auth.ts` with signUp, signIn, signOut, getSession, onAuthStateChange helpers.
- **Middleware:** Created `middleware.ts` to protect `/app/*` routes (redirects to `/login`), and redirect `/login` & `/signup` to `/app` if already logged in.
- **API Route Updates:** Updated all 5 API routes (`tasks`, `tasks/[id]`, `schedule/build`, `auth/google/callback`, `test/supabase`) to use per-request `createClient()` from server.ts instead of singleton. Fixed `params` type in `tasks/[id]` to `Promise` for Next.js 16.
- **Login Page:** Created `app/login/page.tsx` — olive-themed sign-in form with email/password, "Remember me" checkbox, "Forgot password?" link, "Or continue with Google" button, error messages, link to signup.
- **Signup Page:** Created `app/signup/page.tsx` — olive-themed sign-up form with email/password/confirm, "Or continue with Google" button, validation, link to login.
- **Dashboard Layout:** Created `app/app/layout.tsx` (server component reading session) and `components/features/DashboardShell.tsx` — sidebar layout adapted from Tailwind reference with olive-900 sidebar, mobile slide-out drawer (HeadlessUI), desktop fixed sidebar, profile dropdown with sign out. Updated `app/app/page.tsx` to remove redundant wrapper/header.
- **Database:** Created all tables (profiles, tasks, scheduled_blocks) with RLS policies and indexes via Supabase MCP. Created profile auto-creation trigger (`handle_new_user`). Fixed `update_updated_at_column` function search path per security advisor.
- **Dependencies:** Installed `@supabase/ssr`, `@headlessui/react`, `@heroicons/react`.
- **Supabase MCP:** Configured Supabase MCP server for direct database access from Claude Code.
- **Roadmaps:** Moved Phase 0 and Phase 1 roadmaps to `ai/roadmaps/complete/`.

## 2026-02-23

- **Phase 2: PWA & Hosting (code complete).**
- **Structured Logger:** Created `lib/logger.ts` — `createLogger(context)` factory with info/warn/error levels. JSON output in production, readable format in dev. Integrated into schedule build route, Google refresh/calendar, OpenAI engine, and notifications.
- **PWA Icons:** Generated olive-themed "S" lettermark icons (192px, 512px, 180px for iOS, 32px favicon). Removed placeholder `.txt` files.
- **iOS PWA Fix:** Added 180x180 `apple-touch-icon` for proper iOS home screen display.
- **themeColor Fix:** Moved `themeColor` from deprecated `metadata` export to `viewport` export per Next.js 16 API.
- **CLI Test Scripts:** Created `scripts/test-supabase.ts`, `test-openai.ts`, `test-google.ts`. Added `npm run test:supabase`, `test:openai`, `test:google`, `test:all` scripts. Dev dependencies: `tsx`, `dotenv`.
- **GitHub Actions Deploy:** Created `.github/workflows/deploy.yml` — triggers on push to main, builds and deploys to Vercel via CLI. Requires repo secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- **Build Fixes:** Fixed pre-existing TypeScript errors: `FeaturesThreeColumn` children→features prop in about page, `DailyTimeline` Moment→number type for timeline bounds.
- **Dependencies:** Installed `@headlessui/react`, `@heroicons/react`, `@supabase/ssr` (missing from node_modules). Added `sharp`, `tsx`, `dotenv` as dev dependencies.
- **Roadmaps:** Updated Phase 2 roadmap (tasks checked off) and moved plan + roadmap to `ai/roadmaps/complete/`.