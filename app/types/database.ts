export interface Profile {
  id: string;
  email: string;
  google_access_token: string | null;
  google_refresh_token: string | null;
  google_token_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

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

export interface ExtractedTask {
  title: string;
  duration_minutes: number;
  notes: string | null;
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
