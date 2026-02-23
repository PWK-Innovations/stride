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
- **Deploy Workflow Fix:** Moved `.github/workflows/deploy.yml` from `app/.github/` to repo root (GitHub only detects workflows at root). Set `working-directory: app` for all steps.
- **First Deploy:** GitHub Actions deploy to Vercel succeeded. App live at stride-amber.vercel.app.
- **Favicon Fix:** Replaced default Vercel/Next.js favicon (`app/favicon.ico`) with custom olive "S" icon. Next.js App Router serves `app/favicon.ico` over `public/favicon.ico`.
- **PWA Verified:** PWA install working on device, standalone mode confirmed.
- **Phase 3: Core Data Flow (complete).**
- **Profile API:** Created `GET /api/profile` — returns `{ googleConnected: boolean }` for the authenticated user by checking Google tokens in the profiles table.
- **Google Calendar UI:** Added connection status to dashboard (`app/app/page.tsx`). Shows "Connect Google Calendar" button when not connected, green check + "Google Calendar connected" when linked. Removed static Phase 2 placeholder text.
- **OAuth Redirect:** Updated `app/api/auth/google/callback/route.ts` to redirect to `/app` on success instead of returning JSON, completing the OAuth UX loop.
- **Schedule Test Script:** Created `scripts/test-schedule.ts` — CLI test that builds a sample prompt, calls OpenAI scheduling engine, and validates the response structure. Added `npm run test:schedule` to package.json and updated `test:all`.
- **Roadmaps:** Updated Phase 3 roadmap (all tasks checked off), moved plan + roadmap to `ai/roadmaps/complete/`.
- **Timeline Redesign:** Replaced `react-calendar-timeline` + `moment` with a custom vertical day view (pure Tailwind). 80px/hour, time gutter, now indicator (red dot + line updating every minute), olive design system, full dark mode support. Scheduled tasks get solid olive-500 left border; busy calendar windows get dashed olive-400 border with muted bg. Auto-expanding time range (defaults 8AM–6PM).
- **Busy Windows:** Added `title` field to `BusyWindow` interface, mapping Google Calendar `summary` through. Dashboard now captures `busy_windows` from the API response and passes them to `DailyTimeline`.
- **Dependencies:** Removed `react-calendar-timeline` and `moment` (10 packages).
- **Phase 4a: Photo-to-Task.**
- **ExtractedTask Type:** Added `ExtractedTask` interface to `types/database.ts` for photo extraction results.
- **Photo Upload Helper:** Created `lib/supabase/uploadPhoto.ts` — client-side upload to `task-photos/{user_id}/{uuid}.{ext}`, returns public URL.
- **OpenAI Vision Helper:** Created `lib/openai/extractTasksFromPhoto.ts` — sends base64 photo to GPT-4o-mini with structured JSON output, returns `ExtractedTask[]`.
- **Extract Photo API:** Created `POST /api/tasks/extract-photo` — accepts FormData with photo, validates auth/type/size (5 MB limit, JPEG/PNG/WebP/HEIC), converts to base64, calls vision helper.
- **ExtractedTasksReview Component:** Created `components/features/ExtractedTasksReview.tsx` — loading spinner, error state, empty state, editable task rows (title + duration), confirm/cancel buttons.
- **PhotoModal Component:** Created `components/features/PhotoModal.tsx` — Headless UI Dialog for full-size photo viewing with close button.
- **Tasks API Update:** Updated `POST /api/tasks` to accept and store `photo_url` field.
- **Dashboard Update:** Updated `app/app/page.tsx` — "Snap tasks" button with camera icon triggers photo capture, extraction review UI, photo upload on confirm, task thumbnails in list, click thumbnail opens PhotoModal.
- **Next.js Config:** Added Supabase Storage hostname to `images.remotePatterns` for task photo display.