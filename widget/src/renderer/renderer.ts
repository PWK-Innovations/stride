import { createLogger } from "./logger";
import { initAnalytics, trackEvent } from "./analytics";
import { buildCompressedLayout } from "./components/compressed-view";
import { buildFullHeader } from "./components/full-header";
import { buildTaskBar } from "./components/task-bar";
import { buildChatMessages, scrollToBottom } from "./components/chat-messages";
import { buildSuggestionChips } from "./components/suggestion-chips";
import { buildChatInput, buildRecordingInput } from "./components/chat-input";
import { buildLoginView } from "./components/login-view";
import { renderQuickActions, setRefreshCallback, setScheduleBlocks, isNextTaskPromptVisible } from "./components/quick-actions";
import {
  buildDailySchedule,
  scrollScheduleToNow,
  startScheduleTimeUpdater,
  stopScheduleTimeUpdater,
  wireScheduleDragHandlers,
  setBlockMoveCallback,
} from "./components/daily-schedule";
import { ChatController } from "./chat-controller";

const logger = createLogger("Renderer");

const POLL_INTERVAL_MS = 15_000;
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

let pollTimer: ReturnType<typeof setInterval> | null = null;
let currentMode: WidgetMode = "full";
let currentBlock: ScheduledBlock | null = null;
let currentCalendarEvent: BusyWindow | null = null;
let chatController: ChatController;
let isChatOpen = false;

// Audio recording state
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let recordingDuration = 0;
let recordingTimer: ReturnType<typeof setInterval> | null = null;
let isRecording = false;

// Cached schedule data for the daily schedule view
let cachedBlocks: ScheduledBlock[] = [];
let cachedBusyWindows: BusyWindow[] = [];

function findCurrentBlock(blocks: ScheduledBlock[]): ScheduledBlock | null {
  const now = new Date();
  return (
    blocks.find((b) => {
      const start = new Date(b.start_time);
      const end = new Date(b.end_time);
      return now >= start && now < end;
    }) ?? null
  );
}

function findCurrentCalendarEvent(events: BusyWindow[]): BusyWindow | null {
  const now = new Date();
  return (
    events.find((e) => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      return now >= start && now < end;
    }) ?? null
  );
}

function getTaskData(
  block: ScheduledBlock | null
): { title: string; endTime: string } | null {
  // Stride task takes priority over calendar event
  if (block) return { title: block.title, endTime: block.end_time };
  if (currentCalendarEvent) {
    return {
      title: currentCalendarEvent.title || "Calendar event",
      endTime: currentCalendarEvent.end,
    };
  }
  return null;
}

function isAuthenticated(): boolean {
  try {
    return window.strideApi.isAuthenticated();
  } catch {
    return false;
  }
}

function renderLoginScreen(errorMessage?: string): void {
  const app = document.body;
  app.innerHTML = `
    <div class="full-container">
      ${buildLoginView(errorMessage)}
    </div>
  `;

  const form = document.getElementById("login-form") as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const emailInput = document.getElementById("login-email") as HTMLInputElement;
    const passwordInput = document.getElementById("login-password") as HTMLInputElement;
    const submitBtn = document.getElementById("login-submit") as HTMLButtonElement;

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    const result = await window.strideApi.login(email, password);

    if (result.success) {
      logger.info("Login successful, initializing widget");
      await fetchScheduleData();
      renderCurrentMode();
      startPolling();
    } else {
      logger.warn("Login failed", { error: result.error });
      renderLoginScreen(result.error);
    }
  });
}

function renderCompressedMode(): void {
  const app = document.body;
  const taskData = getTaskData(currentBlock);

  app.innerHTML = buildCompressedLayout(taskData);

  const expandBtn = document.getElementById("expand-btn");
  if (expandBtn) {
    expandBtn.addEventListener("click", () => {
      logger.info("Expand button clicked");
      if (window.strideWidget) {
        window.strideWidget.setMode("full");
      }
    });
  }

  stopScheduleTimeUpdater();
  logger.debug("Rendered compressed mode", { hasTask: !!currentBlock });
}

