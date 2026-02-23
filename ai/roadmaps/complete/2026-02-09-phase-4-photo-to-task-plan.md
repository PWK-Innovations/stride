# Phase 4: Photo & Audio to Task - Implementation Plan

**Date:** 2026-02-09
**Phase:** 4 - Photo & Audio to Task
**Status:** Complete
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-02-09-phase-4-photo-to-task-roadmap.md`
**Previous Phase:** `2026-02-09-phase-3-core-data-flow-plan.md`

---

## Clean Code Principles

Keep photo upload, audio recording, and AI extraction simple. Don't build a full image editor, audio waveform display, or complex media management system. Just: capture → extract tasks → save. Avoid over-engineering, cruft, and legacy-compatibility features.

---

## Goal

Enable users to add tasks by uploading photos (whiteboards, syllabi, handwritten notes) or recording/uploading audio (voice memos, spoken task lists). By the end of this phase, users can capture media, the app extracts tasks from it, and those tasks are added to their list.

---

## Prerequisites

- Phase 3 complete (task CRUD, calendar integration, AI scheduling, timeline view)

---

## 4.1 Photo Upload

### Add Photo Upload UI

Update task form component:
- Add file input or camera button (use `<input type="file" accept="image/*" capture="environment">` for camera on mobile)
- Show preview of selected photo
- Allow user to upload photo without text (photo-only task) or with text (photo + manual task details)

### Upload Photos to Supabase Storage

Create helper: `lib/supabase/uploadPhoto.ts`
- Input: File object
- Upload to Supabase Storage bucket (e.g., `task-photos`)
- Return public URL or signed URL
- Handle errors (file too large, upload failed)

Set up Supabase Storage:
- Create bucket: `task-photos`
- Set bucket policy: users can upload their own photos (RLS based on `user_id` in file path)
- Set max file size (e.g., 5MB)

### Store Photo URLs on Tasks

Update `tasks` table (already has `photo_url` column from Phase 0):
- When creating task with photo: upload photo first, then save task with `photo_url`
- API route `POST /api/tasks` accepts optional `photo` (File) and `photo_url` (string)

---

## 4.2 Photo-to-Task with OpenAI

### Send Photo to OpenAI API

Create helper: `lib/openai/extractTasksFromPhoto.ts`
- Input: photo URL (public or base64)
- Call OpenAI Responses API with multi-modal input (text + image)
- Prompt: "Extract tasks from this image. Return JSON with array of tasks (title, duration_minutes, optional deadline)."
- Use Structured Outputs to ensure valid JSON

### Parse AI Response

Define JSON schema for extracted tasks response:
- `tasks`: array of `{ title: string, duration_minutes: number, deadline?: string, notes?: string }`

Parse response and validate:
- Ensure all tasks have title and duration
- Handle case where no tasks are found ("No tasks detected in this image")

### Create Tasks in Database

After extraction:
- Show extracted tasks to user in a confirmation UI
- Allow user to edit titles, durations before saving
- On confirm: create tasks in Supabase (with `photo_url` attached)
- On cancel: discard extracted tasks

---

## 4.3 Audio-to-Task

### Add Audio Input UI

Update task form component:
- Add a "Record audio" button that uses the browser MediaRecorder API
- Show recording state (red dot, elapsed time) while recording
- Add a "Stop" button to end recording
- Also accept audio file upload via `<input type="file" accept="audio/*">` for pre-recorded files
- Show playback preview of recorded/uploaded audio before submission

### Audio Recording Implementation

Create helper: `lib/audio/useAudioRecorder.ts` (custom React hook)
- Request microphone permission via `navigator.mediaDevices.getUserMedia`
- Record using MediaRecorder API, output as webm or mp3
- Return: `{ isRecording, start, stop, audioBlob, audioUrl, duration, reset }`
- Handle permission denied gracefully (show message, don't break UI)

### Transcribe Audio with OpenAI Whisper

Create helper: `lib/openai/transcribeAudio.ts`
- Input: audio File or Blob
- Call OpenAI Audio Transcription API (`whisper-1` model)
- Return transcription text
- Handle errors (file too large, unsupported format, API error)

### Extract Tasks from Transcription

Create helper: `lib/openai/extractTasksFromText.ts`
- Input: transcription text (plain string)
- Call OpenAI with text prompt: "Extract tasks from this text. Return JSON with array of tasks (title, duration_minutes, optional notes)."
- Use Structured Outputs (same JSON schema as photo extraction)
- Handle case where no tasks are found

### API Route for Audio

Create API route: `POST /api/tasks/extract-audio`
- Accept audio file (multipart form data)
- Transcribe with Whisper → extract tasks from transcription
- Return extracted tasks (same shape as photo extraction)

### Create Tasks in Database

Reuse the same confirmation UI from photo-to-task:
- Show extracted tasks for user review/edit
- On confirm: create tasks in Supabase
- On cancel: discard

---

## 4.4 Shared Extraction UI

### Confirmation/Edit Modal

Create component: `components/features/ExtractedTasksReview.tsx`
- Shared by both photo and audio extraction flows
- Shows list of extracted tasks with editable title, duration, notes
- "Add all" and "Cancel" buttons
- Loading state while AI is processing
- Error state if extraction fails

### Media Input Selector

Update the task form to present input options cleanly:
- Text input (existing)
- Camera/photo upload button
- Microphone/audio upload button
- All three options visible, not buried in menus

---

## 4.5 Photo Display

### Show Photo Thumbnails on Tasks

Update task list component:
- If task has `photo_url`, show small thumbnail (e.g., 64x64px)
- On click: open full-size photo in modal or new tab

### Full-Size Photo View

Create modal component: `components/features/PhotoModal.tsx`
- Show full-size photo
- Close button or click outside to dismiss
- Use oatmeal-olive-instrument modal styling

---

## Deliverable

Users can take a photo of a whiteboard or syllabus, or record a voice memo describing their tasks. The app extracts tasks from either input, lets the user review and edit them, and saves them to the task list. Photos are stored and shown with tasks.

---

## Acceptance Criteria

- User can upload photo via file input or camera
- Photo is uploaded to Supabase Storage
- OpenAI extracts tasks from photo (title, duration)
- User can record audio or upload an audio file
- Audio is transcribed via OpenAI Whisper
- Tasks are extracted from transcription
- Extracted tasks (from photo or audio) are shown to user for confirmation
- User can edit extracted tasks before saving
- Tasks are saved (with `photo_url` attached if from photo)
- Task list shows photo thumbnails
- Clicking thumbnail opens full-size photo
- Both flows work on mobile (camera input, microphone recording)
- Errors are handled (no tasks found, upload failed, permission denied, API error)

---

## Next Phase

**Phase 5:** Polish & Validation (`2026-02-09-phase-5-polish-validation-plan.md`)
