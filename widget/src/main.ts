import { app, BrowserWindow, Notification, Tray, Menu, ipcMain, nativeImage, screen } from 'electron';
import * as path from 'path';
import Store from 'electron-store';
import { createLogger } from './logger';

const logger = createLogger('main');

type WidgetMode = 'compressed' | 'full';

interface AuthStoreSchema {
  token: string;
  refreshToken: string;
  apiBaseUrl: string;
}

interface SseEvent {
  type: 'text' | 'tool' | 'done' | 'error';
  content?: string;
  name?: string;
}

const authStore = new Store<AuthStoreSchema>({
  defaults: {
    token: '',
    refreshToken: '',
    apiBaseUrl: 'http://localhost:3000',
  },
  encryptionKey: 'stride-widget-store',
});

interface MainStoreSchema {
  windowX: number;
  windowY: number;
  widgetMode: WidgetMode;
}

const COMPRESSED_WIDTH = 220;
const COMPRESSED_HEIGHT = 48;
const FULL_WIDTH = 380;
const FULL_HEIGHT = 620;

const store = new Store<MainStoreSchema>({
  name: 'stride-widget-main',
  defaults: {
    windowX: -1,
    windowY: -1,
    widgetMode: 'compressed',
  },
});

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isAlwaysOnTop = true;
let currentMode: WidgetMode = store.get('widgetMode');
let positionSaveTimeout: ReturnType<typeof setTimeout> | null = null;

function getDimensionsForMode(mode: WidgetMode): { width: number; height: number } {
  if (mode === 'compressed') {
    return { width: COMPRESSED_WIDTH, height: COMPRESSED_HEIGHT };
  }
  return { width: FULL_WIDTH, height: FULL_HEIGHT };
}

function saveWindowPosition(): void {
  if (!mainWindow) return;

  if (positionSaveTimeout) {
    clearTimeout(positionSaveTimeout);
  }

  positionSaveTimeout = setTimeout(() => {
    if (!mainWindow) return;
    const [x, y] = mainWindow.getPosition();
    store.set('windowX', x);
    store.set('windowY', y);
    logger.debug('Window position saved', { x, y });
    positionSaveTimeout = null;
  }, 500);
}

function getStartPosition(width: number, height: number): { x: number; y: number } {
  const savedX = store.get('windowX');
  const savedY = store.get('windowY');

  if (savedX >= 0 && savedY >= 0) {
    return { x: savedX, y: savedY };
  }

  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  return {
    x: screenWidth - width - 16,
    y: screenHeight - height - 16,
  };
}

