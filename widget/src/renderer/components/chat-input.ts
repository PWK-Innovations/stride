import { createLogger } from "../logger";

const logger = createLogger("ChatInput");

export function buildChatInput(): string {
  logger.debug("Built chat input");

  return `
    <div class="chat-input-container">
      <div class="chat-input-row">
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