function openChatOverlay(): void {
  if (isChatOpen) return;
  isChatOpen = true;
  trackEvent("widget_chat_overlay_opened");
  logger.debug("Chat overlay opened");

  const scheduleEl = document.getElementById("daily-schedule");
  const overlayEl = document.getElementById("chat-overlay");

  if (scheduleEl) scheduleEl.classList.add("schedule-hidden");
  if (overlayEl) {
    overlayEl.classList.add("chat-overlay-visible");
    renderChatOverlayContent();
  }
}

function closeChatOverlay(): void {
  if (!isChatOpen) return;
  isChatOpen = false;
  trackEvent("widget_chat_overlay_closed");
  logger.debug("Chat overlay closed");

  const scheduleEl = document.getElementById("daily-schedule");
  const overlayEl = document.getElementById("chat-overlay");

  if (scheduleEl) scheduleEl.classList.remove("schedule-hidden");
  if (overlayEl) overlayEl.classList.remove("chat-overlay-visible");
}

function renderChatOverlayContent(): void {
  const overlayEl = document.getElementById("chat-overlay");
  if (!overlayEl) return;

  const messages = chatController.getMessages();
  const hasMessages = messages.length > 1;
  const chipsHtml = hasMessages ? "" : buildSuggestionChips();

  overlayEl.innerHTML = `
    <div class="chat-overlay-header">
      <button class="chat-overlay-close" id="chat-overlay-close" title="Close chat">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    ${buildChatMessages(messages)}
    ${chipsHtml}
  `;

  requestAnimationFrame(() => {
    scrollToBottom();
    wireOverlayChipListeners();
  });

  const closeBtn = document.getElementById("chat-overlay-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeChatOverlay());
  }
}

function wireOverlayChipListeners(): void {
  const overlay = document.getElementById("chat-overlay");
  if (!overlay) return;

  const chips = Array.from(overlay.querySelectorAll<HTMLElement>("[data-chip-text]"));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const text = chip.getAttribute("data-chip-text");
      if (text) {
        logger.debug("Overlay chip clicked", { text });
        chatController.addUserMessage(text);
      }
    });
  });
}

function renderChatArea(): void {
  // When chat overlay is open, update the overlay content
  if (isChatOpen) {
    renderChatOverlayContent();
    return;
  }
}

function stopRecording(): void {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }
  isRecording = false;
}

function showRecordingUI(): void {
  const inputContainer = document.querySelector(".chat-input-container");
  if (!inputContainer) return;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = buildRecordingInput(recordingDuration);
  const newContainer = tempDiv.firstElementChild as HTMLElement;
  if (newContainer) {
    inputContainer.replaceWith(newContainer);
    const stopBtn = document.getElementById("chat-mic-stop");
    if (stopBtn) {
      stopBtn.addEventListener("click", () => stopRecording());
    }
  }
}

function updateRecordingDuration(): void {
  const durationEl = document.querySelector(".recording-duration");
  if (!durationEl) return;
  const mins = Math.floor(recordingDuration / 60);
  const secs = recordingDuration % 60;
  durationEl.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
}

function restoreChatInput(): void {
  const inputContainer = document.querySelector(".chat-input-container");
  if (!inputContainer) return;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = buildChatInput();
  const newContainer = tempDiv.firstElementChild as HTMLElement;
  if (newContainer) {
    inputContainer.replaceWith(newContainer);
    wireChatInputListeners();
  }
}

async function startRecording(): Promise<void> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/mp4";

    audioChunks = [];
    recordingDuration = 0;
    isRecording = true;

    mediaRecorder = new MediaRecorder(stream, { mimeType });

    mediaRecorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());

      const audioBlob = new Blob(audioChunks, { type: mimeType });
      audioChunks = [];

      restoreChatInput();

      if (audioBlob.size < 1000) {
        logger.warn("Audio too short, ignoring");
        return;
      }

      trackEvent("widget_voice_chat_sent", { duration_seconds: recordingDuration });
      openChatOverlay();
      const arrayBuffer = await audioBlob.arrayBuffer();
      await chatController.addAudioMessage(arrayBuffer, mimeType);
    };

    mediaRecorder.start();

    trackEvent("widget_voice_chat_started");
    showRecordingUI();

    recordingTimer = setInterval(() => {
      recordingDuration++;
      updateRecordingDuration();
    }, 1000);

    logger.info("Recording started", { mimeType });
  } catch (err) {
    logger.error("Failed to start recording", err);
    trackEvent("widget_voice_chat_error");
    isRecording = false;
  }
}