function createWindow(): BrowserWindow {
  const { width, height } = getDimensionsForMode(currentMode);
  const { x, y } = getStartPosition(width, height);

  const window = new BrowserWindow({
    width,
    height,
    x,
    y,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: isAlwaysOnTop,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  window.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  window.once('ready-to-show', () => {
    logger.info('Window ready to show');
    window.show();
  });

  window.on('move', () => {
    saveWindowPosition();
  });

  window.on('closed', () => {
    mainWindow = null;
  });

  logger.info('Main window created', { width, height, mode: currentMode });
  return window;
}

function setWidgetMode(mode: WidgetMode): void {
  if (mode === currentMode) return;

  currentMode = mode;
  store.set('widgetMode', mode);

  if (mainWindow) {
    const { width, height } = getDimensionsForMode(mode);
    mainWindow.setSize(width, height);
    mainWindow.webContents.send('mode-changed', mode);
    logger.info('Widget mode changed', { mode, width, height });
  }

  updateTrayMenu();
}

function toggleWindowVisibility(): void {
  if (!mainWindow) {
    mainWindow = createWindow();
    return;
  }

  if (mainWindow.isVisible()) {
    mainWindow.hide();
    logger.debug('Window hidden');
  } else {
    mainWindow.show();
    mainWindow.focus();
    logger.debug('Window shown');
  }
}

function createTray(): void {
  // TODO: Replace with actual tray icon asset (22x22 PNG recommended for macOS)
  // Place the icon at widget/assets/tray-icon.png
  const iconPath = path.join(__dirname, '..', 'assets', 'tray-icon.png');
  let trayIcon: Electron.NativeImage;

  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    if (trayIcon.isEmpty()) {
      logger.warn('Tray icon is empty, using default');
      trayIcon = nativeImage.createEmpty();
    }
  } catch {
    logger.warn('Tray icon not found, using default empty icon');
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('Stride');

  tray.on('click', () => {
    toggleWindowVisibility();
  });

  updateTrayMenu();
  logger.info('System tray created');
}

function updateTrayMenu(): void {
  if (!tray) return;

  const launchOnLogin = app.getLoginItemSettings().openAtLogin;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: mainWindow?.isVisible() ? 'Hide' : 'Show',
      click: () => toggleWindowVisibility(),
    },
    { type: 'separator' },
    {
      label: 'Compressed Mode',
      type: 'radio',
      checked: currentMode === 'compressed',
      click: () => setWidgetMode('compressed'),
    },
    {
      label: 'Full Mode',
      type: 'radio',
      checked: currentMode === 'full',
      click: () => setWidgetMode('full'),
    },
    { type: 'separator' },
    {
      label: 'Always on Top',
      type: 'checkbox',
      checked: isAlwaysOnTop,
      click: (menuItem) => {
        isAlwaysOnTop = menuItem.checked;
        if (mainWindow) {
          mainWindow.setAlwaysOnTop(isAlwaysOnTop);
        }
        logger.info('Always on top toggled', { alwaysOnTop: isAlwaysOnTop });
      },
    },
    {
      label: 'Launch on Login',
      type: 'checkbox',
      checked: launchOnLogin,
      click: (menuItem) => {
        app.setLoginItemSettings({ openAtLogin: menuItem.checked });
        logger.info('Launch on login toggled', { openAtLogin: menuItem.checked });
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        logger.info('Quit requested from tray menu');
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

ipcMain.on('show-notification', (_, { title, body }: { title: string; body: string }) => {
  logger.debug('Showing notification', { title });
  new Notification({ title, body }).show();
});

ipcMain.handle('get-widget-mode', (): WidgetMode => {
  logger.debug('get-widget-mode invoked', { mode: currentMode });
  return currentMode;
});

ipcMain.handle('set-widget-mode', (_, mode: WidgetMode): void => {
  logger.debug('set-widget-mode invoked', { mode });
  if (mode !== 'compressed' && mode !== 'full') {
    logger.warn('Invalid widget mode requested', { mode });
    return;
  }
  setWidgetMode(mode);
});

ipcMain.handle('chat-send-message', async (_, message: string): Promise<string> => {
  const token = authStore.get('token');
  const baseUrl = authStore.get('apiBaseUrl');

  if (!token) {
    logger.warn('Chat message attempted without auth token');
    mainWindow?.webContents.send('chat-stream-error', 'Not authenticated');
    return 'Not authenticated. Please log in first.';
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    logger.info('Sending chat message to agent', { messageLength: message.length });

    const response = await fetch(`${baseUrl}/api/agent/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message, timezone }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Agent chat request failed', { status: response.status, error: errorText });
      mainWindow?.webContents.send('chat-stream-error', errorText);
      return `Error: ${response.status}`;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      logger.error('No response body reader available');
      mainWindow?.webContents.send('chat-stream-error', 'No response stream');
      return 'No response stream';
    }

    const decoder = new TextDecoder();
    let fullResponse = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        try {
          const data = JSON.parse(line.slice(6)) as SseEvent;

          if (data.type === 'text' && data.content) {
            fullResponse += data.content;
            mainWindow?.webContents.send('chat-stream-chunk', data.content);
          } else if (data.type === 'tool' && data.name) {
            mainWindow?.webContents.send('chat-stream-chunk', `[Using ${data.name}...]\n`);
          } else if (data.type === 'done') {
            mainWindow?.webContents.send('chat-stream-done');
          } else if (data.type === 'error' && data.content) {
            logger.error('Agent returned error event', { error: data.content });
            mainWindow?.webContents.send('chat-stream-error', data.content);
          }
        } catch {
          // Skip malformed SSE lines
        }
      }
    }

    mainWindow?.webContents.send('chat-response', fullResponse);
    logger.info('Chat message completed', { responseLength: fullResponse.length });
    return fullResponse;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Connection failed';
    logger.error('Chat request failed', { error: msg });
    mainWindow?.webContents.send('chat-stream-error', msg);
    return `Connection error: ${msg}`;
  }
});

app.whenReady().then(() => {
  logger.info('App ready, initializing widget', { mode: currentMode });
  createTray();
  mainWindow = createWindow();
});

app.on('window-all-closed', () => {
  // Keep running in system tray when all windows are closed
  // Intentionally not calling app.quit() so the tray icon stays active
  logger.debug('All windows closed, staying in tray');
});

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createWindow();
  }
});

app.on('before-quit', () => {
  logger.info('Application shutting down');
});
