import { createLogger } from "../logger";

const logger = createLogger("FullHeader");

export function buildFullHeader(): string {
  logger.debug("Built full header");

  return `
    <div class="full-header">
      <span class="full-header-brand">Stride</span>
      <div class="full-header-actions">
        <button class="full-header-btn" id="compress-btn" title="Minimize">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 8h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="full-header-btn" id="close-btn" title="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}
