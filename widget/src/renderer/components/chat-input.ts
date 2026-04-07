import { createLogger } from "../logger";

const logger = createLogger("ChatInput");

export function buildChatInput(): string {
  logger.debug("Built chat input");

  return `
    <div class="chat-input-container">
      <div class="chat-input-row">
        <button id="chat-mic" class="chat-mic-btn" title="Voice input">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="5.5" y="1" width="5" height="9" rx="2.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M3 7.5a5 5 0 0010 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M8 13.5v1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </button>
        <input
          type="text"
          id="chat-input"
          class="chat-input-field"
          placeholder="Ask Stride anything..."
          autocomplete="off"
        />
        <button id="chat-send" class="chat-send-btn" title="Send">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

export function buildRecordingInput(durationSeconds: number): string {
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;
  const display = `${mins}:${secs.toString().padStart(2, "0")}`;

  return `
    <div class="chat-input-container">
      <div class="chat-input-row chat-recording-row">
        <span class="recording-dot"></span>
        <span class="recording-duration">${display}</span>
        <button id="chat-mic-stop" class="chat-mic-stop-btn" title="Stop recording">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="2" width="10" height="10" rx="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}
