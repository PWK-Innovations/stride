import { createLogger } from "./logger";
import { StrideApiClient } from "./api";
import type { ScheduledBlock, Task } from "./types";

const logger = createLogger("sync");

export interface SyncState {
  tasks: Task[];
  blocks: ScheduledBlock[];
  lastSynced: Date | null;
  isOnline: boolean;
  isSyncing: boolean;
}

export class SyncManager {
  private client: StrideApiClient;
  private state: SyncState;
  private pollInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(state: SyncState) => void> = [];
  private intervalMs: number;

  constructor(client: StrideApiClient, intervalMs = 15000) {
    this.client = client;
    this.intervalMs = intervalMs;
    this.state = {
      tasks: [],
      blocks: [],
      lastSynced: null,
      isOnline: true,
      isSyncing: false,
    };
  }

  onUpdate(listener: (state: SyncState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  async refresh(): Promise<void> {
    if (this.state.isSyncing) return;

    this.state.isSyncing = true;
    this.notify();

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const [tasksRes, scheduleRes] = await Promise.all([
        this.client.getTasks(),
        this.client.getSchedule(timezone),
      ]);

      this.state.tasks = tasksRes.tasks;
      this.state.blocks = scheduleRes.scheduled_blocks;
      this.state.lastSynced = new Date();
      this.state.isOnline = true;

      logger.info("Sync complete", {
        tasks: this.state.tasks.length,
        blocks: this.state.blocks.length,
      });
    } catch (error) {
      this.state.isOnline = false;
      logger.error("Sync failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      this.state.isSyncing = false;
      this.notify();
    }
  }

  start(): void {
    logger.info("Starting sync", { intervalMs: this.intervalMs });
    this.refresh();
    this.pollInterval = setInterval(() => this.refresh(), this.intervalMs);
  }

  stop(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      logger.info("Sync stopped");
    }
  }

  getState(): SyncState {
    return { ...this.state };
  }
}
