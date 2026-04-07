'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlusIcon } from '@/components/icons/plus-icon';
import { TrashIcon } from '@/components/icons/trash-icon';
import { SparklesIcon } from '@/components/icons/sparkles-icon';
import { CameraIcon } from '@/components/icons/camera-icon';
import { MicrophoneIcon } from '@/components/icons/microphone-icon';
import { DailyTimeline } from '@/components/features/DailyTimeline';
import { ExtractedTasksReview } from '@/components/features/ExtractedTasksReview';
import { PhotoModal } from '@/components/features/PhotoModal';
import { ConfirmDialog } from '@/components/features/ConfirmDialog';
import { ChatPanel } from '@/components/features/ChatPanel';
import { uploadPhoto } from '@/lib/supabase/uploadPhoto';
import { createClient } from '@/lib/supabase/client';
import { useAudioRecorder } from '@/lib/audio/useAudioRecorder';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import {
  requestNotificationPermission,
  scheduleNotifications,
} from '@/lib/notifications/scheduleNotifications';

import { createLogger } from '@/lib/logger';
import { trackEvent } from '@/lib/analytics';
import type { ExtractedTask } from '@/types/database';

const logger = createLogger("app:dashboard");

interface Task {
  id: string;
  title: string;
  notes: string | null;
  duration_minutes: number;
  photo_url: string | null;
  created_at: string;
}

interface ScheduledBlock {
  id?: string;
  task_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
}

