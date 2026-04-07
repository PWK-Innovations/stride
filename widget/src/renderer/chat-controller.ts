import { createLogger } from "./logger";

const logger = createLogger("ChatController");

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const DEFAULT_DURATION_MINUTES = 30;

type UpdateCallback = () => void;
type StreamCompleteCallback = () => void;

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  getTaskList: "Fetching your tasks",
  getScheduledBlocks: "Checking your schedule",
  getCalendarEvents: "Checking your calendar",
  createScheduledBlocks: "Building your schedule",
  scheduleTask: "Scheduling task",
  moveBlock: "Moving task",
  checkForConflicts: "Checking for conflicts",
  updateTask: "Updating task",
  createTask: "Creating task",
};

export class ChatController {
  private messages: ChatMessage[] = [];
  private listeners: UpdateCallback[] = [];
  private streamCompleteListeners: StreamCompleteCallback[] = [];
  private streamListenersInitialized = false;
  private activeToolStatus: string | null = null;

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  getWelcomeMessage(): ChatMessage {
    return {
      role: "assistant",
      content:
        "Hi! I'm Stride. I can help manage your schedule. Try asking \"what's next\" or \"add [task name]\".",
    };
  }

  seedWelcome(): void {
    if (this.messages.length === 0) {
      this.messages.push(this.getWelcomeMessage());
      this.notify();
    }
  }

  onUpdate(callback: UpdateCallback): void {
    this.listeners.push(callback);
  }

  onStreamComplete(callback: StreamCompleteCallback): void {
    this.streamCompleteListeners.push(callback);
  }

  private notifyStreamComplete(): void {
    for (const listener of this.streamCompleteListeners) {
      listener();
    }
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  initStreamListeners(): void {
    if (this.streamListenersInitialized) return;
    this.streamListenersInitialized = true;

    if (!window.strideChat) {
      logger.warn("strideChat bridge not available, stream listeners not initialized");
      return;
    }

    window.strideChat.onStreamTool((toolName: string) => {
      this.activeToolStatus = TOOL_DISPLAY_NAMES[toolName] || toolName;
      const typingMsg = this.messages.find((m) => m.typing);
      if (typingMsg) {
        typingMsg.toolStatus = this.activeToolStatus;
        this.notify();
      }
    });

    window.strideChat.onStreamChunk((chunk: string) => {
      const typingMsg = this.messages.find((m) => m.typing);
      if (typingMsg) {
        // Clear tool status once text starts arriving
        if (typingMsg.toolStatus) {
          typingMsg.toolStatus = undefined;
        }
        typingMsg.content += chunk;
        this.notify();
      }
    });

    window.strideChat.onStreamDone(() => {
      const typingMsg = this.messages.find((m) => m.typing);
      if (typingMsg) {
        typingMsg.typing = false;
        typingMsg.toolStatus = undefined;
        this.activeToolStatus = null;
        this.notify();
      }
      this.notifyStreamComplete();
    });

    window.strideChat.onStreamError((error: string) => {
      logger.error("Stream error received", { error });
      this.replaceTypingWithResponse(`Error: ${error}`);
    });

    window.strideChat.onStreamTranscription((text: string) => {
      logger.info("Transcription received", { text });
      const transcriptionIndex = this.messages.findIndex(
        (m) => m.role === "user" && m.content === "🎙️ Recording..."
      );
      if (transcriptionIndex !== -1) {
        this.messages[transcriptionIndex].content = text;
        this.notify();
      }
    });

    logger.info("Stream listeners initialized");
  }

  async addUserMessage(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) return;

    this.messages.push({ role: "user", content: trimmed });
    this.notify();

    this.messages.push({ role: "assistant", content: "", typing: true });
    this.notify();

    try {
      if (window.strideChat) {
        await window.strideChat.sendMessage(trimmed);
        // Streaming events (onStreamChunk/onStreamDone) handle the message.
        // sendMessage resolves after the stream completes, nothing else to do.
      } else {
        logger.warn("strideChat not available, falling back to local commands");
        const response = await this.processCommandFallback(trimmed);
        this.replaceTypingWithResponse(response);
      }
    } catch (err) {
      logger.error("Agent message failed", err);
      this.replaceTypingWithResponse(
        "Something went wrong. Please try again."
      );
    }
  }

