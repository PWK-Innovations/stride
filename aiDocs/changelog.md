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