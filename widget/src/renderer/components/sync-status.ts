import type { SyncState } from "../../sync";
import { createLogger } from "../logger";

const logger = createLogger("sync-status");

function getTimeSinceSync(lastSynced: Date | null): string {
  if (!lastSynced) return "Never";

  const diffMs = Date.now() - lastSynced.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 10) return "Just now";
  if (diffSec < 60) return diffSec + "s ago";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return diffMin + " min ago";

  const diffHr = Math.floor(diffMin / 60);
  return diffHr + "h ago";
}

function createStyles(): HTMLStyleElement {
  const style = document.createElement("style");
  style.textContent = `
    .sync-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-family: "Inter", system-ui, sans-serif;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
      background: #fafaf9;
      min-height: 24px;
    }

    .sync-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .sync-dot--online {
      background-color: #6b8f5e;
    }

    .sync-dot--offline {
      background-color: #dc2626;
    }

    .sync-dot--syncing {
      background-color: #6b8f5e;
      animation: sync-pulse 1.2s ease-in-out infinite;
    }

    @keyframes sync-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .sync-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
  return style;
}

export function renderSyncStatus(state: SyncState, container: HTMLElement): void {
  const isFirstRender = container.children.length === 0;

  if (isFirstRender) {
    container.appendChild(createStyles());
    const wrapper = document.createElement("div");
    wrapper.className = "sync-status";
    wrapper.innerHTML = '<span class="sync-dot"></span><span class="sync-label"></span>';
    container.appendChild(wrapper);
    logger.debug("Sync status component mounted");
  }

  const dot = container.querySelector(".sync-dot") as HTMLElement | null;
  const label = container.querySelector(".sync-label") as HTMLElement | null;

  if (!dot || !label) return;

  dot.className = "sync-dot";

  if (state.isSyncing) {
    dot.classList.add("sync-dot--syncing");
    label.textContent = "Syncing\u2026";
  } else if (!state.isOnline) {
    dot.classList.add("sync-dot--offline");
    label.textContent = "Offline \u2014 showing last data";
  } else {
    dot.classList.add("sync-dot--online");
    label.textContent = "Last synced: " + getTimeSinceSync(state.lastSynced);
  }
}
