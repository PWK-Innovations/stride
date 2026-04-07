type WidgetMode = "compressed" | "full";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
  toolStatus?: string;
}

interface ScheduledBlock {
  id: string;
  user_id: string;
  task_id: string | null;
  start_time: string;
  end_time: string;
  title: string;
  source: "ai" | "calendar";
  created_at: string;
}

interface Task {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  duration_minutes: number;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

interface BusyWindow {
  start: string;
  end: string;
  title?: string;
}

interface StrideApi {
  getTasks(): Promise<{ tasks: Task[] }>;
  getSchedule(timezone: string): Promise<{ scheduled_blocks: ScheduledBlock[]; busy_windows?: BusyWindow[] }>;
  createTask(title: string, durationMinutes: number): Promise<{ task: Task }>;
  updateBlock(id: string, data: { start_time: string; end_time: string; cascade?: boolean }): Promise<{ success: boolean }>;
  deleteTask(id: string): Promise<{ success: boolean }>;
  deleteBlock(id: string): Promise<{ success: boolean }>;
  getToken(): string;
  setToken(token: string): void;
  clearToken(): void;
  login(email: string, password: string): Promise<{ success: boolean; error?: string }>;
  logout(): void;
  refreshSession(): Promise<boolean>;
  showNotification(title: string, body: string): void;
  isAuthenticated(): boolean;
}

interface StrideWidget {
  getMode(): Promise<WidgetMode>;
  setMode(mode: WidgetMode): Promise<void>;
  onModeChanged(callback: (mode: WidgetMode) => void): void;
}

interface StrideChat {
  sendMessage(message: string): Promise<string>;
  sendAudio(audioData: ArrayBuffer, mimeType: string): Promise<string>;
  onResponse(callback: (response: string) => void): void;
  onStreamChunk(callback: (chunk: string) => void): void;
  onStreamTool(callback: (toolName: string) => void): void;
  onStreamDone(callback: () => void): void;
  onStreamError(callback: (error: string) => void): void;
  onStreamTranscription(callback: (text: string) => void): void;
}

interface StrideConfig {
  posthogKey: string;
}

interface Window {
  strideApi: StrideApi;
  strideWidget: StrideWidget;
  strideChat: StrideChat;
  strideConfig: StrideConfig;
}
