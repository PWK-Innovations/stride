# Phase 4: Photo & Audio to Task - Roadmap

**Date:** 2026-02-09
**Phase:** 4 - Photo & Audio to Task
**Status:** Complete
**Plan:** `2026-02-09-phase-4-photo-to-task-plan.md`
**Previous Phase:** `2026-02-09-phase-3-core-data-flow-roadmap.md`

---

## Tasks

### 4.1 Photo Upload

- [x] Add file input to task form (`<input type="file" accept="image/*" capture="environment">`)
- [x] Show photo preview after selection
- [x] Create Supabase Storage bucket: `task-photos`
- [x] Set bucket policy (RLS: users upload their own photos)
- [x] Set max file size (5MB)
- [x] Create helper: `lib/supabase/uploadPhoto.ts` (upload file, return URL)
- [x] Test: upload photo, verify it's in Supabase Storage
- [x] Update API route: `POST /api/tasks` to accept photo file
- [x] On task creation with photo: upload photo first, then save task with `photo_url`
- [x] Test: create task with photo, verify `photo_url` is saved

### 4.2 Photo-to-Task with OpenAI

- [x] Define JSON schema for extracted tasks response (tasks array)
- [x] Create helper: `lib/openai/extractTasksFromPhoto.ts`
- [x] Build prompt: "Extract tasks from this image. Return JSON."
- [x] Call OpenAI with multi-modal input (text + image URL)
- [x] Use Structured Outputs (JSON schema)
- [x] Test: send sample photo (whiteboard, syllabus), verify tasks extracted
- [x] Parse AI response and validate structure
- [x] Handle edge case: no tasks found in image

### 4.3 Audio-to-Task

- [x] Add "Record audio" button to task form (MediaRecorder API)
- [x] Show recording state (red indicator, elapsed time)
- [x] Add "Stop" button to end recording
- [x] Add audio file upload input (`<input type="file" accept="audio/*">`)
- [x] Show audio playback preview before submission
- [x] Create hook: `lib/audio/useAudioRecorder.ts` (start, stop, audioBlob, duration, reset)
- [x] Handle microphone permission denied gracefully
- [x] Create helper: `lib/openai/transcribeAudio.ts` (Whisper API)
- [x] Test: transcribe sample audio, verify transcription text
- [x] Create helper: `lib/openai/extractTasksFromText.ts` (text → tasks JSON)
- [x] Use Structured Outputs (same JSON schema as photo extraction)
- [x] Handle edge case: no tasks found in transcription
- [x] Create API route: `POST /api/tasks/extract-audio` (audio → transcribe → extract)
- [x] Test full flow: record audio → transcribe → extract tasks → verify output

### 4.4 Shared Extraction UI

- [x] Create component: `components/features/ExtractedTasksReview.tsx`
- [x] Show extracted tasks with editable title, duration, notes fields
- [x] Add "Add all" and "Cancel" buttons
- [x] Add loading state while AI is processing
- [x] Add error state if extraction fails
- [x] Wire photo extraction flow through shared review UI
- [x] Wire audio extraction flow through shared review UI
- [x] On confirm: create tasks in Supabase (with `photo_url` if from photo)
- [x] Test full photo flow: upload → extract → review/edit → confirm → tasks in list
- [x] Test full audio flow: record → transcribe → extract → review/edit → confirm → tasks in list

### 4.5 Photo Display

- [x] Update task list component to show photo thumbnails (64x64px)
- [x] Add click handler to thumbnail (open full-size photo)
- [x] Create modal component: `components/features/PhotoModal.tsx`
- [x] Modal shows full-size photo
- [x] Add close button or click-outside to dismiss
- [x] Style modal with oatmeal-olive-instrument
- [x] Test: click thumbnail, see full-size photo, close modal

---

## Deliverable

Users can upload photos or record audio to extract tasks. Extracted tasks can be reviewed and edited before saving. Photos are stored and displayed with tasks.

---

## Acceptance Criteria

- [x] All tasks checked off
- [x] Photo upload works on mobile (camera input)
- [x] Audio recording works on mobile (microphone)
- [x] OpenAI extracts tasks from photos
- [x] OpenAI Whisper transcribes audio, tasks extracted from transcription
- [x] User can edit extracted tasks before saving
- [x] Photos are stored in Supabase Storage
- [x] Thumbnails show on task list
- [x] Full-size photo opens in modal
- [x] Errors handled gracefully (permission denied, no tasks found, upload failed)

---

## Next Phase

**Phase 5:** Polish & Validation (`2026-02-09-phase-5-polish-validation-roadmap.md`)