function wireChatInputListeners(): void {
  const input = document.getElementById("chat-input") as HTMLInputElement | null;
  const sendBtn = document.getElementById("chat-send");

  if (!input || !sendBtn) return;

  function submitMessage(): void {
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    openChatOverlay();
    chatController.addUserMessage(text);
  }

  const micBtn = document.getElementById("chat-mic");
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      if (!isRecording) {
        startRecording();
      }
    });
  }

  sendBtn.addEventListener("click", submitMessage);

  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  });

  // Open chat overlay when input is focused
  input.addEventListener("focus", () => {
    openChatOverlay();
  });
}

function renderFullMode(): void {
  const app = document.body;
  const taskData = getTaskData(currentBlock);

  app.innerHTML = `
    <div class="full-container">
      ${buildFullHeader()}
      ${buildTaskBar(taskData)}
      <div id="quick-actions-container"></div>
      ${buildDailySchedule(cachedBlocks, cachedBusyWindows)}
      <div class="chat-overlay" id="chat-overlay"></div>
      <div id="chip-bar" class="chip-bar"></div>
      ${buildChatInput()}
    </div>
  `;

  // Render quick actions for active Stride task (not calendar events)
  const actionsContainer = document.getElementById("quick-actions-container");
  if (actionsContainer) {
    renderQuickActions(currentBlock, actionsContainer);
  }

  wireChatInputListeners();

  // Auto-scroll schedule to current time and wire drag handlers
  requestAnimationFrame(() => {
    scrollScheduleToNow();
    wireScheduleDragHandlers();
  });
  startScheduleTimeUpdater();

  // If chat was open before re-render, keep it open
  if (isChatOpen) {
    const scheduleEl = document.getElementById("daily-schedule");
    const overlayEl = document.getElementById("chat-overlay");
    if (scheduleEl) scheduleEl.classList.add("schedule-hidden");
    if (overlayEl) {
      overlayEl.classList.add("chat-overlay-visible");
      renderChatOverlayContent();
    }
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logger.info("Logout button clicked");
      window.strideApi.logout();
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      stopScheduleTimeUpdater();
      renderLoginScreen();
    });
  }

  const compressBtn = document.getElementById("compress-btn");
  if (compressBtn) {
    compressBtn.addEventListener("click", () => {
      logger.info("Compress button clicked");
      if (window.strideWidget) {
        window.strideWidget.setMode("compressed");
      }
    });
  }

  const closeBtn = document.getElementById("close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      logger.info("Close button clicked");
      window.close();
    });
  }

  logger.debug("Rendered full mode", { hasTask: !!currentBlock });
}

function renderCurrentMode(): void {
  if (currentMode === "compressed") {
    renderCompressedMode();
  } else {
    renderFullMode();
  }
}

async function fetchScheduleData(): Promise<void> {
  try {
    logger.debug("Fetching schedule", { timezone: TIMEZONE });
    const data = await window.strideApi.getSchedule(TIMEZONE);
    const blocks = data.scheduled_blocks || [];
    const busyWindows = data.busy_windows || [];

    const sortedBlocks = [...blocks].sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    currentBlock = findCurrentBlock(sortedBlocks);
    currentCalendarEvent = findCurrentCalendarEvent(busyWindows);

    // Cache for schedule view and quick actions
    cachedBlocks = sortedBlocks;
    cachedBusyWindows = busyWindows;
    setScheduleBlocks(sortedBlocks);

    logger.info("Schedule data refreshed", {
      totalBlocks: sortedBlocks.length,
      calendarEvents: busyWindows.length,
      currentTask: currentBlock?.title ?? currentCalendarEvent?.title ?? null,
    });
  } catch (err) {
    logger.error("Failed to fetch schedule", err);
  }
}

