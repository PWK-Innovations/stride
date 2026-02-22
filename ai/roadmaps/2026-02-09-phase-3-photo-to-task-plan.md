# Phase 3: Photo-to-Task - Implementation Plan

**Date:** 2026-02-09  
**Phase:** 3 - Photo-to-Task (Week 4)  
**Status:** Not started  
**Parent Plan:** `2026-02-09-stride-implementation-plan.md`  
**Roadmap:** `2026-02-09-phase-3-photo-to-task-roadmap.md`  
**Previous Phase:** `2026-02-09-phase-2-core-data-flow-plan.md`

---

## Clean Code Principles

Keep photo upload and OCR simple. Don't build a full image editor or complex photo management system. Just: upload → extract tasks → save.

---

## Goal

Enable users to add tasks by uploading photos (whiteboards, syllabi, handwritten notes). By the end of this phase, users can take a photo, the app extracts tasks from it, and those tasks are added to their list.

---

## Prerequisites

- Phase 2 complete (task CRUD, calendar integration, AI scheduling, timeline view)

---

## 3.1 Photo Upload

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

## 3.2 Photo-to-Task with OpenAI

### Send Photo to OpenAI API

Create helper: `lib/openai/extractTasksFromPhoto.ts`
- Input: photo URL (public or base64)
- Call OpenAI Responses API with multi-modal input (text + image)
- Prompt: "Extract tasks from this image. Return JSON with array of tasks (title, duration_minutes, optional deadline)."
- Use Structured Outputs to ensure valid JSON

### Parse AI Response

Define JSON schema for photo-to-task response:
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

## 3.3 Photo Display

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

Users can take a photo of a whiteboard or syllabus, the app extracts tasks from it, and those tasks are added to their list. Photos are stored and shown with tasks.

---

## Acceptance Criteria

-User can upload photo via file input or camera
-Photo is uploaded to Supabase Storage
-OpenAI extracts tasks from photo (title, duration)
-Extracted tasks are shown to user for confirmation
-User can edit extracted tasks before saving
-Tasks are saved with `photo_url` attached
-Task list shows photo thumbnails
-Clicking thumbnail opens full-size photo
-Photo-to-task flow works on mobile (camera input)
-Errors are handled (no tasks found, upload failed, OpenAI error)

---

## Next Phase

**Phase 4:** Polish & Validation (`2026-02-09-phase-4-polish-validation-plan.md`)
