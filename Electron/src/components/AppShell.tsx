import { useEffect, useRef, useState, type ReactNode } from "react"

import { assetPathPrefix, Brand, Icon, ModalDialog } from "./AppComponents"

import type { IconName, Screen } from "../types"

interface NavItem {
  screen: Screen

  icon: IconName

  label: string
}

interface ShortcutRowProps {
  keys: string[]

  label: string
}

interface AppNotification {
  id: number

  title: string

  description: string

  time: string

  destination: Screen

  unread: boolean
}

const initialNotifications: AppNotification[] = [
  {
    id: 1,

    title: "Appointment reminder",

    description: "You have an appointment scheduled for today.",

    time: "Today, 2:30 PM",

    destination: "appointments",

    unread: true,
  },

  {
    id: 2,

    title: "Medication reminder",

    description: "A medication reminder is scheduled for today.",

    time: "Today, 6:00 PM",

    destination: "medications",

    unread: true,
  },

  {
    id: 3,

    title: "New care team message",

    description: "You have a new message from your care team.",

    time: "10 minutes ago",

    destination: "messages",

    unread: true,
  },
]

const navItems: NavItem[] = [
  { screen: "dashboard", icon: "home", label: "Home" },

  { screen: "appointments", icon: "calendar", label: "Appointments" },

  { screen: "messages", icon: "message", label: "Messages" },

  { screen: "medications", icon: "pill", label: "Medications" },

  { screen: "profile", icon: "user", label: "Profile" },

  { screen: "settings", icon: "settings", label: "Settings" },
]