function updateTaskBar(): void {
  const taskBarEl = document.querySelector(".task-bar");
  if (!taskBarEl) return;

  const taskData = getTaskData(currentBlock);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = buildTaskBar(taskData);
  const newTaskBar = tempDiv.firstElementChild;
  if (newTaskBar) {
    taskBarEl.replaceWith(newTaskBar);
  }

  // Skip quick actions update if the "start next task?" prompt is showing
  const actionsContainer = document.getElementById("quick-actions-container");
  if (actionsContainer && !isNextTaskPromptVisible()) {
    renderQuickActions(currentBlock, actionsContainer);
  }

  // Update schedule view
  const scheduleContainer = document.getElementById("daily-schedule");
  if (scheduleContainer) {
    const wasHidden = scheduleContainer.classList.contains("schedule-hidden");
    const tempSchedule = document.createElement("div");
    tempSchedule.innerHTML = buildDailySchedule(cachedBlocks, cachedBusyWindows);
    const newSchedule = tempSchedule.firstElementChild as HTMLElement | null;
    if (newSchedule) {
      if (wasHidden) newSchedule.classList.add("schedule-hidden");
      scheduleContainer.replaceWith(newSchedule);
      if (!wasHidden) {
        requestAnimationFrame(() => {
          scrollScheduleToNow();
          wireScheduleDragHandlers();
        });
      }
    }
  }
}

async function fetchAndRender(): Promise<void> {
  await fetchScheduleData();

  // Only update the task bar, don't rebuild the entire UI
  if (currentMode === "full") {
    updateTaskBar();
  } else {
    renderCompressedMode();
  }
}

function startPolling(): void {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(fetchAndRender, POLL_INTERVAL_MS);
  logger.info("Polling started", { intervalMs: POLL_INTERVAL_MS });
}

async function init(): Promise<void> {
  logger.info("Initializing Stride widget renderer");

  initAnalytics();

  if (!window.strideApi) {
    logger.error("strideApi not available - preload bridge missing");
    document.body.innerHTML =
      '<div style="padding:20px;color:#b04040;font-family:sans-serif;">Stride API bridge not found. Ensure the widget is launched via Electron.</div>';
    return;
  }

  setRefreshCallback(fetchAndRender);

  setBlockMoveCallback(async (blockId, newStart, newEnd) => {
    try {
      logger.info("Block moved via drag", { blockId, newStart });
      const result = await window.strideApi.updateBlock(blockId, {
        start_time: newStart,
        end_time: newEnd,
        cascade: true,
      });
      if (result.success) {
        await fetchAndRender();
      } else {
        logger.error("Failed to move block", { blockId });
        await fetchAndRender();
      }
    } catch (err) {
      logger.error("Error moving block", err);
      await fetchAndRender();
    }
  });

  chatController = new ChatController();
  chatController.onUpdate(() => {
    if (currentMode === "full") {
      renderChatArea();
    }
  });

  chatController.onStreamComplete(() => {
    logger.debug("Chat stream complete, refreshing schedule");
    fetchAndRender();
  });

  chatController.initStreamListeners();
  chatController.seedWelcome();

  if (window.strideWidget) {
    try {
      currentMode = await window.strideWidget.getMode();
    } catch {
      logger.warn("Could not get initial mode, defaulting to full");
      currentMode = "full";
    }

    window.strideWidget.onModeChanged((mode: WidgetMode) => {
      logger.info("Mode changed", { from: currentMode, to: mode });
      currentMode = mode;
      if (isAuthenticated()) {
        renderCurrentMode();
      }
    });
  } else {
    logger.warn("strideWidget bridge not available, defaulting to full mode");
    currentMode = "full";
  }

  if (!isAuthenticated()) {
    logger.info("No session found, showing login screen");
    if (window.strideWidget) {
      await window.strideWidget.setMode("full");
    }
    renderLoginScreen();
    return;
  }

  await fetchScheduleData();
  renderCurrentMode();
  startPolling();

  logger.info("Widget renderer initialized", { mode: currentMode });
}

document.addEventListener("DOMContentLoaded", init);
