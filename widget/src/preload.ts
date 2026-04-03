import { contextBridge, ipcRenderer } from 'electron';
import Store from 'electron-store';
import { StrideApiClient } from './api';
import { signInWithPassword, refreshSession } from './auth';
import { createLogger } from './logger';
import type {
  TasksResponse,
  ScheduleResponse,
  CreateTaskResponse,
  SuccessResponse,
} from './types';

const logger = createLogger('preload');

type WidgetMode = 'compressed' | 'full';

interface StoreSchema {
  token: string;
  refreshToken: string;
  apiBaseUrl: string;
}

const store = new Store<StoreSchema>({
  defaults: {
    token: '',
    refreshToken: '',
    apiBaseUrl: 'http://localhost:3000',
  },
  encryptionKey: 'stride-widget-store',
});

const apiClient = new StrideApiClient(
  store.get('apiBaseUrl'),
  store.get('token')
);

function syncToken(): void {
  const token = store.get('token');
  apiClient.setToken(token);
}

contextBridge.exposeInMainWorld('strideApi', {
  getTasks: async (): Promise<TasksResponse> => {
    logger.debug('getTasks called');
    syncToken();
    return apiClient.getTasks();
  },

  getSchedule: async (timezone: string): Promise<ScheduleResponse> => {
    logger.debug('getSchedule called', { timezone });
    syncToken();
    return apiClient.getSchedule(timezone);
  },

  createTask: async (title: string, durationMinutes: number): Promise<CreateTaskResponse> => {
    logger.debug('createTask called', { title, durationMinutes });
    syncToken();
    return apiClient.createTask(title, durationMinutes);
  },

  updateBlock: async (id: string, data: { start_time: string; end_time: string }): Promise<SuccessResponse> => {
    logger.debug('updateBlock called', { id });
    syncToken();
    return apiClient.updateBlock(id, data);
  },

  deleteTask: async (id: string): Promise<SuccessResponse> => {
    logger.debug('deleteTask called', { id });
    syncToken();
    return apiClient.deleteTask(id);
  },

  getToken: (): string => {
    logger.debug('getToken called');
    return store.get('token');
  },

  setToken: (token: string): void => {
    logger.debug('setToken called');
    store.set('token', token);
    apiClient.setToken(token);
  },

  clearToken: (): void => {
    logger.debug('clearToken called');
    store.set('token', '');
    store.set('refreshToken', '');
    apiClient.setToken('');
  },

  login: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    logger.info('login called', { email });
    const result = await signInWithPassword(email, password);
    if (result.success) {
      store.set('token', result.session.access_token);
      store.set('refreshToken', result.session.refresh_token);
      apiClient.setToken(result.session.access_token);
      return { success: true };
    }
    return { success: false, error: result.error };
  },

  logout: (): void => {
    logger.info('logout called');
    store.set('token', '');
    store.set('refreshToken', '');
    apiClient.setToken('');
  },

  refreshSession: async (): Promise<boolean> => {
    const refreshToken = store.get('refreshToken');
    if (!refreshToken) return false;
    const result = await refreshSession(refreshToken);
    if (result.success) {
      store.set('token', result.session.access_token);
      store.set('refreshToken', result.session.refresh_token);
      apiClient.setToken(result.session.access_token);
      return true;
    }
    return false;
  },

  showNotification: (title: string, body: string): void => {
    logger.debug('showNotification called', { title });
    ipcRenderer.send('show-notification', { title, body });
  },

  isAuthenticated: (): boolean => {
    logger.debug('isAuthenticated called');
    return apiClient.isAuthenticated();
  },
});

contextBridge.exposeInMainWorld('strideWidget', {
  getMode: async (): Promise<WidgetMode> => {
    logger.debug('getMode called');
    return ipcRenderer.invoke('get-widget-mode') as Promise<WidgetMode>;
  },

  setMode: async (mode: WidgetMode): Promise<void> => {
    logger.debug('setMode called', { mode });
    return ipcRenderer.invoke('set-widget-mode', mode) as Promise<void>;
  },

  onModeChanged: (callback: (mode: WidgetMode) => void): void => {
    logger.debug('onModeChanged listener registered');
    ipcRenderer.on('mode-changed', (_, mode: WidgetMode) => {
      callback(mode);
    });
  },
});

contextBridge.exposeInMainWorld('strideChat', {
  sendMessage: async (message: string): Promise<string> => {
    logger.debug('sendMessage called', { message });
    return ipcRenderer.invoke('chat-send-message', message) as Promise<string>;
  },

  onResponse: (callback: (response: string) => void): void => {
    logger.debug('onResponse listener registered');
    ipcRenderer.on('chat-response', (_, response: string) => {
      callback(response);
    });
  },

  onStreamChunk: (callback: (chunk: string) => void): void => {
    logger.debug('onStreamChunk listener registered');
    ipcRenderer.on('chat-stream-chunk', (_, chunk: string) => {
      callback(chunk);
    });
  },

  onStreamDone: (callback: () => void): void => {
    logger.debug('onStreamDone listener registered');
    ipcRenderer.on('chat-stream-done', () => {
      callback();
    });
  },

  onStreamError: (callback: (error: string) => void): void => {
    logger.debug('onStreamError listener registered');
    ipcRenderer.on('chat-stream-error', (_, error: string) => {
      callback(error);
    });
  },
});

logger.info('Preload bridges exposed', { bridges: ['strideApi', 'strideWidget', 'strideChat'] });
