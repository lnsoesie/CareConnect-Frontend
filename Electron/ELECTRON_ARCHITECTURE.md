# CareConnect Electron Architecture

CareConnect can run either as the existing Vite web application or as an Electron desktop application.

## Processes

### Main process

Entry point: `electron/main.cjs`

The main process owns:

- Electron application lifecycle
- Single-instance enforcement
- Creation and restoration of the main `BrowserWindow`
- Native File, Edit, View, Window, and Help menus
- External-link handling
- Permission denial by default
- Production content security policy
- The allowlisted `desktop:get-app-info` IPC handler

The renderer never receives direct access to Node.js or Electron APIs.

### Preload process

Entry point: `electron/preload.cjs`

The preload script exposes a minimal `window.careConnectDesktop` API through `contextBridge`:

- `getAppInfo()` returns the desktop application name, version, and platform.
- `onNavigate(callback)` handles allowlisted navigation requests from the native application menu.
- `onShowShortcuts(callback)` opens the renderer's keyboard-shortcut guide.

The preload script does not expose `ipcRenderer`, generic channel names, filesystem access, shell access, or arbitrary message payloads.

### Renderer process

Entry point: `src/main.tsx`

The renderer is the existing React application. It:

- Runs with `contextIsolation` enabled.
- Runs with Node integration disabled.
- Runs in Electron's sandbox.
- Uses the narrow preload API when available.
- Continues to work as a normal browser application when the preload API is absent.

Renderer API types are declared in `src/electron.d.ts`.

## Commands

### Development

The Vite development server must already be running:

```bash
pnpm desktop:dev
```

The main process uses `ELECTRON_RENDERER_URL` when provided. Otherwise, it connects to `http://127.0.0.1:$PORT`, defaulting to port `8443`.

### Production-style local run

Build the renderer with file-relative asset paths, then launch Electron:

```bash
pnpm desktop:build
pnpm desktop:start
```

The production-style main process loads `dist/index.html` directly.

## Security configuration

The `BrowserWindow` uses:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- `webSecurity: true`
- A fixed local preload script
- Denied permission requests by default
- Denied popup creation
- External HTTP and HTTPS links opened through the operating system
- Sender validation for renderer-to-main IPC
- A restrictive production content security policy

Only development builds expose reload and developer-tools menu items.
