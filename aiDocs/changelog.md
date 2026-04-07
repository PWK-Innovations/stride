# Changelog

High-level changes; add a line or two here when you commit and push.

---

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
- **Phase 4b: Audio-to-Task.**
- **Whisper Transcription:** Created `lib/openai/transcribeAudio.ts` — sends audio File to OpenAI Whisper API (`whisper-1`), returns transcription text.
- **Text Extraction:** Created `lib/openai/extractTasksFromText.ts` — sends transcription text to GPT-4o-mini with structured JSON output, same schema as photo extraction.
- **Audio Recorder Hook:** Created `lib/audio/useAudioRecorder.ts` — React hook wrapping MediaRecorder API. Prefers `audio/webm;codecs=opus`, falls back to `audio/mp4` (Safari). Returns `isRecording`, `duration`, `audioBlob`, `audioUrl`, `error`, `start`, `stop`, `reset`. Handles mic permission denied.
- **Extract Audio API:** Created `POST /api/tasks/extract-audio` — accepts FormData with audio file, validates type (WebM/MP4/MP3/WAV/OGG/M4A with codec suffix support) and size (25 MB), transcribes via Whisper, extracts tasks, returns `{ tasks, transcription }`.
- **ExtractedTasksReview Update:** Added optional `loadingMessage` and `emptyMessage` props for audio-specific messaging, backward-compatible defaults.
- **Dashboard Update:** Added "Voice tasks" button with live recording indicator, audio file upload, audio preview bar with playback/extract/discard controls, collapsible transcription display. Shared extraction flow with photo via `extractionSource` state.
- **Roadmaps:** Updated Phase 4 roadmap (all tasks checked off), moved plan + roadmap to `ai/roadmaps/complete/`. Phase 4 complete.
- **Phase 5: Polish & Validation (code polish).**
- **Friendly Errors:** Created `lib/errors/friendlyMessage.ts` — maps error messages and HTTP status codes to user-friendly strings (rate limit, timeout, OpenAI, Google Calendar, generic). Applied to all 5 API routes (`schedule/build`, `tasks`, `tasks/[id]`, `extract-photo`, `extract-audio`). Fixed `error: any` → `error: unknown` in 3 routes.
- **Loading & Empty States:** Added `loadingTasks` spinner during initial task fetch, "No schedule yet" empty state when tasks exist but no schedule, inline error banner replacing `alert()` for schedule errors.
- **Confirm Dialog:** Created `components/features/ConfirmDialog.tsx` — reusable HeadlessUI Dialog for destructive actions. Wired to delete task with `deletingTaskId` state.
- **Keyboard Shortcuts:** Created `lib/hooks/useKeyboardShortcuts.ts` — registers global keydown listener, handles meta+key combos, skips when in inputs (except Escape). Wired: Cmd+N → focus title, Cmd+B → build schedule, Escape → close modals/extraction/confirm.
- **Performance:** Parallelized tasks + calendar events fetch with `Promise.all` in schedule/build route. Added `loading="lazy"` to task photo thumbnails.
- **Type Safety:** Replaced `block: any` with `block: ScheduledBlock` in notification scheduling code.
- **Phase 5b: Smarter Scheduling & Persistence.**
- **AI Prompt Fix:** Fixed working hours format (24h `17` → `5:00 PM` instead of broken `17:00 PM`). Added time hint instruction (respect "at 1 pm", "morning", "after lunch" in task notes). Added hard working hours enforcement ("NEVER schedule before/after"). Added 10-minute break enforcement between tasks. Added timezone support (browser IANA timezone passed through). Changed example timestamps from UTC `Z` suffix to local format.
- **Retry Context:** Added `previousSchedule` param to `buildSchedulePrompt` — when retrying, includes the previous schedule as context with instructions to generate a meaningfully different arrangement.
- **Temperature:** Lowered OpenAI temperature from `0.7` to `0.3` for more consistent scheduling.
- **Schedule Persistence:** Created `GET /api/schedule` — fetches today's `scheduled_blocks` for authenticated user. Dashboard now loads schedule on mount alongside tasks and Google status, restoring timeline on reload.
- **Try Again Button:** Added "Try again" button next to schedule heading. Passes `retry: true` to build API, which loads existing schedule as context for AI to produce a different arrangement. Refresh icon, disabled while building.
- **Drag to Reschedule:** Added pointer-based drag-to-reschedule on `DailyTimeline` scheduled blocks. Blocks show grab cursor, scale + shadow while dragging, ghost outline at original position, live time preview snapped to 5-minute increments. Created `PATCH /api/schedule/:id` endpoint to persist moved block times. Optimistic local state update with rollback on failure.
- **Build Route Update:** `POST /api/schedule/build` now accepts `timezone` and `retry` from request body. On retry, loads existing blocks as context for the AI.
- **Scheduling Spread Rule:** Added Rule 5 ("SPREAD TASKS OUT") to AI scheduling prompt — instructs GPT-4o-mini to distribute tasks across the full working window instead of clustering them in the morning. Renumbered subsequent rules.
- **Remove Debug Override:** Removed hardcoded 8 AM `currentTime` override from dashboard; scheduler now uses real browser time as the effective start.
- **Phase 6.1: CLI Testing Infrastructure.**
- **Shell Scripts:** Created 5 standard shell scripts in `app/scripts/` (`build.sh`, `run.sh`, `test.sh`, `lint.sh`, `dev.sh`) — all with `set -e`, `--help` flag, JSON stdout, stderr diagnostics, standard exit codes.
- **Auth Helper:** Created `scripts/auth-helper.sh` — signs up/signs in a test user via Supabase REST API, constructs `@supabase/ssr`-compatible session cookie, saves to `scripts/.test-cookies` for curl-based testing.
- **Explore Phase:** 3 parallel agents curled the running dev server testing public endpoints, task CRUD, and schedule/profile routes. Discovered 3 bugs: malformed JSON body → 500 (should be 400), delete nonexistent UUID → 200 (should be 404), delete invalid UUID → 500 leaking raw Postgres error.
- **Integration Tests:** Created `scripts/test-integration.sh` — 18 automated tests covering smoke tests, auth guards, profile, task CRUD (create/validate/list/delete/verify), and schedule endpoints. Outputs structured JSON results. All 18 pass.
- **Gitignore:** Added `scripts/.test-cookies` to `.gitignore`.
- **Phase 6.2: Structured Logging.**
- **Logger Enhancement:** Added `debug` level and `LOG_LEVEL` / `NEXT_PUBLIC_LOG_LEVEL` env var support to `lib/logger.ts`. Log level hierarchy: debug < info < warn < error. Default: `debug` in dev, `info` in production.
- **Console Cleanup:** Replaced all 9 `console.error` calls in `app/app/page.tsx` and 1 `console.log` in `lib/notifications/scheduleNotifications.ts` with structured logger. Zero `console.*` calls remain outside `logger.ts`.
- **Logging Docs:** Created `ai/guides/testing.md` documenting log locations, levels, tailing, and usage patterns.
- **Test Env:** Added `LOG_LEVEL=debug` and `NEXT_PUBLIC_LOG_LEVEL=debug` to `.testEnvVars`.
- **Lint Fixes:** Fixed all 11 ESLint errors: unescaped entities in about page, `any` → `unknown` in 4 files, `let` → `const` in 3 files. 0 errors remain (32 pre-existing warnings only).
- **Phase 6.3: Security Hardening.**
- **Credentials Scan:** Scanned codebase for hardcoded secrets — clean. Moved auth-helper hardcoded project ref/email/password to env vars.
- **Input Sanitization:** Created `lib/openai/sanitizeInput.ts` — truncates and strips control characters from user input before OpenAI prompts. Wired into `buildSchedulePrompt` (task titles/notes) and `extractTasksFromText` (transcription).
- **npm audit:** Fixed `ajv` moderate vulnerability. Remaining 8 highs are `minimatch` in eslint-config-next devDeps (not shipped to production, blocked on upstream Next.js update).
- **`.env.example`:** Created with placeholder values, added `!.env.example` exception to `.gitignore`.
- **Security Docs:** Added security practices section to `ai/guides/testing.md` covering secrets management, API key rotation schedule, input sanitization model, dependency auditing, and what not to commit.
- **Build Script Fix:** Fixed `build.sh` millisecond timing on macOS (replaced GNU `date +%s%3N` with portable `python3` fallback).
- **Phase 6 complete.** All 6.1/6.2/6.3 tasks checked off, roadmap updated.
- **Roadmaps:** Moved Phase 5 and Phase 6 plan + roadmap docs to `ai/roadmaps/complete/`.