  async addAudioMessage(audioData: ArrayBuffer, mimeType: string): Promise<void> {
    this.messages.push({ role: "user", content: "🎙️ Recording..." });
    this.notify();

    this.messages.push({ role: "assistant", content: "", typing: true });
    this.notify();

    try {
      if (window.strideChat) {
        await window.strideChat.sendAudio(audioData, mimeType);
      } else {
        logger.warn("strideChat not available for audio");
        this.replaceTypingWithResponse(
          "Voice input is not available right now. Please type your message."
        );
      }
    } catch (err) {
      logger.error("Audio message failed", err);
      this.replaceTypingWithResponse(
        "Something went wrong with voice input. Please try again."
      );
    }
  }

  private replaceTypingWithResponse(content: string): void {
    const typingIndex = this.messages.findIndex((m) => m.typing);
    if (typingIndex !== -1) {
      this.messages[typingIndex] = { role: "assistant", content };
    } else {
      this.messages.push({ role: "assistant", content });
    }
    this.notify();
  }

  /**
   * Offline fallback: client-side command parsing used when the agent
   * endpoint is unreachable or the strideChat bridge is unavailable.
   */
  private async processCommandFallback(text: string): Promise<string> {
    const lower = text.toLowerCase().trim();

    if (lower.startsWith("add ")) {
      return this.handleAddTask(text.slice(4).trim());
    }

    if (lower === "what's next" || lower === "what's next?" || lower === "next task") {
      return this.handleNextTask();
    }

    if (
      lower === "schedule" ||
      lower === "what's my schedule" ||
      lower === "what's my schedule?" ||
      lower === "how's my day" ||
      lower === "how's my day?" ||
      lower === "show schedule"
    ) {
      return this.handleSchedule();
    }

    if (
      lower === "help" ||
      lower === "what can you do" ||
      lower === "what can you do?"
    ) {
      return this.handleHelp();
    }

    if (lower === "add a task") {
      return "What task would you like to add? Say \"add [task name]\" and I'll create it.";
    }

    logger.debug("Unrecognized command (fallback)", { text: lower });
    return "I'm still learning! Try \"add [task]\", \"what's next\", \"schedule\", or \"help\".";
  }

  private async handleAddTask(taskName: string): Promise<string> {
    if (!taskName) {
      return "What task would you like to add? Say \"add [task name]\".";
    }

    try {
      logger.info("Adding task via chat (fallback)", { title: taskName });
      const { task } = await window.strideApi.createTask(
        taskName,
        DEFAULT_DURATION_MINUTES
      );
      return `Added "${task.title}" (${DEFAULT_DURATION_MINUTES} min) to your tasks.`;
    } catch (err) {
      logger.error("Failed to add task", err);
      return `Sorry, I couldn't add "${taskName}". Please try again.`;
    }
  }

  private async handleNextTask(): Promise<string> {
    try {
      const { scheduled_blocks: blocks } =
        await window.strideApi.getSchedule(TIMEZONE);

      const now = new Date();
      const sorted = [...blocks].sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      const current = sorted.find((b) => {
        const start = new Date(b.start_time);
        const end = new Date(b.end_time);
        return now >= start && now < end;
      });

      const next = sorted.find((b) => {
        if (current && b.id === current.id) return false;
        return new Date(b.start_time) > now;
      });

      if (!next) {
        return current
          ? `You're working on "${current.title}" right now. Nothing else is scheduled after this.`
          : "Nothing scheduled. Enjoy your free time!";
      }

      const startTime = timeFormatter.format(new Date(next.start_time));
      return `Up next: "${next.title}" at ${startTime}.`;
    } catch (err) {
      logger.error("Failed to fetch next task", err);
      return "Sorry, I couldn't load your schedule. Please try again.";
    }
  }

  private async handleSchedule(): Promise<string> {
    try {
      const { scheduled_blocks: blocks } =
        await window.strideApi.getSchedule(TIMEZONE);

      const now = new Date();
      const upcoming = blocks
        .filter((b) => new Date(b.end_time) > now)
        .sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );

      if (upcoming.length === 0) {
        return "Your schedule is clear for the rest of the day!";
      }

      const lines = upcoming.map((b) => {
        const time = timeFormatter.format(new Date(b.start_time));
        const isCurrent =
          new Date(b.start_time) <= now && new Date(b.end_time) > now;
        const marker = isCurrent ? " (now)" : "";
        return `${time} - ${b.title}${marker}`;
      });

      return `Here's your schedule:\n${lines.join("\n")}`;
    } catch (err) {
      logger.error("Failed to fetch schedule", err);
      return "Sorry, I couldn't load your schedule. Please try again.";
    }
  }

  private handleHelp(): string {
    return [
      "Here's what I can do:",
      "",
      '"add [task]" - Create a new task',
      '"what\'s next" - See your next scheduled task',
      '"schedule" / "how\'s my day" - View your full schedule',
      '"help" - Show this message',
    ].join("\n");
  }
}