export default function AppPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [buildingSchedule, setBuildingSchedule] = useState(false);
  const [schedule, setSchedule] = useState<ScheduledBlock[]>([]);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [overflow, setOverflow] = useState<string[]>([]);
  const [busyWindows, setBusyWindows] = useState<Array<{ start: string; end: string; title?: string }>>([]);
  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);
  const [outlookConnected, setOutlookConnected] = useState<boolean | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Agent progress state
  const [agentSteps, setAgentSteps] = useState<Array<{ type: 'tool' | 'text'; content: string }>>([]);
  const [agentThinking, setAgentThinking] = useState(false);

  // Chat panel state
  const [chatOpen, setChatOpen] = useState(false);

  // Extraction state (shared between photo and audio)
  const [extracting, setExtracting] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [showExtraction, setShowExtraction] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [savingExtracted, setSavingExtracted] = useState(false);
  const [extractionSource, setExtractionSource] = useState<"photo" | "audio" | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Audio recorder
  const {
    isRecording,
    duration: recordingDuration,
    audioBlob,
    audioUrl,
    error: recorderError,
    start: startRecording,
    stop: stopRecording,
    reset: resetRecording,
  } = useAudioRecorder();

  // Widget banner state
  const [widgetBannerDismissed, setWidgetBannerDismissed] = useState(true);

  // Photo modal state
  const [modalPhotoUrl, setModalPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchGoogleStatus();
    fetchSchedule();
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem("stride-widget-banner-dismissed");
    if (dismissed !== "true") {
      setWidgetBannerDismissed(false);
    }
  }, []);

  useEffect(() => {
    const connected = searchParams.get("connected");
    if (connected === "google" || connected === "outlook") {
      trackEvent("calendar_connected", { provider: connected });
      router.replace("/app", { scroll: false });
    }
  }, [searchParams, router]);

  const fetchGoogleStatus = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (res.ok) {
        setGoogleConnected(data.googleConnected);
        setOutlookConnected(data.outlookConnected);
      }
    } catch (error) {
      logger.error("Failed to fetch Google status", { error });
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      logger.error("Failed to fetch tasks", { error });
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchSchedule = async () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch(`/api/schedule?timezone=${encodeURIComponent(tz)}`);
      const data = await res.json();
      if (res.ok) {
        if (data.scheduled_blocks?.length > 0) {
          setSchedule(
            data.scheduled_blocks.map((b: ScheduledBlock & { title?: string }) => ({
              id: b.id,
              task_id: b.task_id,
              start_time: b.start_time,
              end_time: b.end_time,
              duration_minutes: Math.round(
                (new Date(b.end_time).getTime() - new Date(b.start_time).getTime()) / 60000,
              ),
            })),
          );
        }
        if (data.busy_windows?.length > 0) {
          setBusyWindows(data.busy_windows);
        }
      }
    } catch (error) {
      logger.error("Failed to fetch schedule", { error });
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, notes, duration_minutes: duration }),
      });

      if (res.ok) {
        trackEvent("task_created", { type: "text" });
        setTitle('');
        setNotes('');
        setDuration(30);
        await fetchTasks();
      }
    } catch (error) {
      logger.error("Failed to add task", { error });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteTask = async () => {
    if (!deletingTaskId) return;
    const id = deletingTaskId;
    setDeletingTaskId(null);
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchTasks();
      }
    } catch (error) {
      logger.error("Failed to delete task", { error });
    }
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input so the same file can be selected again
    e.target.value = '';

    setPendingPhoto(file);
    setExtractionSource("photo");
    setTranscription(null);
    setShowExtraction(true);
    setExtracting(true);
    setExtractionError(null);
    setExtractedTasks([]);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch('/api/tasks/extract-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setExtractionError(data.error || 'Failed to extract tasks');
        return;
      }

      setExtractedTasks(data.tasks);
      trackEvent("task_created", { type: "photo" });
    } catch (error) {
      logger.error("Failed to extract tasks from photo", { error });
      setExtractionError('Failed to analyze photo. Please try again.');
    } finally {
      setExtracting(false);
    }
  };

  const handleConfirmExtracted = async (confirmedTasks: ExtractedTask[]) => {
    if (confirmedTasks.length === 0) return;

    setSavingExtracted(true);
    try {
      // Upload the photo to Supabase Storage (only for photo extractions)
      let photoUrl: string | null = null;
      if (extractionSource === "photo" && pendingPhoto) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          photoUrl = await uploadPhoto(user.id, pendingPhoto);
        }
      }

      // Create each task sequentially
      const failed: string[] = [];
      for (const task of confirmedTasks) {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: task.title,
            notes: task.notes,
            duration_minutes: task.duration_minutes,
            photo_url: photoUrl,
          }),
        });
        if (!res.ok) {
          failed.push(task.title);
        }
      }

      if (failed.length > 0) {
        setExtractionError(
          `Failed to save ${failed.length} task${failed.length > 1 ? "s" : ""}: ${failed.join(", ")}`,
        );
        return;
      }

      setShowExtraction(false);
      setPendingPhoto(null);
      setExtractedTasks([]);
      setExtractionSource(null);
      setTranscription(null);
      resetRecording();
      await fetchTasks();
    } catch (error) {
      logger.error("Failed to save extracted tasks", { error });
      setExtractionError('Failed to save tasks. Please try again.');
    } finally {
      setSavingExtracted(false);
    }
  };

  const handleCancelExtraction = () => {
    setShowExtraction(false);
    setPendingPhoto(null);
    setExtractedTasks([]);
    setExtractionError(null);
    setExtractionSource(null);
    setTranscription(null);
    resetRecording();
  };

  const handleAudioSubmit = async (blob: Blob) => {
    setExtractionSource("audio");
    setTranscription(null);
    setShowExtraction(true);
    setExtracting(true);
    setExtractionError(null);
    setExtractedTasks([]);

    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const res = await fetch("/api/tasks/extract-audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setExtractionError(data.error || "Failed to extract tasks from audio");
        return;
      }

      setTranscription(data.transcription || null);
      setExtractedTasks(data.tasks);
      trackEvent("task_created", { type: "voice" });
    } catch (error) {
      logger.error("Failed to extract tasks from audio", { error });
      setExtractionError("Failed to analyze audio. Please try again.");
    } finally {
      setExtracting(false);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    handleAudioSubmit(file);
  };

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "/",
      handler: () => titleInputRef.current?.focus(),
    },
    {
      key: "b",
      meta: true,
      handler: () => {
        if (tasks.length > 0 && !buildingSchedule) {
          buildMyDay(false);
        }
      },
    },
    {
      key: "Escape",
      handler: () => {
        if (chatOpen) {
          setChatOpen(false);
        } else if (deletingTaskId) {
          setDeletingTaskId(null);
        } else if (modalPhotoUrl) {
          setModalPhotoUrl(null);
        } else if (showExtraction) {
          handleCancelExtraction();
        }
      },
    },
  ]);

  const dismissWidgetBanner = () => {
    localStorage.setItem("stride-widget-banner-dismissed", "true");
    setWidgetBannerDismissed(true);
  };

  const widgetDownloadUrl = process.env.NEXT_PUBLIC_WIDGET_DOWNLOAD_URL || "#";

  return (
    <>
      {/* Widget Download Banner */}
      {!widgetBannerDismissed && (
        <div className="mb-8 flex items-center justify-between gap-4 rounded-lg border border-olive-200 bg-olive-50 p-4 shadow-sm dark:border-olive-800 dark:bg-olive-900">
          <p className="flex-1 text-sm font-medium text-olive-700 dark:text-olive-300">
            Get the Stride desktop widget — stay on track without leaving your workflow
          </p>
          <div className="flex items-center gap-3">
            <a
              href={widgetDownloadUrl}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-olive-950 px-3 py-1 text-sm/7 font-medium text-white hover:bg-olive-800 dark:bg-olive-300 dark:text-olive-950 dark:hover:bg-olive-200"
            >
              Download for macOS
            </a>
            <button
              onClick={dismissWidgetBanner}
              className="text-olive-400 hover:text-olive-600 dark:text-olive-500 dark:hover:text-olive-300"
              aria-label="Dismiss widget banner"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <div className="mb-8 rounded-lg border border-olive-200 bg-white p-6 shadow-sm dark:border-olive-800 dark:bg-olive-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold text-olive-900 dark:text-olive-50">
            Add a task
          </h2>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
            <input
              ref={audioFileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={extracting || savingExtracted || isRecording}
              className="inline-flex items-center gap-2 rounded-md border border-olive-300 px-3 py-2 text-sm font-medium text-olive-700 hover:bg-olive-50 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:opacity-50 dark:border-olive-600 dark:text-olive-300 dark:hover:bg-olive-800"
            >
              <CameraIcon className="h-4 w-4" />
              Snap tasks
            </button>
            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Stop ({formatDuration(recordingDuration)})
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                disabled={extracting || savingExtracted}
                className="inline-flex items-center gap-2 rounded-md border border-olive-300 px-3 py-2 text-sm font-medium text-olive-700 hover:bg-olive-50 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:opacity-50 dark:border-olive-600 dark:text-olive-300 dark:hover:bg-olive-800"
              >
                <MicrophoneIcon className="h-4 w-4" />
                Voice tasks
              </button>
            )}
          </div>
        </div>
        <form onSubmit={addTask} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-olive-700 dark:text-olive-300"
            >
              Title
            </label>
            <input
              ref={titleInputRef}
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-olive-300 bg-white px-3 py-2 text-olive-900 placeholder-olive-400 focus:border-olive-500 focus:outline-none focus:ring-1 focus:ring-olive-500 dark:border-olive-700 dark:bg-olive-800 dark:text-olive-100"
              placeholder="Review Q3 report"
              required
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-olive-700 dark:text-olive-300"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border border-olive-300 bg-white px-3 py-2 text-olive-900 placeholder-olive-400 focus:border-olive-500 focus:outline-none focus:ring-1 focus:ring-olive-500 dark:border-olive-700 dark:bg-olive-800 dark:text-olive-100"
              placeholder="Check metrics and prepare summary"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-olive-700 dark:text-olive-300"
            >
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min="5"
              step="5"
              className="mt-1 block w-32 rounded-md border border-olive-300 bg-white px-3 py-2 text-olive-900 focus:border-olive-500 focus:outline-none focus:ring-1 focus:ring-olive-500 dark:border-olive-700 dark:bg-olive-800 dark:text-olive-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-olive-600 px-4 py-2 text-sm font-medium text-white hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-olive-500 dark:hover:bg-olive-600"
          >
            <PlusIcon className="h-4 w-4" />
            Add task
          </button>
        </form>
      </div>

      {/* Recorder Error */}
      {recorderError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
          <p className="text-sm text-red-700 dark:text-red-300">{recorderError}</p>
        </div>
      )}

      {/* Audio Preview */}
      {audioBlob && audioUrl && !showExtraction && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-olive-200 bg-white p-4 shadow-sm dark:border-olive-800 dark:bg-olive-900">
          <audio src={audioUrl} controls className="h-8 flex-1" />
          <button
            type="button"
            onClick={() => handleAudioSubmit(audioBlob)}
            disabled={extracting}
            className="inline-flex items-center gap-2 rounded-md bg-olive-600 px-3 py-2 text-sm font-medium text-white hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-olive-500 dark:hover:bg-olive-600"
          >
            Extract tasks
          </button>
          <button
            type="button"
            onClick={resetRecording}
            className="rounded-md border border-olive-300 px-3 py-2 text-sm font-medium text-olive-700 hover:bg-olive-50 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 dark:border-olive-600 dark:text-olive-300 dark:hover:bg-olive-800"
          >
            Discard
          </button>
        </div>
      )}

      {/* Extraction Review */}
      {showExtraction && (
        <div className="mb-8 space-y-3">
          <ExtractedTasksReview
            tasks={extractedTasks}
            loading={extracting}
            saving={savingExtracted}
            error={extractionError}
            onConfirm={handleConfirmExtracted}
            onCancel={handleCancelExtraction}
            {...(extractionSource === "audio" && {
              loadingMessage: "Transcribing and extracting tasks...",
              emptyMessage: "No tasks found in the audio. Try recording a clearer voice memo listing your tasks.",
            })}
          />
          {transcription && !extracting && (
            <details className="rounded-lg border border-olive-200 bg-white p-4 shadow-sm dark:border-olive-800 dark:bg-olive-900">
              <summary className="cursor-pointer text-sm font-medium text-olive-700 dark:text-olive-300">
                View transcription
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-sm text-olive-600 dark:text-olive-400">
                {transcription}
              </p>
            </details>
          )}
        </div>
      )}

      {/* Task List */}
      <div className="mb-8 rounded-lg border border-olive-200 bg-white p-6 shadow-sm dark:border-olive-800 dark:bg-olive-900">
        <h2 className="mb-4 text-xl font-display font-semibold text-olive-900 dark:text-olive-50">
          Your tasks ({tasks.length})
        </h2>

        {loadingTasks ? (
          <div className="flex justify-center py-8">
            <svg
              className="h-6 w-6 animate-spin text-olive-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-olive-500 dark:text-olive-400">
            No tasks yet. Add your first task above.
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between rounded-md border border-olive-200 bg-olive-50 p-4 dark:border-olive-700 dark:bg-olive-800"
              >
                <div className="flex flex-1 items-start gap-3">
                  {task.photo_url && (
                    <button
                      onClick={() => setModalPhotoUrl(task.photo_url)}
                      className="flex-shrink-0 overflow-hidden rounded border border-olive-200 dark:border-olive-600"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={task.photo_url}
                        alt="Task photo"
                        loading="lazy"
                        className="h-10 w-10 object-cover"
                      />
                    </button>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-olive-900 dark:text-olive-50">
                      {task.title}
                    </h3>
                    {task.notes && !task.notes.match(/^\[preferred:[^\]]+\]$/) && (
                      <p className="mt-1 text-sm text-olive-600 dark:text-olive-400">
                        {task.notes.replace(/\[preferred:[^\]]+\]\s*/g, '')}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-olive-500 dark:text-olive-500">
                      {task.duration_minutes} minutes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDeletingTaskId(task.id)}
                  className="ml-4 text-olive-400 hover:text-red-600 dark:text-olive-500 dark:hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calendar Connections */}
      <div className="mb-8 rounded-lg border border-olive-200 bg-white p-4 shadow-sm dark:border-olive-800 dark:bg-olive-900">
        <h3 className="mb-3 text-sm font-semibold text-olive-900 dark:text-olive-50">
          Calendar connections
        </h3>
        <div className="space-y-3">
          {/* Google */}
          <div className="flex items-center justify-between">
            {googleConnected === null ? (
              <span className="text-sm text-olive-500 dark:text-olive-400">Checking Google...</span>
            ) : googleConnected ? (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Google Calendar</span>
              </div>
            ) : (
              <a
                href="/api/auth/google"
                className="inline-flex items-center gap-2 rounded-md border border-olive-300 px-3 py-1.5 text-sm font-medium text-olive-700 hover:bg-olive-50 dark:border-olive-600 dark:text-olive-300 dark:hover:bg-olive-800"
              >
                Connect Google Calendar
              </a>
            )}
          </div>
          {/* Outlook */}
          <div className="flex items-center justify-between">
            {outlookConnected === null ? (
              <span className="text-sm text-olive-500 dark:text-olive-400">Checking Outlook...</span>
            ) : outlookConnected ? (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Outlook Calendar</span>
              </div>
            ) : (
              <a
                href="/api/auth/microsoft"
                className="inline-flex items-center gap-2 rounded-md border border-olive-300 px-3 py-1.5 text-sm font-medium text-olive-700 hover:bg-olive-50 dark:border-olive-600 dark:text-olive-300 dark:hover:bg-olive-800"
              >
                Connect Outlook Calendar
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Error Banner */}
      {scheduleError && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
          <p className="flex-1 text-sm text-red-700 dark:text-red-300">{scheduleError}</p>
          <button
            onClick={() => setScheduleError(null)}
            className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300"
            aria-label="Dismiss error"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Build My Day Button */}
      {tasks.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => buildMyDay()}
            disabled={buildingSchedule}
            className="inline-flex items-center gap-2 rounded-lg bg-olive-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-olive-500 dark:hover:bg-olive-600"
          >
            <SparklesIcon className="h-6 w-6" />
            {buildingSchedule ? 'Building your day...' : 'Build my day'}
          </button>
        </div>
      )}

      {/* Agent Progress */}
      {buildingSchedule && (
        <div className="mt-4 rounded-lg border border-olive-200 bg-white p-4 shadow-sm dark:border-olive-800 dark:bg-olive-900">
          <div className="space-y-2">
            {agentThinking && (
              <div className="flex items-center gap-2 text-sm text-olive-500 dark:text-olive-400">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Thinking...
              </div>
            )}
            {agentSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {step.type === "tool" ? (
                  <>
                    <svg className="h-4 w-4 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-olive-700 dark:text-olive-300">{step.content}</span>
                  </>
                ) : (
                  <span className="text-olive-500 dark:text-olive-400">{step.content}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Empty State */}
      {tasks.length > 0 && schedule.length === 0 && !buildingSchedule && (
        <p className="mt-4 text-center text-sm text-olive-500 dark:text-olive-400">
          Click &ldquo;Build my day&rdquo; to generate your schedule.
        </p>
      )}

      {/* Timeline View */}
      {schedule.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-olive-900 dark:text-olive-50">
              Your schedule for today
            </h2>
            <button
              onClick={() => buildMyDay(true)}
              disabled={buildingSchedule}
              className="inline-flex items-center gap-1.5 rounded-md border border-olive-300 px-3 py-1.5 text-sm font-medium text-olive-700 hover:bg-olive-50 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:opacity-50 dark:border-olive-600 dark:text-olive-300 dark:hover:bg-olive-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              {buildingSchedule ? "Rebuilding..." : "Try again"}
            </button>
          </div>
          <DailyTimeline
            scheduledBlocks={schedule.map((block) => {
              const task = tasks.find((t) => t.id === block.task_id);
              return {
                id: block.id,
                task_id: block.task_id,
                start_time: block.start_time,
                end_time: block.end_time,
                title: task?.title || "Unknown task",
              };
            })}
            busyWindows={busyWindows}
            onBlockMove={async (blockId, newStart, newEnd) => {
              // Optimistic update
              setSchedule((prev) =>
                prev.map((b) =>
                  b.id === blockId ? { ...b, start_time: newStart, end_time: newEnd } : b,
                ),
              );
              try {
                const res = await fetch(`/api/schedule/${blockId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ start_time: newStart, end_time: newEnd }),
                });
                if (!res.ok) {
                  // Revert on failure
                  fetchSchedule();
                }
              } catch {
                fetchSchedule();
              }
            }}
          />
        </div>
      )}

      {/* Overflow */}
      {overflow.length > 0 && (
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900">
          <p className="font-medium text-yellow-900 dark:text-yellow-100">
            Couldn&apos;t schedule today:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-yellow-700 dark:text-yellow-300">
            {overflow.map((taskId) => {
              const task = tasks.find((t) => t.id === taskId);
              return <li key={taskId}>{task?.title || 'Unknown task'}</li>;
            })}
          </ul>
        </div>
      )}

      {/* Photo Modal */}
      <PhotoModal
        photoUrl={modalPhotoUrl}
        onClose={() => setModalPhotoUrl(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deletingTaskId !== null}
        title="Delete task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeletingTaskId(null)}
      />

      {/* Chat toggle button */}
      <button
        onClick={() => setChatOpen(true)}
        className={`fixed bottom-6 right-6 z-[55] flex h-12 w-12 items-center justify-center rounded-full bg-olive-600 text-white shadow-lg hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 dark:bg-olive-500 dark:hover:bg-olive-600 ${chatOpen ? 'hidden' : ''}`}
        aria-label="Open chat"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </button>

      {/* Chat panel */}
      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onScheduleChange={() => {
          fetchSchedule();
          fetchTasks();
        }}
      />
    </>
  );

  function toolDisplayName(name: string): string {
    const names: Record<string, string> = {
      getTaskList: "Fetching your tasks",
      getCalendarEvents: "Checking your calendar",
      createScheduledBlocks: "Building your schedule",
      checkForConflicts: "Checking for conflicts",
      updateTask: "Updating task",
      createTask: "Creating task",
    };
    return names[name] || name;
  }

  async function buildMyDay(retry = false) {
    trackEvent("day_built", { retry });
    setBuildingSchedule(true);
    setScheduleError(null);
    setAgentSteps([]);
    setAgentThinking(true);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      // Try agent endpoint first
      const message = retry
        ? "Rebuild my schedule with a different arrangement"
        : "Build my day";

      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, timezone }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Agent endpoint failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6);
          try {
            const event = JSON.parse(json);
            if (event.type === "tool") {
              setAgentThinking(false);
              setAgentSteps((prev) => [
                ...prev,
                { type: "tool", content: toolDisplayName(event.name) },
              ]);
            } else if (event.type === "text") {
              setAgentThinking(false);
            } else if (event.type === "error") {
              throw new Error(event.content || "Agent error");
            }
          } catch (parseError) {
            if (parseError instanceof Error && parseError.message !== "Agent error") {
              continue;
            }
            throw parseError;
          }
        }
      }

      // Agent done — refresh schedule from DB
      setAgentThinking(false);
      await fetchSchedule();
      await fetchTasks();

      // Schedule notifications
      const scheduleRes = await fetch(`/api/schedule?timezone=${encodeURIComponent(timezone)}`);
      const scheduleData = await scheduleRes.json();
      if (scheduleRes.ok && scheduleData.scheduled_blocks?.length > 0) {
        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
          scheduleNotifications(scheduleData.scheduled_blocks);
        }
      }
    } catch (agentError) {
      // Fallback to single-shot scheduling
      logger.warn("Agent failed, falling back to single-shot", { error: agentError });
      setAgentSteps((prev) => [
        ...prev,
        { type: "text", content: "Switching to quick schedule..." },
      ]);
      setAgentThinking(false);

      try {
        const res = await fetch("/api/schedule/build", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timezone,
            currentTime: new Date().toISOString(),
            retry,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          setScheduleError(data.error || "Failed to build schedule");
          return;
        }

        setSchedule(data.scheduled_blocks);
        setOverflow(data.overflow);
        setBusyWindows(data.busy_windows || []);
        fetchSchedule();

        const hasPermission = await requestNotificationPermission();
        if (hasPermission && data.scheduled_blocks.length > 0) {
          const blocksWithTitles = data.scheduled_blocks.map(
            (block: ScheduledBlock) => {
              const task = tasks.find((t) => t.id === block.task_id);
              return { ...block, title: task?.title || "Unknown task" };
            },
          );
          scheduleNotifications(blocksWithTitles);
        }
      } catch (fallbackError) {
        logger.error("Fallback schedule also failed", { error: fallbackError });
        setScheduleError("Something went wrong. Please try again.");
      }
    } finally {
      setBuildingSchedule(false);
      setAgentThinking(false);
    }
  }
}
