'use strict';

/**
 * PRELOAD SCRIPT — CareConnect Desktop
 *
 * Runs inside the renderer context BEFORE the web page loads.
 * Has access to both Node.js globals AND the DOM, but we must never
 * expose raw Electron or Node APIs to the renderer directly.
 *
 * contextBridge.exposeInMainWorld() creates a frozen, read-only API
 * object on window — only these explicit methods reach renderer JS.
 *
 * IPC patterns implemented (per official Electron docs):
 *   Pattern 1: Renderer → Main, one-way   ipcRenderer.send   / ipcMain.on
 *   Pattern 2: Renderer → Main, two-way   ipcRenderer.invoke / ipcMain.handle
 *   Pattern 3: Main → Renderer            webContents.send   / ipcRenderer.on
 *
 * Docs: https://www.electronjs.org/docs/latest/tutorial/ipc
 * Docs: https://www.electronjs.org/docs/latest/tutorial/context-isolation
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

  // ── Pattern 1: Renderer → Main, one-way ────────────────────────────────────
  // Fire-and-forget. Main process receives the event but sends no reply.

  /**
   * Notify the main process that the active page changed.
   * Main uses this to update the native window title.
   * @param {string} page
   */
  notifyPageChanged: (page) => {
    ipcRenderer.send('page-changed', page);
  },

  // ── Pattern 2: Renderer → Main, two-way ────────────────────────────────────
  // invoke() returns a Promise resolved by ipcMain.handle() in main.cjs.

  /**
   * Open a native OS confirmation dialog asking the user to confirm sign-out.
   * @returns {Promise<boolean>} true if the user clicked "Sign Out"
   */
  confirmLogout: () => ipcRenderer.invoke('show-logout-dialog'),

  /**
   * Trigger a native desktop notification.
   * @param {string} title
   * @param {string} body
   */
  notify: (title, body) => ipcRenderer.invoke('show-notification', title, body),

  /**
   * Retrieve the real Electron app version string (e.g. "2.4.1").
   * @returns {Promise<string>}
   */
  getVersion: () => ipcRenderer.invoke('get-app-version'),

  // ── Pattern 3: Main → Renderer ─────────────────────────────────────────────
  // Main process pushes events to the renderer (e.g. native menu clicks).
  // We wrap the callback to avoid leaking ipcRenderer via event.sender,
  // as recommended in the official Electron IPC docs.

  /**
   * Subscribe to page-navigation events pushed from the main process
   * (native menu items, keyboard shortcuts).
   * @param {(page: string) => void} callback
   * @returns {() => void} unsubscribe — call in useEffect cleanup
   */
  onNavigate: (callback) => {
    const handler = (_event, page) => callback(page);
    ipcRenderer.on('navigate', handler);
    // Return unsubscribe so React can clean up in useEffect
    return () => ipcRenderer.removeListener('navigate', handler);
  },

  // Expose the OS name so React can apply platform-specific styles
  // (e.g. extra left padding on macOS for traffic-light buttons)
  platform: process.platform,
});