export function Shell({
  screen,

  onNavigate,

  children,
}: {
  screen: Screen

  onNavigate: (screen: Screen) => void

  children: ReactNode
}) {
  const [contextMenu, setContextMenu] = useState<{
    x: number

    y: number
  } | null>(null)

  const [showFileMenu, setShowFileMenu] = useState(false)

  const [showShortcuts, setShowShortcuts] = useState(false)

  const [showHelpMenu, setShowHelpMenu] = useState(false)

  const [showAccountMenu, setShowAccountMenu] = useState(false)

  const [showCalendar, setShowCalendar] = useState(false)

  const [showNotifications, setShowNotifications] = useState(false)

  const [desktopVersion, setDesktopVersion] = useState<string | null>(null)

  const [desktopPlatform, setDesktopPlatform] = useState<string | null>(null)

  const [notifications, setNotifications] = useState(initialNotifications)

  const [notificationStatus, setNotificationStatus] =
    useState<"idle" | "sending" | "sent" | "unavailable" | "error">("idle")

  const contextMenuRef = useRef<HTMLDivElement>(null)

  const contextMenuTriggerRef = useRef<HTMLElement | null>(null)

  const fileMenuRef = useRef<HTMLDivElement>(null)

  const fileButtonRef = useRef<HTMLButtonElement>(null)

  const shortcutDialogRef = useRef<HTMLDivElement>(null)

  const shortcutTriggerRef = useRef<HTMLElement | null>(null)

  const helpMenuRef = useRef<HTMLDivElement>(null)

  const helpButtonRef = useRef<HTMLButtonElement>(null)

  const accountMenuRef = useRef<HTMLDivElement>(null)

  const accountButtonRef = useRef<HTMLButtonElement>(null)

  const notificationsRef = useRef<HTMLDivElement>(null)

  const notificationsButtonRef = useRef<HTMLButtonElement>(null)

  const unreadNotificationCount = notifications.filter(
    (notification) => notification.unread,
  ).length

  const activeScreen =
    screen === "new-message" || screen === "conversation" ? "messages" : screen

  useEffect(() => {
    document.querySelector<HTMLElement>("#main-content h1")?.focus()
  }, [screen])

  useEffect(() => {
    if (!window.careConnectDesktop) return

    void window.careConnectDesktop

      .getAppInfo()

      .then((info) => {
        setDesktopVersion(info.version)

        setDesktopPlatform(info.platform)
      })

      .catch(() => {
        setDesktopVersion(null)

        setDesktopPlatform(null)
      })

    const unsubscribeShortcuts = window.careConnectDesktop.onShowShortcuts(
      () => {
        shortcutTriggerRef.current = (document.activeElement as HTMLElement)

        setContextMenu(null)

        setShowShortcuts(true)
      },
    )

    const unsubscribeFileMenu = window.careConnectDesktop.onShowFileMenu?.(
      () => {
        setShowHelpMenu(false)

        setShowFileMenu(true)
      },
    )

    return () => {
      unsubscribeShortcuts?.()
      unsubscribeFileMenu?.()
    }
  }, [])

  useEffect(() => {
    if (!contextMenu) return

    contextMenuRef.current

      ?.querySelector<HTMLButtonElement>('[role="menuitem"]')

      ?.focus()

    const close = () => setContextMenu(null)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close()

        contextMenuTriggerRef.current?.focus()
      }
    }

    window.addEventListener("click", close)

    window.addEventListener("blur", close)

    window.addEventListener("resize", close)

    window.addEventListener("scroll", close, true)

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("click", close)

      window.removeEventListener("blur", close)

      window.removeEventListener("resize", close)

      window.removeEventListener("scroll", close, true)

      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [contextMenu])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement

      const isEditing =
        target.matches("input, textarea, select") || target.isContentEditable

      if (event.altKey && !event.ctrlKey && !event.metaKey) {
        const destinations: Record<string, Screen> = {
          Digit1: "dashboard",

          Digit2: "appointments",

          Digit3: "messages",

          Digit4: "medications",

          Digit5: "profile",

          Digit6: "settings",

          KeyN: "new-message",
        }

        const destination = destinations[event.code]

        if (destination) {
          event.preventDefault()

          setContextMenu(null)

          setShowFileMenu(false)

          setShowShortcuts(false)

          onNavigate(destination)

          return
        }

        if (event.code === "KeyF") {
          event.preventDefault()

          setContextMenu(null)

          setShowHelpMenu(false)

          setShowFileMenu(true)

          return
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()

        document.querySelector<HTMLInputElement>(".search input")?.focus()

        return
      }

      if (
        !isEditing &&
        (event.key === "?" ||
          ((event.ctrlKey || event.metaKey) && event.key === "/"))
      ) {
        event.preventDefault()

        shortcutTriggerRef.current = (document.activeElement as HTMLElement)

        setContextMenu(null)

        setShowShortcuts(true)
      }
    }

    window.addEventListener("keydown", handleShortcut)

    return () => window.removeEventListener("keydown", handleShortcut)
  }, [onNavigate])

  useEffect(() => {
    if (!showFileMenu) return

    fileMenuRef.current

      ?.querySelector<HTMLButtonElement>('[role="menuitem"]')

      ?.focus()

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!fileMenuRef.current?.contains(event.target as Node)) {
        setShowFileMenu(false)
      }
    }

    window.addEventListener("mousedown", closeOnOutsideClick)

    return () => {
      window.removeEventListener("mousedown", closeOnOutsideClick)
    }
  }, [showFileMenu])

  useEffect(() => {
    if (!showShortcuts) return

    shortcutDialogRef.current

      ?.querySelector<HTMLButtonElement>("button")

      ?.focus()

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()

        setShowShortcuts(false)

        shortcutTriggerRef.current?.focus()

        return
      }

      if (event.key !== "Tab") return

      const focusable = Array.from(
        shortcutDialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )

      if (!focusable.length) return

      const first = focusable[0]

      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()

        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()

        first.focus()
      }
    }

    window.addEventListener("keydown", handleDialogKeyDown)

    return () => window.removeEventListener("keydown", handleDialogKeyDown)
  }, [showShortcuts])

  useEffect(() => {
    if (!showHelpMenu) return

    helpMenuRef.current

      ?.querySelector<HTMLButtonElement>('[role="menuitem"]')

      ?.focus()

    const closeHelpMenu = (event: MouseEvent) => {
      if (!helpMenuRef.current?.contains(event.target as Node)) {
        setShowHelpMenu(false)
      }
    }

    const handleHelpKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowHelpMenu(false)

        helpButtonRef.current?.focus()
      }
    }

    window.addEventListener("mousedown", closeHelpMenu)

    window.addEventListener("keydown", handleHelpKeyDown)

    return () => {
      window.removeEventListener("mousedown", closeHelpMenu)

      window.removeEventListener("keydown", handleHelpKeyDown)
    }
  }, [showHelpMenu])

  useEffect(() => {
    if (!showNotifications) return

    const closeNotifications = (event: MouseEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotifications(false)

        notificationsButtonRef.current?.focus()
      }
    }

    window.addEventListener("mousedown", closeNotifications)

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("mousedown", closeNotifications)

      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [showNotifications])

  useEffect(() => {
    if (!showAccountMenu) return

    const items = Array.from(
      accountMenuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]',
      ) ?? [],
    )

    items[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = items.indexOf(
        document.activeElement as HTMLButtonElement,
      )

      if (event.key === "Escape") {
        setShowAccountMenu(false)

        accountButtonRef.current?.focus()
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()

        const direction = event.key === "ArrowDown" ? 1 : -1

        items[(currentIndex + direction + items.length) % items.length]?.focus()
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault()

        items[event.key === "Home" ? 0 : items.length - 1]?.focus()
      }
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setShowAccountMenu(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    window.addEventListener("mousedown", closeOnOutsideClick)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)

      window.removeEventListener("mousedown", closeOnOutsideClick)
    }
  }, [showAccountMenu])

  const openContextMenu = (x: number, y: number) => {
    const menuWidth = 220

    const menuHeight = 270

    contextMenuTriggerRef.current = (document.activeElement as HTMLElement)

    setContextMenu({
      x: Math.max(8, Math.min(x, window.innerWidth - menuWidth - 8)),

      y: Math.max(8, Math.min(y, window.innerHeight - menuHeight - 8)),
    })
  }

  const chooseContextAction = (destination: Screen) => {
    setContextMenu(null)

    onNavigate(destination)
  }

  const openShortcutGuide = (trigger?: HTMLElement) => {
    shortcutTriggerRef.current = trigger ?? contextMenuTriggerRef.current

    setContextMenu(null)

    setShowHelpMenu(false)

    setShowShortcuts(true)
  }

  const openNotification = (notification: AppNotification) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, unread: false } : item,
      ),
    )

    setShowNotifications(false)

    onNavigate(notification.destination)
  }

  const sendTestNotification = async () => {
    if (!window.careConnectDesktop) {
      setNotificationStatus("unavailable")

      return
    }

    setNotificationStatus("sending")

    try {
      const result = await window.careConnectDesktop.showTestNotification()

      if (!result.shown) {
        setNotificationStatus("unavailable")

        return
      }

      setNotifications((current) => [
        {
          id: Date.now(),

          title: "Test notification",

          description: "A Windows notification was requested.",

          time: "Just now",

          destination: "settings",

          unread: true,
        },

        ...current,
      ])

      setNotificationStatus("sent")
    } catch {
      setNotificationStatus("error")
    }
  }

  return (
    <div
      className="app-shell"
      onContextMenu={(event) => {
        event.preventDefault()

        openContextMenu(event.clientX, event.clientY)
      }}
      onKeyDown={(event) => {
        if (event.shiftKey && event.key === "F10") {
          event.preventDefault()

          const target = (event.target as HTMLElement).getBoundingClientRect()

          openContextMenu(target.left + 16, target.top + 16)
        }
      }}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <nav
        className="desktop-menu"
        aria-label="CareConnect menus"
      >
        <div className="file-menu" ref={fileMenuRef}>
          <button
            className="desktop-menu-button"
            ref={fileButtonRef}
            aria-haspopup="menu"
            aria-expanded={showFileMenu}
            onClick={() => {
              setShowHelpMenu(false)

              setShowFileMenu((open) => !open)
            }}
          >
            File
          </button>
          {showFileMenu && (
            <div
              className="help-menu-popup"
              role="menu"
              aria-label="File menu"
              onKeyDown={(event) => {
                const items = Array.from(
                  event.currentTarget.querySelectorAll<HTMLButtonElement>(
                    '[role="menuitem"]',
                  ),
                )
                const currentIndex = items.indexOf(
                  document.activeElement as HTMLButtonElement,
                )

                if (event.key === "Escape") {
                  event.preventDefault()
                  setShowFileMenu(false)
                  fileButtonRef.current?.focus()
                } else if (
                  (event.key === "ArrowDown" || event.key === "ArrowUp") &&
                  items.length > 0
                ) {
                  event.preventDefault()
                  const direction = event.key === "ArrowDown" ? 1 : -1
                  const startIndex =
                    currentIndex < 0 ? (direction > 0 ? -1 : 0) : currentIndex
                  items[
                    (startIndex + direction + items.length) % items.length
                  ]?.focus()
                } else if (event.key === "Home" || event.key === "End") {
                  event.preventDefault()
                  items[event.key === "Home" ? 0 : items.length - 1]?.focus()
                }
              }}
            >
              {navItems.map((item, index) => (
                <button
                  key={item.screen}
                  role="menuitem"
                  onClick={() => {
                    setShowFileMenu(false)

                    onNavigate(item.screen)
                  }}
                >
                  <span>{item.label}</span>
                  <kbd>Alt + {index + 1}</kbd>
                </button>
              ))}
              <div role="separator" />
              <button
                role="menuitem"
                onClick={() => {
                  setShowFileMenu(false)

                  onNavigate("new-message")
                }}
              >
                <span>New Message</span>
                <kbd>Alt + N</kbd>
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setShowFileMenu(false)

                  onNavigate("login")
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
        <span>Edit</span>
        <span>View</span>
        <div className="help-menu" ref={helpMenuRef}>
          <button
            className="desktop-menu-button"
            ref={helpButtonRef}
            aria-haspopup="menu"
            aria-expanded={showHelpMenu}
            onClick={() => {
              setContextMenu(null)

              setShowFileMenu(false)

              setShowHelpMenu((open) => !open)
            }}
          >
            Help
          </button>
          {showHelpMenu && (
            <div className="help-menu-popup" role="menu" aria-label="Help menu">
              <button
                role="menuitem"
                onClick={(event) =>
                  openShortcutGuide(
                    helpButtonRef.current ?? event.currentTarget,
                  )
                }
              >
                <span>Keyboard shortcuts</span>
                <kbd>Ctrl + /</kbd>
              </button>
              <div role="separator" />
              <p>
                Press <kbd>?</kbd> anytime to open the shortcut guide.
              </p>
            </div>
          )}
        </div>
      </nav>
      <header className="topbar">
        <Brand compact variant="shell" />
        <div className="top-actions">
          <label className="search">
            <span>⌕</span>
            <input aria-label="Search" placeholder="Search..." />
          </label>
          <button className="logout-button" onClick={() => onNavigate("login")}>
            <img alt="" src={`${assetPathPrefix}/profile/ba41a.svg`} />
            <span>Log out</span>
          </button>
          <div className="notification-anchor" ref={notificationsRef}>
            <button
              className="top-icon"
              ref={notificationsButtonRef}
              aria-label={`Notifications, ${unreadNotificationCount} unread`}
              aria-haspopup="dialog"
              aria-expanded={showNotifications}
              aria-controls="notifications-panel"
              onClick={() => setShowNotifications((open) => !open)}
            >
              🔔
              {unreadNotificationCount > 0 && <b>{unreadNotificationCount}</b>}
            </button>
            {showNotifications && (
              <section
                className="notifications-panel"
                id="notifications-panel"
                role="dialog"
                aria-labelledby="notifications-title"
              >
                <header className="notifications-header">
                  <div>
                    <h2 id="notifications-title">Notifications</h2>
                    <span>{unreadNotificationCount} unread</span>
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      className="notifications-clear"
                      onClick={() =>
                        setNotifications((current) =>
                          current.map((item) => ({ ...item, unread: false })),
                        )
                      }
                    >
                      Mark all read
                    </button>
                  )}
                </header>
                {notifications.length > 0 ? (
                  <div className="notifications-list">
                    {notifications.map((notification) => (
                      <button
                        className={`notification-item${notification.unread ? " unread" : ""
                          }`}
                        key={notification.id}
                        onClick={() => openNotification(notification)}
                      >
                        <span
                          className="notification-indicator"
                          aria-hidden="true"
                        />
                        <span className="notification-copy">
                          <strong>{notification.title}</strong>
                          <span>{notification.description}</span>
                          <small>{notification.time}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="notifications-empty">You're all caught up.</p>
                )}
                <footer className="notifications-footer">
                  {desktopPlatform === "win32" ? (
                    <button
                      className="notification-test"
                      disabled={notificationStatus === "sending"}
                      onClick={sendTestNotification}
                    >
                      Send test Windows notification
                    </button>
                  ) : (
                    <p>
                      Native notifications are available in the Windows desktop
                      app.
                    </p>
                  )}
                  {notificationStatus !== "idle" && (
                    <p className="notification-result" aria-live="polite">
                      {notificationStatus === "sending" &&
                        "Sending test notification..."}
                      {notificationStatus === "sent" &&
                        "Test notification requested."}
                      {notificationStatus === "unavailable" &&
                        "Windows notifications are unavailable."}
                      {notificationStatus === "error" &&
                        "Could not send the test notification."}
                    </p>
                  )}
                </footer>
              </section>
            )}
          </div>
          <button
            className="top-icon"
            aria-label="Calendar"
            aria-haspopup="dialog"
            onClick={() => setShowCalendar(true)}
          >
            □
          </button>
          <span className="mini-avatar">JD</span>
          <div className="account-menu-anchor" ref={accountMenuRef}>
            <button
              className="account-menu"
              ref={accountButtonRef}
              aria-haspopup="menu"
              aria-expanded={showAccountMenu}
              onClick={() => setShowAccountMenu((open) => !open)}
            >
              Jane Doe　⌄
            </button>
            {showAccountMenu && (
              <div
                className="account-menu-popup"
                role="menu"
                aria-label="Account menu"
              >
                <button
                  role="menuitem"
                  onClick={() => {
                    setShowAccountMenu(false)

                    onNavigate("profile")
                  }}
                >
                  View profile
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setShowAccountMenu(false)

                    onNavigate("settings")
                  }}
                >
                  Account settings
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setShowAccountMenu(false)

                    onNavigate("login")
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <aside className="sidebar">
        <nav>
          {navItems.map((item) => (
            <button
              key={item.screen}
              className={activeScreen === item.screen ? "active" : ""}
              onClick={() => onNavigate(item.screen)}
              aria-current={activeScreen === item.screen ? "page" : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.screen === "messages" && <b className="badge">2</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <span className="avatar">JD</span>
          <span>
            <b>Jane Doe</b>
            <small>Patient</small>
          </span>
        </div>
      </aside>
      <main className="app-content" id="main-content">
        {children}
      </main>
      <footer className="statusbar">
        <span>
          <i /> Connected　　<span className="sync">Last synced: just now</span>
        </span>
        <span>
          {desktopVersion
            ? `CareConnect Desktop v${desktopVersion}`
            : "CareConnect v2.4.1"}
          HIPAA Compliant　　© 2026 CareConnect Health
        </span>
      </footer>
      {contextMenu && (
        <div
          className="context-menu"
          ref={contextMenuRef}
          role="menu"
          aria-label="CareConnect context menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            const items = Array.from(
              contextMenuRef.current?.querySelectorAll<HTMLButtonElement>(
                '[role="menuitem"]',
              ) ?? [],
            )

            const currentIndex = items.indexOf(
              document.activeElement as HTMLButtonElement,
            )

            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()

              const direction = event.key === "ArrowDown" ? 1 : -1

              items[
                (currentIndex + direction + items.length) % items.length
              ]?.focus()
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault()

              items[event.key === "Home" ? 0 : items.length - 1]?.focus()
            }
          }}
        >
          <p>QUICK ACTIONS</p>
          <button
            role="menuitem"
            onClick={() => chooseContextAction("dashboard")}
          >
            <Icon name="home" />
            Go to Home
          </button>
          <button
            role="menuitem"
            onClick={() => chooseContextAction("new-message")}
          >
            <Icon name="message" />
            New message
          </button>
          <div className="context-menu-separator" role="separator" />
          <button
            role="menuitem"
            onClick={() => chooseContextAction("profile")}
          >
            <Icon name="user" />
            View profile
          </button>
          <button
            role="menuitem"
            onClick={() => chooseContextAction("settings")}
          >
            <Icon name="settings" />
            Settings
          </button>
          <button role="menuitem" onClick={() => openShortcutGuide()}>
            <span className="context-menu-key">?</span>
            Keyboard shortcuts
          </button>
          <div className="context-menu-separator" role="separator" />
          <button
            className="context-menu-signout"
            role="menuitem"
            onClick={() => chooseContextAction("login")}
          >
            Sign out
          </button>
        </div>
      )}
      {showShortcuts && (
        <div
          className="shortcut-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowShortcuts(false)
          }}
        >
          <div
            className="shortcut-dialog"
            ref={shortcutDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcut-dialog-title"
          >
            <header>
              <div>
                <h2 id="shortcut-dialog-title">Keyboard shortcuts</h2>
                <p>Navigate CareConnect without leaving the keyboard.</p>
              </div>
              <button
                className="shortcut-close"
                aria-label="Close keyboard shortcuts"
                onClick={() => {
                  setShowShortcuts(false)

                  shortcutTriggerRef.current?.focus()
                }}
              >
                ×
              </button>
            </header>
            <div className="shortcut-groups">
              <section>
                <h3>Navigation</h3>
                <ShortcutRow keys={["Alt", "1"]} label="Home" />
                <ShortcutRow keys={["Alt", "2"]} label="Appointments" />
                <ShortcutRow keys={["Alt", "3"]} label="Messages" />
                <ShortcutRow keys={["Alt", "4"]} label="Medications" />
                <ShortcutRow keys={["Alt", "5"]} label="Profile" />
                <ShortcutRow keys={["Alt", "6"]} label="Settings" />
              </section>
              <section>
                <h3>Actions</h3>
                <ShortcutRow keys={["Alt", "N"]} label="New message" />
                <ShortcutRow keys={["Ctrl", "K"]} label="Focus search" />
                <ShortcutRow keys={["Shift", "F10"]} label="Context menu" />
                <ShortcutRow keys={["?"]} label="Shortcut guide" />
                <ShortcutRow keys={["Esc"]} label="Close a menu or dialog" />
              </section>
            </div>
            <footer>
              On macOS, use <b>Command</b> instead of <b>Ctrl</b>.
            </footer>
          </div>
        </div>
      )}
      {showCalendar && (
        <ModalDialog
          title="Upcoming appointments"
          onClose={() => setShowCalendar(false)}
        >
          <div className="calendar-dialog-content">
            <p>Saturday, March 14</p>
            <article>
              <b>2:30 PM · Cardiology follow-up</b>
              <span>Dr. Sarah Chen · Bay Medical Center</span>
            </article>
            <article>
              <b>Friday, March 21 · 10:00 AM</b>
              <span>Physical therapy · Michael Torres, PT</span>
            </article>
            <button
              className="primary"
              onClick={() => {
                setShowCalendar(false)

                onNavigate("appointments")
              }}
            >
              View all appointments
            </button>
          </div>
        </ModalDialog>
      )}
    </div>
  )
}

function ShortcutRow({ keys, label }: ShortcutRowProps) {
  return (
    <div className="shortcut-row">
      <span>{label}</span>
      <span className="shortcut-keys">
        {keys.map((key) => (
          <kbd key={key}>{key}</kbd>
        ))}
      </span>
    </div>
  )
}
