export interface Task {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  duration_minutes: number;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduledBlock {
  id: string;
  user_id: string;
  task_id: string | null;
  start_time: string;
  end_time: string;
  title: string;
  source: 'ai' | 'calendar';
  created_at: string;
}

export interface ApiError {
  error: string;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface BusyWindow {
  start: string;
  end: string;
  title?: string;
}

export interface ScheduleResponse {
  scheduled_blocks: ScheduledBlock[];
  busy_windows?: BusyWindow[];
}

export interface CreateTaskResponse {
  task: Task;
}

export interface SuccessResponse {
  success: boolean;
}