## 2026-04-01

- **Product Direction Pivot:** Broadened target users to knowledge workers (freelancers, devs, remote professionals, ADHD, students). Added agentic AI (LangChain), Outlook Calendar, stability-first rescheduling, hybrid architecture. Cofounder discussion in `ai/notes/feedback-discussion.md`.
- **PRD Updates:** Added pivot journey narrative (Section 1). Quantified success metrics with hard numbers — 15-30 min/day saved, <40% manual edits, 2/3 report realistic schedule, 50%+ engage 3x/week, 95%+ calendar sync reliability (Section 3). Moved desktop widget and chat modal to P1, goals and personalization to P2. Added widget user stories. Added desktop widget as differentiator vs. browser-based tools.
- **MVP Updates:** Added desktop widget as MVP-critical scope (Electron/Tauri wrapper, system tray, current task display, quick-actions, agent text input). Added evolution narrative explaining pivot from single-shot to agentic AI + widget. Expanded agent interaction section to cover both web chat modal and widget. Added validation point 7 (widget differentiates from browser-based tools). Added widget checklist items.
- **Other Docs Updated:** Architecture (`calendar_tokens` table, `agent_conversations`, SSE streaming, constraint solver, env vars), Context.md (simplified), CLAUDE.md (simplified to behavioral guidelines).

