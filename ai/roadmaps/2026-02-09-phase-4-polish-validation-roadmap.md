# Phase 4: Polish & Validation - Roadmap

**Date:** 2026-02-09  
**Phase:** 4 - Polish & Validation (Week 5)  
**Status:** Not started  
**Plan:** `2026-02-09-phase-4-polish-validation-plan.md`  
**Previous Phase:** `2026-02-09-phase-3-photo-to-task-roadmap.md`

---

## Tasks

### 4.1 Error Handling & Edge Cases

- [ ] Handle OpenAI rate limit (429): show message, implement backoff
- [ ] Handle OpenAI timeout: show message, retry
- [ ] Handle OpenAI invalid response: fallback or error message
- [ ] Handle Google Calendar token expired (401): refresh token, retry
- [ ] Handle Google Calendar rate limit (429): implement backoff
- [ ] Handle Google Calendar no events: empty busy windows
- [ ] Handle no tasks: show empty state
- [ ] Handle no free time: show message, suggest reducing tasks
- [ ] Handle all tasks overflow: show overflow list
- [ ] Handle all-day events: ignore or handle separately
- [ ] Ensure all times are in user's local time zone
- [ ] Test all error scenarios

### 4.2 UX Improvements

- [ ] Add loading spinner for task list
- [ ] Add loading state for "Build my day" (spinner + message)
- [ ] Add loading indicator for photo upload
- [ ] Add loading skeleton for timeline
- [ ] Design empty state: no tasks
- [ ] Design empty state: no calendar connected
- [ ] Design empty state: no schedule
- [ ] Add confirmation dialog for delete task
- [ ] Add confirmation dialog for disconnect calendar
- [ ] Implement keyboard shortcut: `Cmd/Ctrl + N` (add task)
- [ ] Implement keyboard shortcut: `Cmd/Ctrl + B` (build day)
- [ ] Implement keyboard shortcut: `Escape` (close modals)
- [ ] Test all loading states, empty states, confirmations, shortcuts

### 4.3 Performance Optimization

- [ ] Parallelize: fetch tasks and calendar events at same time
- [ ] Review OpenAI prompts: move to reusable prompts in dashboard if possible
- [ ] Batch database queries where possible
- [ ] Test timeline with many items (20+ tasks + events)
- [ ] Add virtualization if timeline is slow (react-window)
- [ ] Debounce timeline updates if needed
- [ ] Lazy load photo thumbnails (only load when visible)
- [ ] Test: measure "Build my day" latency, optimize if >5 seconds

### 4.4 Internal Dogfooding

- [ ] Team uses app daily for 1 week (minimum)
- [ ] Track friction points and bugs in shared doc or issue tracker
- [ ] Prioritize top 5-10 issues by severity and frequency
- [ ] Fix critical bugs (app crashes, data loss, broken core flow)
- [ ] Fix top UX issues (confusing UI, slow operations, unclear errors)
- [ ] Re-test after fixes
- [ ] Repeat for second week if needed
- [ ] Document lessons learned

### 4.5 Browser Notifications

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

**Phase 5:** Beta Launch (`2026-02-09-phase-5-beta-launch-roadmap.md`)
