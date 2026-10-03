type DesktopDestination = "dashboard" | "appointments" | "messages" | "new-message" | "medications" | "profile" | "settings"

interface CareConnectDesktopApi {
  getAppInfo(): Promise<{
    name: string
    version: string
    platform: "aix" | "darwin" | "freebsd" | "linux" | "openbsd" | "sunos" | "win32"
  }>
  showTestNotification(): Promise<{ shown: boolean }>
  onNavigate(callback: (destination: DesktopDestination) => void): () => void
  onShowShortcuts(callback: () => void): () => void
}

interface Window {
  careConnectDesktop?: CareConnectDesktopApi
}
