import { createLogger } from "./logger";
import { buildCompressedLayout } from "./components/compressed-view";
import { buildFullHeader } from "./components/full-header";
import { buildTaskBar } from "./components/task-bar";
import { buildChatMessages, scrollToBottom } from "./components/chat-messages";
import { buildSuggestionChips } from "./components/suggestion-chips";
import { buildChatInput } from "./components/chat-input";
import { buildLoginView } from "./components/login-view";
import { ChatController } from "./chat-controller";

const logger = createLogger("Renderer");

const POLL_INTERVAL_MS = 15_000;
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

let pollTimer: ReturnType<typeof setInterval> | null = null;
let currentMode: WidgetMode = "full";
let currentBlock: ScheduledBlock | null = null;
let chatController: ChatController;

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

function getTaskData(
  block: ScheduledBlock | null
): { title: string; endTime: string } | null {
  if (!block) return null;
  return { title: block.title, endTime: block.end_time };
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

  logger.debug("Rendered compressed mode", { hasTask: !!currentBlock });
}

function renderChatArea(): void {
  const chatArea = document.getElementById("chat-area-wrapper");
  if (!chatArea) return;

  const messages = chatController.getMessages();
  const hasMessages = messages.length > 1;

  const chipsHtml = hasMessages ? "" : buildSuggestionChips();

  chatArea.innerHTML =
    buildChatMessages(messages) + chipsHtml;

  requestAnimationFrame(() => {
    scrollToBottom();
    wireChipListeners();
  });
}

function wireChipListeners(): void {
  const chips = Array.from(document.querySelectorAll<HTMLElement>("[data-chip-text]"));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const text = chip.getAttribute("data-chip-text");
      if (text) {
        logger.debug("Chip clicked", { text });
        chatController.addUserMessage(text);
      }
    });
  });
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
    chatController.addUserMessage(text);
  }

  sendBtn.addEventListener("click", submitMessage);

  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  });
}

function renderFullMode(): void {
  const app = document.body;
  const taskData = getTaskData(currentBlock);

  app.innerHTML = `
    <div class="full-container">
      ${buildFullHeader()}
      ${buildTaskBar(taskData)}
      <div id="chat-area-wrapper" class="chat-area-wrapper"></div>
      ${buildChatInput()}
    </div>
  `;

  renderChatArea();
  wireChatInputListeners();

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
    const { scheduled_blocks: blocks } =
      await window.strideApi.getSchedule(TIMEZONE);

    const sortedBlocks = [...blocks].sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    currentBlock = findCurrentBlock(sortedBlocks);

    logger.info("Schedule data refreshed", {
      totalBlocks: sortedBlocks.length,
      currentTask: currentBlock?.title ?? null,
    });
  } catch (err) {
    logger.error("Failed to fetch schedule", err);
  }
}

async function fetchAndRender(): Promise<void> {
  await fetchScheduleData();
  renderCurrentMode();
}

function startPolling(): void {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(fetchAndRender, POLL_INTERVAL_MS);
  logger.info("Polling started", { intervalMs: POLL_INTERVAL_MS });
}

async function init(): Promise<void> {
  logger.info("Initializing Stride widget renderer");

  if (!window.strideApi) {
    logger.error("strideApi not available - preload bridge missing");
    document.body.innerHTML =
      '<div style="padding:20px;color:#b04040;font-family:sans-serif;">Stride API bridge not found. Ensure the widget is launched via Electron.</div>';
    return;
  }

  chatController = new ChatController();
  chatController.onUpdate(() => {
    if (currentMode === "full") {
      renderChatArea();
    }
  });

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
