import { createLogger } from './logger';
import type {
  TasksResponse,
  ScheduleResponse,
  CreateTaskResponse,
  SuccessResponse,
  ApiError,
} from './types';

const logger = createLogger('api-client');

export class StrideApiClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl = process.env.STRIDE_API_URL || 'https://stride-amber.vercel.app', token = '') {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  isAuthenticated(): boolean {
    return this.token.length > 0;
  }

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    logger.debug('API request', { method, url });

    try {
      const response = await fetch(url, {
        method,
        headers: this.headers(),
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });

      const data: T | ApiError = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          const message = 'Not authenticated — check your access token';
          logger.error('Authentication failed', { method, url, status: 401 });
          throw new Error(message);
        }

        const errorMessage = (data as ApiError).error || `HTTP ${response.status}`;
        logger.error('API request failed', { method, url, status: response.status, error: errorMessage });
        throw new Error(errorMessage);
      }

      logger.debug('API request succeeded', { method, url, status: response.status });
      return data as T;
    } catch (error: unknown) {
      if (error instanceof Error && error.message !== 'Failed to fetch') {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      logger.error('API request error', { method, url, error: message });
      throw new Error(`Network error: ${message}`);
    }
  }

  async getTasks(): Promise<TasksResponse> {
    return this.request<TasksResponse>('GET', '/api/tasks');
  }

  async getSchedule(timezone: string): Promise<ScheduleResponse> {
    const encoded = encodeURIComponent(timezone);
    return this.request<ScheduleResponse>('GET', `/api/schedule?timezone=${encoded}`);
  }

  async createTask(title: string, durationMinutes: number): Promise<CreateTaskResponse> {
    return this.request<CreateTaskResponse>('POST', '/api/tasks', {
      title,
      duration_minutes: durationMinutes,
    });
  }

  async updateBlock(id: string, data: { start_time: string; end_time: string; cascade?: boolean }): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('PATCH', `/api/schedule/${id}`, data);
  }

  async deleteTask(id: string): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('DELETE', `/api/tasks/${id}`);
  }

  async deleteBlock(id: string): Promise<SuccessResponse> {
    return this.request<SuccessResponse>('DELETE', `/api/schedule/${id}`);
  }
}
