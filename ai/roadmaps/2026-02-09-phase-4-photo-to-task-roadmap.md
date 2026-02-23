# Phase 4: Photo & Audio to Task - Roadmap

**Date:** 2026-02-09
**Phase:** 4 - Photo & Audio to Task
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

- [ ] Define JSON schema for extracted tasks response (tasks array)
- [ ] Create helper: `lib/openai/extractTasksFromPhoto.ts`
- [ ] Build prompt: "Extract tasks from this image. Return JSON."
- [ ] Call OpenAI with multi-modal input (text + image URL)
- [ ] Use Structured Outputs (JSON schema)
- [ ] Test: send sample photo (whiteboard, syllabus), verify tasks extracted
- [ ] Parse AI response and validate structure
- [ ] Handle edge case: no tasks found in image

### 4.3 Audio-to-Task

- [ ] Add "Record audio" button to task form (MediaRecorder API)
- [ ] Show recording state (red indicator, elapsed time)
- [ ] Add "Stop" button to end recording
- [ ] Add audio file upload input (`<input type="file" accept="audio/*">`)
- [ ] Show audio playback preview before submission
- [ ] Create hook: `lib/audio/useAudioRecorder.ts` (start, stop, audioBlob, duration, reset)
- [ ] Handle microphone permission denied gracefully
- [ ] Create helper: `lib/openai/transcribeAudio.ts` (Whisper API)
- [ ] Test: transcribe sample audio, verify transcription text
- [ ] Create helper: `lib/openai/extractTasksFromText.ts` (text → tasks JSON)
- [ ] Use Structured Outputs (same JSON schema as photo extraction)
- [ ] Handle edge case: no tasks found in transcription
- [ ] Create API route: `POST /api/tasks/extract-audio` (audio → transcribe → extract)
- [ ] Test full flow: record audio → transcribe → extract tasks → verify output

### 4.4 Shared Extraction UI

- [ ] Create component: `components/features/ExtractedTasksReview.tsx`
- [ ] Show extracted tasks with editable title, duration, notes fields
- [ ] Add "Add all" and "Cancel" buttons
- [ ] Add loading state while AI is processing
- [ ] Add error state if extraction fails
- [ ] Wire photo extraction flow through shared review UI
- [ ] Wire audio extraction flow through shared review UI
- [ ] On confirm: create tasks in Supabase (with `photo_url` if from photo)
- [ ] Test full photo flow: upload → extract → review/edit → confirm → tasks in list
- [ ] Test full audio flow: record → transcribe → extract → review/edit → confirm → tasks in list

### 4.5 Photo Display

- [ ] Update task list component to show photo thumbnails (64x64px)
- [ ] Add click handler to thumbnail (open full-size photo)
- [ ] Create modal component: `components/features/PhotoModal.tsx`
- [ ] Modal shows full-size photo
- [ ] Add close button or click-outside to dismiss
- [ ] Style modal with oatmeal-olive-instrument
- [ ] Test: click thumbnail, see full-size photo, close modal

---

## Deliverable

Users can upload photos or record audio to extract tasks. Extracted tasks can be reviewed and edited before saving. Photos are stored and displayed with tasks.

---

## Acceptance Criteria

- [ ] All tasks checked off
- [ ] Photo upload works on mobile (camera input)
- [ ] Audio recording works on mobile (microphone)
- [ ] OpenAI extracts tasks from photos
- [ ] OpenAI Whisper transcribes audio, tasks extracted from transcription
- [ ] User can edit extracted tasks before saving
- [ ] Photos are stored in Supabase Storage
- [ ] Thumbnails show on task list
- [ ] Full-size photo opens in modal
- [ ] Errors handled gracefully (permission denied, no tasks found, upload failed)

---

## Next Phase

**Phase 5:** Polish & Validation (`2026-02-09-phase-5-polish-validation-roadmap.md`)
