# CareConnect Desktop App

CareConnect is a React application built with Vite and Tailwind CSS. It can run in a browser or as a desktop app powered by Electron.

## Requirements

- Node.js
- npm

Install dependencies from the project root:

```powershell
npm install
```

## Run the web app

```powershell
npm run dev
```

## Run the desktop app

For development, launch Electron with the Vite renderer:

```powershell
npm run desktop:dev
```

The command uses the Vite server at `PORT` (default `8443`) when available and starts one if needed.

To build the renderer and launch the production-style desktop app locally:

```powershell
npm run desktop:build
npm run desktop:start
```

## Window state

The desktop app remembers its last window position and size, including maximized or fullscreen state. Saved bounds are adjusted to fit a connected display, so moving between monitors does not leave the window off-screen. Window state is stored in Electron's per-user data folder.

## Build the Windows installer

On Windows, create an NSIS installer with:

```powershell
npm run desktop:installer
```

The installer is written to `release/` and creates Start Menu and desktop shortcuts. The Windows app ID is `com.careconnect.desktop`, matching the ID set by Electron for notification identity. This configures the app's Windows identity; the application must still send notifications, and Windows notification settings must allow them, for toast notifications to appear.

The header's **Notifications** button opens the in-app notification list. In the Windows desktop app, use **Send test Windows notification** in that panel to verify native notifications. Windows notification settings can suppress notifications even when the app sends them.

## Checks

```powershell
npm run build
npm run typecheck
```
