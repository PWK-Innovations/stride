import { app, BrowserWindow, Notification, Tray, Menu, ipcMain, nativeImage, screen } from 'electron';
import * as path from 'path';
import Store from 'electron-store';
import { createLogger } from './logger';

const logger = createLogger('main');

type WidgetMode = 'compressed' | 'full';

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
