const { contextBridge, ipcRenderer } = require("electron")

const allowedDestinations = new Set([
  "dashboard",
  "appointments",
  "messages",
  "new-message",
  "medications",
  "profile",
  "settings",
])

contextBridge.exposeInMainWorld("careConnectDesktop", {
  getAppInfo: () => ipcRenderer.invoke("desktop:get-app-info"),
  showTestNotification: () =>
    ipcRenderer.invoke("desktop:show-test-notification"),
  onNavigate: (callback) => {
    const listener = (_event, destination) => {
      if (allowedDestinations.has(destination)) callback(destination)
    }
    ipcRenderer.on("desktop:navigate", listener)
    return () => ipcRenderer.removeListener("desktop:navigate", listener)
  },
  onShowShortcuts: (callback) => {
    const listener = () => callback()
    ipcRenderer.on("desktop:show-shortcuts", listener)
    return () => ipcRenderer.removeListener("desktop:show-shortcuts", listener)
  },
})
