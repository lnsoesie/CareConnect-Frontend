const {
  app,
  BrowserWindow,
  Menu,
  Notification,
  ipcMain,
  screen,
  shell,
} = require("electron")
const fs = require("node:fs")
const path = require("node:path")

const isDevelopment =
  !app.isPackaged && process.env.CARECONNECT_LOAD_DIST !== "1"

app.setName("CareConnect Desktop App")
if (process.platform === "win32") {
  app.setAppUserModelId("com.careconnect.desktop")
}

const hasSingleInstanceLock = app.requestSingleInstanceLock()
if (!hasSingleInstanceLock) {
  app.quit()
}

function rendererUrl() {
  if (process.env.ELECTRON_RENDERER_URL) {
    return process.env.ELECTRON_RENDERER_URL
  }

  const port = process.env.PORT || "8443"
  return `http://127.0.0.1:${port}`
}

function sendToRenderer(channel, payload) {
  const window = BrowserWindow.getFocusedWindow()
  if (window && !window.isDestroyed()) {
    window.webContents.send(channel, payload)
  }
}

function createApplicationMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Home",
          accelerator: "Alt+1",
          click: () => sendToRenderer("desktop:navigate", "dashboard"),
        },
        {
          label: "New Message",
          accelerator: "Alt+N",
          click: () => sendToRenderer("desktop:navigate", "new-message"),
        },
        { type: "separator" },
        process.platform === "darwin"
          ? { role: "close" }
          : { role: "quit", label: "Exit CareConnect" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
        ...(isDevelopment
          ? [
              { type: "separator" },
              { role: "reload" },
              { role: "toggleDevTools" },
            ]
          : []),
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Keyboard Shortcuts",
          accelerator: "CmdOrCtrl+/",
          click: () => sendToRenderer("desktop:show-shortcuts"),
        },
      ],
    },
  ]

  if (process.platform === "darwin") {
    template.unshift({
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    })
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function applySecurityPolicy(window) {
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      void shell.openExternal(url)
    }
    return { action: "deny" }
  })

  window.webContents.on("will-navigate", (event, url) => {
    const currentUrl = window.webContents.getURL()
    if (url !== currentUrl) {
      event.preventDefault()
      if (url.startsWith("https://") || url.startsWith("http://")) {
        void shell.openExternal(url)
      }
    }
  })

  window.webContents.session.setPermissionRequestHandler(
    (_webContents, _permission, callback) => callback(false),
  )

  if (!isDevelopment) {
    window.webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            "Content-Security-Policy": [
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' https://static.figma.com data:; img-src 'self' data:; connect-src 'self' https://static.figma.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
            ],
          },
        })
      },
    )
  }
}

function getWindowState() {
  const primaryWorkArea = screen.getPrimaryDisplay().workArea
  const defaultWidth = Math.min(1920, primaryWorkArea.width)
  const defaultHeight = Math.min(900, primaryWorkArea.height)
  const defaultState = {
    x:
      primaryWorkArea.x +
      Math.round((primaryWorkArea.width - defaultWidth) / 2),
    y:
      primaryWorkArea.y +
      Math.round((primaryWorkArea.height - defaultHeight) / 2),
    width: defaultWidth,
    height: defaultHeight,
    minWidth: Math.min(800, primaryWorkArea.width),
    minHeight: Math.min(600, primaryWorkArea.height),
    isMaximized: false,
    isFullScreen: false,
  }

  try {
    const statePath = path.join(app.getPath("userData"), "window-state.json")
    const savedState = JSON.parse(fs.readFileSync(statePath, "utf8"))
    const bounds = [
      savedState.x,
      savedState.y,
      savedState.width,
      savedState.height,
    ]

    if (
      !bounds.every(Number.isFinite) ||
      savedState.width <= 0 ||
      savedState.height <= 0
    ) {
      return defaultState
    }

    const workArea = screen.getDisplayMatching(savedState).workArea
    const minWidth = Math.min(800, workArea.width)
    const minHeight = Math.min(600, workArea.height)
    const width = Math.min(workArea.width, Math.max(minWidth, savedState.width))
    const height = Math.min(
      workArea.height,
      Math.max(minHeight, savedState.height),
    )

    return {
      x: Math.max(
        workArea.x,
        Math.min(savedState.x, workArea.x + workArea.width - width),
      ),
      y: Math.max(
        workArea.y,
        Math.min(savedState.y, workArea.y + workArea.height - height),
      ),
      width,
      height,
      minWidth,
      minHeight,
      isMaximized: savedState.isMaximized === true,
      isFullScreen: savedState.isFullScreen === true,
    }
  } catch {
    return defaultState
  }
}

function saveWindowState(window) {
  if (window.isDestroyed()) return

  try {
    const state = {
      ...window.getNormalBounds(),
      isMaximized: window.isMaximized(),
      isFullScreen: window.isFullScreen(),
    }
    const statePath = path.join(app.getPath("userData"), "window-state.json")
    fs.mkdirSync(path.dirname(statePath), { recursive: true })
    fs.writeFileSync(statePath, JSON.stringify(state))
  } catch (error) {
    console.error("Failed to save window state:", error)
  }
}

function manageWindowState(window) {
  let saveTimer
  const scheduleSave = () => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => saveWindowState(window), 250)
  }

  for (const event of [
    "resize",
    "move",
    "maximize",
    "unmaximize",
    "enter-full-screen",
    "leave-full-screen",
  ]) {
    window.on(event, scheduleSave)
  }

  window.on("close", () => {
    clearTimeout(saveTimer)
    saveWindowState(window)
  })
}

function createWindow() {
  const state = getWindowState()

  const window = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: state.minWidth,
    minHeight: state.minHeight,
    show: false,
    backgroundColor: "#f5f7fa",
    title: "CareConnect Desktop App",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      spellcheck: true,
    },
  })

  manageWindowState(window)
  if (state.isMaximized) window.maximize()
  if (state.isFullScreen) window.setFullScreen(true)

  applySecurityPolicy(window)

  window.once("ready-to-show", () => window.show())

  if (isDevelopment) {
    void window.loadURL(rendererUrl())
  } else {
    void window.loadFile(path.join(__dirname, "..", "dist", "index.html"))
  }

  return window
}

function isTrustedSender(event) {
  const url = event.senderFrame?.url || ""
  return isDevelopment
    ? url.startsWith(rendererUrl())
    : url.startsWith("file://")
}

ipcMain.handle("desktop:get-app-info", (event) => {
  if (!isTrustedSender(event)) {
    throw new Error("Rejected IPC request from an untrusted renderer")
  }

  return {
    name: app.getName(),
    version: app.getVersion(),
    platform: process.platform,
  }
})

ipcMain.handle("desktop:show-test-notification", (event) => {
  if (!isTrustedSender(event)) {
    throw new Error("Rejected IPC request from an untrusted renderer")
  }

  if (process.platform !== "win32" || !Notification.isSupported()) {
    return { shown: false }
  }

  const notification = new Notification({
    title: app.getName(),
    body: "CareConnect has a test notification. Open the app to view it.",
  })

  notification.on("click", () => {
    const window = BrowserWindow.getAllWindows()[0]
    if (!window || window.isDestroyed()) return
    if (window.isMinimized()) window.restore()
    window.show()
    window.focus()
  })

  notification.show()
  return { shown: true }
})

if (hasSingleInstanceLock) {
  app.on("second-instance", () => {
    const window = BrowserWindow.getAllWindows()[0]
    if (!window) return
    if (window.isMinimized()) window.restore()
    window.focus()
  })

  app.whenReady().then(() => {
    createApplicationMenu()
    createWindow()

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