## 2026-04-03

- **Phase Restructure:** Added Phase 7 (Final Project Setup) and shifted all phases down. New structure: Phase 7 (Final Project Setup) → Phase 8 (Desktop Widget) → Phase 9 (Agentic AI) → Phase 10 (Integrations & Web Chatbot) → Phase 11 (Beta Launch) → Phase 12 (Secondary Features). Created 12 new plan + roadmap docs for phases 7-12. Deleted old phase files from previous structure.
- **High-Level Plan:** Rewrote `ai/roadmaps/2026-04-01-high-level-plan-final-stride.md` with comprehensive final to-do checklist (cross-referenced against rubric + midterm feedback), updated phase descriptions, dependencies, and success criteria. Moved old high-level plan (`2026-02-08-stride-high-level-plan.md`) to `ai/roadmaps/complete/`.
- **Final To-Do Checklist:** Created `ai/notes/final-to-do-checklist.md` — comprehensive submission checklist covering product design, technical, final checks, and artifacts, cross-referenced against `ai/guides/final-rubric.md` and `ai/notes/midterm-feedback.md`.
- **MVP Update:** Removed Task Backlog from secondary features (not in PRD, out of scope).
- **Guides Reorganization:** Moved API reference guides from `ai/guides/` to `ai/guides/external/` (google-calendar, openai, supabase). Renamed `testing.md` to `logging-testing.md`. Added new guides: `final-rubric.md`, `midterm-rubric.md`, `presentation.md`.
- **Reference Materials:** Added `ai/guides/reference/class/` (agentic-development + business-development lecture notes), `ai/guides/reference/stride-agent/` (standalone LangChain agent reference implementation), `ai/guides/reference/tailwind-components/` (sideBarLayout, signIn templates). Added `aiDocs/stride-agent/` as agent reference implementation.
- **Notes:** Created `ai/notes/midterm-feedback.md` (midterm scores: Casey 100, Jason 92, Presentation 70 with detailed feedback).
- **Context.md Update:** Added references for all new guide files, reference directories, and notes. Updated Current Focus to reflect new phase structure (Phase 7-12).
- **Alignment Verification:** Cross-checked high-level plan, phase plan/roadmap files, context.md, mvp.md, and prd.md for consistency. Fixed stale "Next Phase" references in Phase 7 files and outdated phase names in context.md.
- **Phase 7 Complete: Final Project Setup.**
- **CLAUDE.md Alignment:** Rewrote `stride/CLAUDE.md` with Critical Files to Review (bookshelf pattern), enhanced behavioral guidelines (from Casey's slides: "Don't add features not in the PRD", "Change code as if it was always this way", "This is MVP only"). Updated root `CLAUDE.md` to match — fixed incorrect claim that `ai/` was gitignored.
- **Structured Logging:** Added `createLogger` to all 9 API routes missing it (`auth/google`, `auth/google/callback`, `profile`, `schedule`, `schedule/[id]`, `tasks`, `tasks/[id]`, `test/openai`, `test/supabase`) and `middleware.ts`. Every catch block now logs with structured context (userId, error). Zero raw `console.*` calls in app code.
- **Test Scripts:** Fixed exit codes from 1→2 for missing env vars across all 4 TypeScript test scripts and 2 shell scripts (rubric requirement). Added `.catch()` handlers to all TypeScript `main()` calls for clean error output on unexpected failures.
- **Gitignore:** Added `.testEnvVars` to root `.gitignore` (rubric requirement). Verified no secrets in git history.
- **Build Fix:** Excluded `scripts/` from `tsconfig.json` to fix build failure caused by `dotenv` types in test scripts.
- **Skills:** Created 3 Claude Code skills in `.claude/skills/`: `/update-changelog`, `/check-roadmap`, `/refresh-context`. Each has YAML frontmatter + markdown instructions per Unit 5 pattern.
- **Phase 7 roadmap:** All tasks checked off. Status set to Complete.

## 2026-04-03 (cont.)

- **Phase 8.1-8.3 Complete: Desktop Widget (Electron).**
- **Widget Shell (8.1):** Scaffolded `widget/` directory with Electron. Main process (`src/main.ts`) creates 350x500 frameless window, system tray icon with show/hide + always-on-top + launch-on-login toggles, positioned bottom-right. Preload bridge (`src/preload.ts`) exposes `strideApi` via `contextBridge` with full CRUD for tasks/schedule. API client (`src/api.ts`) connects to Stride backend with Bearer auth. Secure token storage via `electron-store`. Structured logging throughout — no raw `console.*`.
- **Widget UI (8.2):** Vanilla TypeScript renderer with current task countdown, next-up preview, quick-action buttons (Done, Skip, Running Late), text input for adding tasks, compact schedule overview. Olive design system: dark mode (`#1a1a1a`), olive accents, Inter font. Loading states, success/error feedback animations. Bundled via esbuild.
- **Sync (8.3):** `SyncManager` class polls tasks + schedule every 15s. Observer pattern for UI updates. Offline detection with "reconnecting" indicator. System notifications via Electron `Notification` API (IPC bridge) + web `Notification` API with scheduled timeouts for upcoming tasks. Sync status footer (green/red dot + last synced time).
- **Phase 8.4: Widget Modes (Compressed + Full).** Added `WidgetMode` type (`compressed` | `full`) with IPC channels (`set-widget-mode`, `get-widget-mode`, `mode-changed`). Compressed mode: 220x48px rounded rectangle (12px radius). Full mode: 380x620px (12px radius). Window position + mode persistence via electron-store. Tray menu radio items for mode switching. `strideWidget` bridge in preload. Built compressed view component (task title, countdown, expand button), full mode header (Stride branding, compress/close, drag region), task bar (compact current task strip). Both modes fully draggable.
- **Phase 8.5: Chat UI (Gemini-style).** Built chatbot interface in full mode: chat message list with user (olive, right-aligned) and assistant (dark card, left-aligned) bubbles, typing indicator (animated dots), fade-in animations, auto-scroll. Suggestion chips ("What's next?", "Add a task", "How's my day?", "What can you do?") shown in empty state. Rounded chat input with send button. `ChatController` class with client-side command parsing: "add [task]" creates via API, "what's next"/"schedule" queries schedule, "help" returns capabilities, fallback for unrecognized input. `strideChat` preload bridge stubbed for Phase 9 agent integration. Created Gemini popup design reference guide (`ai/guides/external/gemini-popup-reference.md`).
- **Phase 8.6: Auth Fix.** Root cause: backend used cookie-based Supabase auth, widget sends HTTP with no cookies. Created `app/lib/supabase/api-auth.ts` — shared `getAuthenticatedUser(request)` utility that checks `Authorization: Bearer <token>` first, falls back to cookie auth. Updated all 4 API routes (`tasks`, `tasks/[id]`, `schedule`, `schedule/[id]`). Widget API client now returns clear 401 error messages.
- **Phase 8.7: Widget Login & Session Management.** Built login screen in widget (email/password form, dark theme). Created `widget/src/auth.ts` — authenticates directly with Supabase REST API (`/auth/v1/token`) using public anon key. Stores access + refresh tokens in electron-store. Renderer shows login screen when no session; transitions to widget on success. Added `login()`, `logout()`, `refreshSession()` to preload bridge. Updated `index.html` CSP to allow Supabase domain.
- **Color & Shape Refinements:** Updated widget accent colors from yellow-olive (`#808000`) to muted sage green (`#6B7355`) matching the website's oklch olive palette. Changed compressed mode from pill (35px radius) to rounded rectangle (12px radius, 48px height).
- **Roadmaps:** Updated Phase 8 plan and roadmap with 8.4-8.7 sections. Updated high-level plan with expanded Phase 8 scope. Phase 8 status: In progress (implementation complete, testing remaining).
- **Phase 9 Part 1: Agentic AI, Solver, Widget Distribution, Chatbot Wiring.**
- **9.0 Widget Distribution:** Configured `electron-builder` for macOS DMG (`npm run dist`). Added widget download section to homepage (between Stats and Testimonial) with "Download for macOS" CTA. Added dismissible download banner to dashboard with `localStorage` persistence. Created widget preview SVG placeholder. Added `NEXT_PUBLIC_WIDGET_DOWNLOAD_URL` env var.
- **9.1 LangChain Agent Infrastructure:** Installed LangChain dependencies (`langchain`, `@langchain/openai`, `@langchain/core`, `@langchain/langgraph`, `zod`). Created `lib/agent/` with ReAct agent factory (`createReactAgent`, gpt-4o-mini, temperature 0). Built 5 scheduling tools (factory pattern with per-request auth): `getTaskList`, `getCalendarEvents`, `createScheduledBlocks`, `checkForConflicts`, `updateTask`. System prompt with scheduling rules. Conversation memory with Supabase persistence (`agent_conversations` table). Max iteration guardrail (`recursionLimit: 10`).
- **9.2 Hybrid Scheduling Architecture:** Built deterministic constraint solver (`lib/agent/solver.ts`) — greedy first-fit placement into free slots, respects working hours (9-6) and break buffers (10 min). Solver utilities for working-hours bounds, busy-window merging, free-slot computation. Stability-first rescheduler (`lib/agent/reschedule.ts`) — anchors completed/in-progress tasks, caps movable tasks per reschedule (default 5).
- **9.3 Agent-Powered Build My Day:** Created SSE streaming endpoint at `/api/agent/chat` (POST, Bearer + cookie auth). Streams `text`, `tool`, `done`, `error` events via `agent.streamEvents()`. Wired `createScheduledBlocks` tool to use the deterministic solver (replaces OpenAI single-shot). Existing `schedule/build` endpoint preserved as fallback.
- **9.4 Widget Chatbot Wiring:** Replaced `strideChat.sendMessage()` stub with IPC invoke to main process. Main process makes POST to agent SSE endpoint, parses stream, forwards chunks to renderer via IPC (`chat-stream-chunk`, `chat-stream-done`, `chat-stream-error`). `ChatController` becomes thin wrapper — agent primary path, local command parsing as offline fallback. Added streaming UI with typing cursor and incremental text rendering.
- **Doc Updates:** Updated Phase 9 plan (added 9.0, updated 9.4 to target widget chatbot). Updated Phase 9 roadmap (added 9.0 checklist, updated 9.4 checklist). Updated Phase 10 plan/roadmap (10.2 clarifies reuse of Phase 9 agent). Updated high-level plan (added 9.0, Phases 0-8 complete, Phase 9 next).

## 2026-04-04

- **Phase 9 Complete: Agentic AI.**
- **Chat & Natural Language:** `agent_conversations` table for per-user-per-day persistence. `createTask` tool with preferred time support. Natural language commands: add tasks, mark done, move to specific times, reschedule. "Move task" workflow avoids duplicate creation.
- **Preferred Time Scheduling:** Solver supports `preferredStartTime` — tries preferred slot, falls back to first-fit. Dynamic system prompt with today's date and timezone for correct ISO generation.
- **Agent Progress UI:** Web app streams agent steps (thinking → tool calls → result). Widget streams via `chat-stream-tool` IPC with spinner labels. Fallback to single-shot scheduling on agent failure.
- **Widget Polish:** Quick action buttons (Done, Skip, Need more time) wired into active task bar. Calendar events shown as active task. Fixed poll flash-reloading — only task bar updates, chat preserved. Fixed 51 TypeScript errors with renderer type declarations.
- **Timezone & API Fixes:** Tool responses use `formatTimeInZone` (fixes UTC-as-local display). Profile endpoint `.maybeSingle()` fix. `DELETE /api/schedule/:id` endpoint. Done action cleans up scheduled blocks. Working hours extended to 8 AM–10 PM.
- **Testing:** 23 solver/reschedule unit tests, 6 agent chat integration tests. `npm run test:all` passes.
- **Distribution:** DMG uploaded to GitHub Releases (`v0.1.0-widget`). Widget preview mockup updated.
- **Phase 10.2: Web Chatbot.** Built `ChatPanel` component — floating card on desktop (rounded, offset from edges), full-screen overlay on mobile. SSE streaming with tool status indicators, suggestion chips, Enter-to-send, Escape-to-close. Loads conversation history via new `GET /api/agent/history` endpoint. Schedule auto-refreshes after agent interactions. All 15 roadmap tasks checked off.

## 2026-04-05

- **Phase 10 Complete: Integrations & Web Chatbot.**
- **10.1 Outlook Calendar:** Microsoft OAuth flow (`/api/auth/microsoft` + callback). Token refresh via Microsoft identity platform. Outlook events fetched via Microsoft Graph API (`/me/calendarview`). Created `calendar_tokens` table for multi-provider storage with RLS. Migrated Google tokens from `profiles` to `calendar_tokens`. Unified calendar fetcher (`lib/calendar/fetchAllBusyWindows.ts`) merges all providers into single busy-windows list. Agent tools and schedule API switched to unified fetcher. Multi-provider calendar settings UI on dashboard.
- **10.3 Skipped:** No user demand for Todoist or Slack integrations — documented and deferred.

## 2026-04-06

- **Phase 10.5 Complete: Bug Fixes.**
- **Scheduling Engine:** Solver now clamps day start to current time (no past-time scheduling). Conflict checker and schedule API use overlapping range query (`start_time < endOfDay AND end_time > startOfDay`).
- **Chat Agent:** Created `getScheduledBlocks` tool — agent reads actual schedule from DB instead of hallucinating times. Added `update_duration` action to `updateTask` tool. Hardened system prompt: must report tool-returned times only, never from conversation context. Fixed SSE stream buffer dropping last chunk.
- **Data Integrity:** Task deletion now cascade-deletes scheduled blocks. Schedule move endpoint validates time ranges, checks conflicts (409 on overlap), and supports `cascade: true` to push subsequent blocks forward ("Need more time" workflow).
- **Resilience:** Calendar fetch failures handled gracefully with warning instead of silent empty. Widget API base URL uses `process.env.STRIDE_API_URL` with production fallback. Widget CSP allows both localhost and production.
- **Tests:** Added `nowOverride` to solver/reschedule for deterministic testing. All 23 tests pass.
- **Test-Log-Fix Loop (Phase 10.5):** Ran `npm run test:agent` — agent chat integration tests revealed three bugs traced through structured logs: (1) agent hallucinating schedule times — logs showed `logger.warn("agent returned times not matching any scheduled block")` — created `getScheduledBlocks` tool so agent reads real data from DB, (2) solver scheduling tasks in the past — `logger.error("solver placed block before current time")` — added `nowOverride` clamp to solver, (3) SSE stream dropping final chunk — `logger.warn("stream ended with buffered content")` — fixed buffer flush on stream close. Re-ran all 23 solver tests + 6 chat integration tests — all green.
- **Roadmaps:** Phase 10.5 plan + roadmap moved to `ai/roadmaps/complete/`.

## 2026-04-07

- **Phase Restructure:** Rewrote Phase 12 based on customer feedback. Phase 11 stays as Beta Launch (unchanged). Phase 12 is now "Customer Feedback Features" (audio chat, AI time estimation, widget upgrades) — goals, personalization loop, and refinements deferred to future phases. Updated Phase 12 plan/roadmap docs, `context.md`, and `prd.md` (added Phase 12 features to P2, removed Todoist/Slack).
- **Phase 11: Beta Launch — Observability & Onboarding.**
- **PostHog Analytics (Web):** Installed `posthog-js`. Created `lib/analytics.ts` — thin wrapper (`initAnalytics`, `identifyUser`, `trackEvent`). Initialized in `DashboardShell` on mount with user identification. Tracking: `day_built`, `task_created` (text/photo/voice), `chat_message_sent`, `calendar_connected` (google/outlook), onboarding events. OAuth callbacks pass `?connected=` param for reliable connection tracking.
- **PostHog Analytics (Widget):** Added `posthog-js` to widget. Created `widget/src/renderer/analytics.ts` with same wrapper pattern. Tracking `quick_action_used` events (done/skip/need_more_time) with `platform: "widget"` tag. PostHog key stored in encrypted `electron-store`. Updated widget CSP for PostHog domain.
- **Sentry Error Tracking:** Installed `@sentry/nextjs`. Created `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, and `instrumentation-client.ts` for Turbopack compatibility. `next.config.ts` wrapped with `withSentryConfig()`. Logger integration: `logger.error()` auto-reports to Sentry via dynamic import. Agent route (`/api/agent/chat`) catch blocks tagged with `component: "agent"`. Error boundaries: `app/app/error.tsx` (dashboard) and `app/global-error.tsx` (root), both olive-styled.
- **Onboarding Modal:** Created `OnboardingModal.tsx` — 4-step walkthrough (connect calendar → add tasks → build day → install widget) using Headless UI Dialog, olive design system. Step indicator dots, back/next/skip navigation. Completion persisted via `supabase.auth.updateUser({ data: { completed_onboarding: true } })`. Renders in `DashboardShell` for new users only.
- **Dependencies:** Installed `@sentry/nextjs`, `posthog-js` (web app). Installed `posthog-js` (widget).
- **Env Vars:** Added `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` to `.env.example`.
- **Roadmaps:** Updated Phase 11 roadmap — all 11.1/11.2/11.3 tasks checked off. Beta launch tasks marked as completed prior to Phase 11 (user recruitment, invite mechanism, instructions).
- **Phase 12: Customer Feedback Features.**
- **12.1 Audio Chat:** Mic button in web `ChatPanel` and widget chat. `useAudioRecorder` hook for browser recording, new `/api/agent/chat-audio` endpoint (audio → Whisper transcription → agent SSE stream). Widget audio via Electron IPC (`chat-send-audio` handler). Recording UI with pulsing indicator, duration timer, stop button. Analytics: `voice_chat_started`, `voice_chat_sent`, `voice_chat_error`.
- **12.2 AI Time Estimation:** Improved GPT prompts in `extractTasksFromPhoto` and `extractTasksFromText` with realistic duration ranges by task type. `createTask` tool `duration_minutes` now optional with keyword-based estimation fallback. Agent system prompt updated to mention estimated duration for user confirmation. "(AI estimate)" label added to `ExtractedTasksReview` UI.
- **12.3 Widget Upgrades:** Task completion flow — "Start [next task] now?" prompt with Yes/No after marking done (30s auto-dismiss, poll-safe). Expandable "Need more time" menu (+15/+30/+60 min). Scrollable daily schedule in expanded mode with hour gutter, task blocks, busy windows, current time indicator, drag-to-reschedule (pointer events, 5-min snap). Chat overlay — slides up over schedule, dismissible, suggestion chips inside overlay only.
- **New Agent Tools:** `scheduleTask` — places a single task in a free slot without touching existing blocks (replaces destructive `createScheduledBlocks` for add-task). `moveBlock` — moves an existing block to a new time with cascade push. `getScheduledBlocks` now returns `blockId` for use with `moveBlock`.
- **Agent Stability:** System prompt restructured with categorized tools (read-only / add / modify / destructive), explicit intent→tool mapping, and safety rules (max 1 moveBlock/createTask per message, stop on error, ask when unsure). `createScheduledBlocks` description warns about deletion; only used for "plan my day" / full reschedules.
- **Timezone Fix:** Added `parseTimeInZone()` to `lib/timezone.ts` — naive ISO strings (no Z or offset) interpreted in user's timezone instead of UTC. Applied to `scheduleTask`, `moveBlock`, `checkForConflicts`, `createScheduledBlocks`. Removed stale `[preferred:]` notes parsing from `createScheduledBlocks`.
- **Conversation History:** Capped at 10 messages (4 for voice). Schedule listings and inline time references stripped from assistant history to prevent agent from trusting stale times. Recursion limit bumped 10→15.
- **Widget Polish:** Recording stop button fix (DOM rebuild removed, duration text-only update). Task completion prompt poll guard (prevents 15s poll from wiping prompt). Tool display names updated for new tools (`scheduleTask`, `moveBlock`, `getScheduledBlocks`). Removed "What can you do?" chip (3 chips only). Chip bar padding fix. Schedule auto-reload on chat stream complete.
- **Roadmaps:** Phase 12 roadmap — all 27 tasks checked off. All acceptance criteria met. Tests pass (23/23).
