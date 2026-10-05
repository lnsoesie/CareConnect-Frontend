'use strict';

/**
 * MAIN PROCESS — CareConnect Desktop
 *
 * Entry point for the Electron app. Runs in a full Node.js environment.
 * Responsibilities:
 *   - Create and manage the BrowserWindow
 *   - Build the native application menu
 *   - Register IPC handlers so the renderer can call native OS features
 *   - Manage the app lifecycle (ready, activate, window-all-closed)
 *
 * Security: contextIsolation=true, nodeIntegration=false (Electron defaults).
 * The renderer only has access to APIs explicitly exposed via contextBridge
 * in preload.cjs.
 *
 * Docs: https://www.electronjs.org/docs/latest/tutorial/process-model
 */

const path    = require('path');
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  Notification,
  shell,
} = require('electron');

// ─── Constants ────────────────────────────────────────────────────────────────

const DEV  = process.env.NODE_ENV !== 'production';
const PORT = 3000;

// ─── Window ───────────────────────────────────────────────────────────────────

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width:     1280,
    height:    820,
    minWidth:  960,
    minHeight: 640,
    title:     'CareConnect',
    // Show the window only after content has painted — avoids white flash
    show: false,
    backgroundColor: '#1565c0',
    webPreferences: {
      // Preload script bridges main ↔ renderer safely
      preload: path.join(__dirname, 'preload.cjs'),
      // Security defaults — renderer cannot require() Node modules
      contextIsolation: true,
      nodeIntegration:  false,
    },
  });

  // Reveal the window when it is fully ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load content -------------------------------------------------
  if (DEV) {
    // Development: Vite dev server with HMR
    mainWindow.loadURL(`http://localhost:${PORT}`);
  } else {
    // Production: built static bundle
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  setApplicationMenu();
}

// ─── Native menu ─────────────────────────────────────────────────────────────

/**
 * Push a "navigate" event to the renderer.
 * Used by menu items to change the active page.
 */
function sendNavigate(page) {
  mainWindow?.webContents.send('navigate', page);
}

function setApplicationMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    // macOS: app-level menu (first entry)
    ...(isMac
      ? [{
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        }]
      : []),

    // File
    {
      label: 'File',
      submenu: [
        {
          label:       'New Message',
          accelerator: 'CmdOrCtrl+N',
          click:       () => sendNavigate('new-message'),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },

    // Edit
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },

    // View — section shortcuts + standard Electron view items
    {
      label: 'View',
      submenu: [
        { label: 'Home',         accelerator: 'CmdOrCtrl+1', click: () => sendNavigate('home') },
        { label: 'Appointments', accelerator: 'CmdOrCtrl+2', click: () => sendNavigate('appointments') },
        { label: 'Messages',     accelerator: 'CmdOrCtrl+3', click: () => sendNavigate('messages') },
        { label: 'Medications',  accelerator: 'CmdOrCtrl+4', click: () => sendNavigate('medications') },
        { label: 'Profile',      accelerator: 'CmdOrCtrl+5', click: () => sendNavigate('profile') },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },

    // Help
    {
      label: 'Help',
      submenu: [
        {
          label: 'CareConnect Support',
          click: () => shell.openExternal('https://careconnect.health/support'),
        },
        {
          label: 'HIPAA Privacy Notice',
          click: () => shell.openExternal('https://careconnect.health/privacy'),
        },
        { type: 'separator' },
        {
          label: 'About CareConnect',
          click: () =>
            dialog.showMessageBox(mainWindow, {
              type:    'info',
              title:   'CareConnect',
              message: `CareConnect v${app.getVersion()}`,
              detail:  'HIPAA Compliant Patient Portal\n© 2026 CareConnect Health',
              buttons: ['OK'],
            }),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ─── IPC Handlers ────────────────────────────────────────────────────────────

/**
 * Pattern 1 — Renderer → Main, one-way (ipcRenderer.send / ipcMain.on)
 * Renderer tells main which page is active → update the window title.
 */
ipcMain.on('page-changed', (_event, page) => {
  const titles = {
    home:            'Home',
    appointments:    'Appointments',
    messages:        'Messages',
    'message-detail':'Messages',
    'new-message':   'New Message',
    medications:     'Medications',
    profile:         'Profile',
    settings:        'Settings',
  };
  if (mainWindow) {
    mainWindow.setTitle(`CareConnect — ${titles[page] ?? page}`);
  }
});

/**
 * Pattern 2 — Renderer → Main, two-way (ipcRenderer.invoke / ipcMain.handle)
 * Returns a Promise to the renderer. Used when a result is needed.
 */

// Native logout confirmation dialog
ipcMain.handle('show-logout-dialog', async () => {
  const { response } = await dialog.showMessageBox(mainWindow, {
    type:      'warning',
    title:     'Sign Out',
    message:   'Are you sure you want to sign out?',
    detail:    'You will be logged out of all active sessions on this device.',
    buttons:   ['Cancel', 'Sign Out'],
    defaultId: 0,
    cancelId:  0,
  });
  return response === 1; // true = user confirmed
});

// Native desktop notification
ipcMain.handle('show-notification', (_event, title, body) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

// Expose the real app version to the renderer
ipcMain.handle('get-app-version', () => app.getVersion());

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createMainWindow();

  // macOS: re-create the window when the dock icon is clicked and no windows exist
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
