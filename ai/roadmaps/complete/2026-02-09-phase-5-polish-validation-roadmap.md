# Phase 5: Polish & Validation - Roadmap

**Date:** 2026-02-09
**Phase:** 5 - Polish & Validation
**Status:** In progress (code polish complete)
**Plan:** `2026-02-09-phase-5-polish-validation-plan.md`
**Previous Phase:** `2026-02-09-phase-4-photo-to-task-roadmap.md`

---

## Tasks

### 5.1 Error Handling & Edge Cases

- [x] Create `lib/errors/friendlyMessage.ts` — maps errors/status codes to user-friendly strings
- [x] Apply friendly errors to `schedule/build`, `tasks`, `tasks/[id]`, `extract-photo`, `extract-audio`
- [x] Fix `error: any` → `error: unknown` in schedule/build, tasks, tasks/[id]
- [x] Handle OpenAI rate limit (429): friendly message via pattern matching
- [x] Handle OpenAI timeout: friendly message via pattern matching
- [x] Handle Google Calendar errors: friendly message via pattern matching
- [x] Handle token expired/revoked: friendly message via pattern matching
- [x] Handle no tasks: empty state in dashboard
- [x] Handle all tasks overflow: overflow list (already existed)
- [x] Handle all-day events: correctly skipped (already working)
- [ ] Handle no free time: show message, suggest reducing tasks
- [ ] Ensure all times are in user's local time zone
- [ ] Test all error scenarios

### 5.2 UX Improvements

- [x] Add loading spinner for task list (`loadingTasks` state)
- [x] Add loading state for "Build my day" (spinner + message) — already existed
- [x] Add loading indicator for photo upload — already existed (ExtractedTasksReview)
- [x] Design empty state: no tasks — already existed
- [x] Design empty state: no calendar connected — already existed
- [x] Design empty state: no schedule ("Click Build my day...")
- [x] Replace `alert()` with inline error banner (`scheduleError` state)
- [x] Add confirmation dialog for delete task (`ConfirmDialog` + `deletingTaskId`)
- [x] Implement keyboard shortcut: `Cmd/Ctrl + N` (focus title input)
- [x] Implement keyboard shortcut: `Cmd/Ctrl + B` (build day)
- [x] Implement keyboard shortcut: `Escape` (close modals/extraction/confirm)
- [x] Create `lib/hooks/useKeyboardShortcuts.ts` — reusable hook for global shortcuts
- [x] Create `components/features/ConfirmDialog.tsx` — reusable HeadlessUI dialog
- [ ] Add loading skeleton for timeline (deferred — not needed at MVP scale)
- [ ] Add confirmation dialog for disconnect calendar (deferred — no disconnect UI in MVP)
- [ ] Test all loading states, empty states, confirmations, shortcuts

### 5.3 Performance Optimization

- [x] Parallelize: fetch tasks and calendar events with `Promise.all` in schedule/build
- [x] Lazy load photo thumbnails (`loading="lazy"` on `<img>`)
- [ ] Review OpenAI prompts: move to reusable prompts in dashboard if possible (deferred)
- [ ] Batch database queries where possible (deferred — not a bottleneck)
- [ ] Add virtualization if timeline is slow (deferred — not needed at MVP scale)
- [ ] Debounce timeline updates if needed (deferred — not needed at MVP scale)
- [ ] Test: measure "Build my day" latency, optimize if >5 seconds

### 5.4 Internal Dogfooding

- [ ] Team uses app daily for 1 week (minimum)
- [ ] Track friction points and bugs in shared doc or issue tracker
- [ ] Prioritize top 5-10 issues by severity and frequency
- [ ] Fix critical bugs (app crashes, data loss, broken core flow)
- [ ] Fix top UX issues (confusing UI, slow operations, unclear errors)
- [ ] Re-test after fixes
- [ ] Repeat for second week if needed
- [ ] Document lessons learned

### 5.5 Browser Notifications

- [x] Check `Notification.permission` on app load
- [x] Show notification prompt after first "Build my day" (if permission is "default")
- [x] Implement `Notification.requestPermission()`
- [x] After schedule is built, calculate time until each task starts
- [x] Use `setTimeout` to show notification at start time
- [x] Notification content: title = task title, body = duration
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Verify notifications appear at correct times
- [ ] Verify clicking notification opens app

---

## Deliverable

Polished MVP ready for external beta. Core flow is smooth and reliable. Notifications for task start times.

---

## Acceptance Criteria

- [ ] All tasks checked off
- [ ] All errors handled gracefully
- [ ] All edge cases covered
- [ ] Loading and empty states implemented
- [ ] Performance is acceptable (<5s for "Build my day")
- [ ] Team has dogfooded for 1-2 weeks
- [ ] Top friction points fixed

---

## Next Phase

**Phase 6:** Code Quality & Security (`2026-02-23-phase-6-code-quality-security-roadmap.md`)
