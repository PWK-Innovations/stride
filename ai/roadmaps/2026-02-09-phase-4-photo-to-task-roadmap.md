# Phase 4: Photo-to-Task - Roadmap

**Date:** 2026-02-09
**Phase:** 4 - Photo-to-Task
**Status:** Not started
**Plan:** `2026-02-09-phase-4-photo-to-task-plan.md`
**Previous Phase:** `2026-02-09-phase-3-core-data-flow-roadmap.md`

---

## Tasks

### 4.1 Photo Upload

- [ ] Add file input to task form (`<input type="file" accept="image/*" capture="environment">`)
- [ ] Show photo preview after selection
- [ ] Create Supabase Storage bucket: `task-photos`
- [ ] Set bucket policy (RLS: users upload their own photos)
- [ ] Set max file size (5MB)
- [ ] Create helper: `lib/supabase/uploadPhoto.ts` (upload file, return URL)
- [ ] Test: upload photo, verify it's in Supabase Storage
- [ ] Update API route: `POST /api/tasks` to accept photo file
- [ ] On task creation with photo: upload photo first, then save task with `photo_url`
- [ ] Test: create task with photo, verify `photo_url` is saved

### 4.2 Photo-to-Task with OpenAI

- [ ] Define JSON schema for photo-to-task response (tasks array)
- [ ] Create helper: `lib/openai/extractTasksFromPhoto.ts`
- [ ] Build prompt: "Extract tasks from this image. Return JSON."
- [ ] Call OpenAI with multi-modal input (text + image URL)
- [ ] Use Structured Outputs (JSON schema)
- [ ] Test: send sample photo (whiteboard, syllabus), verify tasks extracted
- [ ] Parse AI response and validate structure
- [ ] Handle edge case: no tasks found in image
- [ ] Create confirmation UI (show extracted tasks, allow edit)
- [ ] Add "Confirm" and "Cancel" buttons
- [ ] On confirm: create tasks in Supabase (with `photo_url`)
- [ ] Test full flow: upload photo → extract tasks → edit → confirm → see tasks in list

### 4.3 Photo Display

- [ ] Update task list component to show photo thumbnails (64x64px)
- [ ] Add click handler to thumbnail (open full-size photo)
- [ ] Create modal component: `components/features/PhotoModal.tsx`
- [ ] Modal shows full-size photo
- [ ] Add close button or click-outside to dismiss
- [ ] Style modal with oatmeal-olive-instrument
- [ ] Test: click thumbnail, see full-size photo, close modal

---

## Deliverable

Users can upload photos, extract tasks, and see photos attached to tasks.

---

## Acceptance Criteria

- [ ] All tasks checked off
- [ ] Photo upload works on mobile (camera input)
- [ ] OpenAI extracts tasks from photos
- [ ] User can edit extracted tasks before saving
- [ ] Photos are stored in Supabase Storage
- [ ] Thumbnails show on task list
- [ ] Full-size photo opens in modal
- [ ] Errors handled gracefully

---

## Next Phase

**Phase 5:** Polish & Validation (`2026-02-09-phase-5-polish-validation-roadmap.md`)
