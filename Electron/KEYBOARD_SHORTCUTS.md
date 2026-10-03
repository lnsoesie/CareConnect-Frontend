# CareConnect Keyboard Shortcuts

CareConnect supports application-wide keyboard shortcuts for navigation, common actions, and accessible menu operation.

## Application navigation

| Shortcut | Action |
| --- | --- |
| `Alt` + `1` | Open Home |
| `Alt` + `2` | Open Appointments |
| `Alt` + `3` | Open Messages |
| `Alt` + `4` | Open Medications |
| `Alt` + `5` | Open Profile |
| `Alt` + `6` | Open Settings |

## Common actions

| Windows and Linux | macOS | Action |
| --- | --- | --- |
| `Alt` + `N` | `Option` + `N` | Compose a new message |
| `Ctrl` + `K` | `Command` + `K` | Move focus to Search |
| `?` | `?` | Open the keyboard-shortcut guide |
| `Ctrl` + `/` | `Command` + `/` | Open the keyboard-shortcut guide |
| `Shift` + `F10` | `Shift` + `F10` | Open the CareConnect context menu at the focused control |
| `Escape` | `Escape` | Close the active context menu or shortcut dialog |

Navigation shortcuts and the Search shortcut continue to work when a form field is focused. Shortcuts that open the guide (`?` and `Ctrl`/`Command` + `/`) are disabled while typing in an input, text area, select control, or editable region.

## Context menu

Open the context menu by right-clicking inside the authenticated application or pressing `Shift` + `F10`.

| Key | Action |
| --- | --- |
| `Arrow Down` | Focus the next menu item |
| `Arrow Up` | Focus the previous menu item |
| `Home` | Focus the first menu item |
| `End` | Focus the last menu item |
| `Enter` or `Space` | Activate the focused menu item |
| `Escape` | Close the menu and restore focus |

The context menu provides these actions:

- Go to Home
- New message
- View profile
- Settings
- Open the keyboard-shortcut guide
- Sign out

## Shortcut guide

Press `?` or `Ctrl`/`Command` + `/` to open the in-app shortcut guide.

| Key | Action |
| --- | --- |
| `Tab` | Move to the next control within the dialog |
| `Shift` + `Tab` | Move to the previous control within the dialog |
| `Enter` or `Space` | Activate the focused control |
| `Escape` | Close the dialog and restore focus |

Keyboard focus is contained within the shortcut dialog while it is open.

## Standard keyboard behavior

CareConnect also supports standard browser and operating-system keyboard behavior:

| Key | Action |
| --- | --- |
| `Tab` | Move to the next interactive control |
| `Shift` + `Tab` | Move to the previous interactive control |
| `Enter` | Activate buttons and submit forms |
| `Space` | Activate buttons, checkboxes, and switches |
| `Arrow keys` | Change the selected option in supported controls |

## Accessibility

- A **Skip to main content** link appears when it receives keyboard focus.
- Focus moves to the page heading after application navigation.
- Every interactive control has a visible focus indicator.
- Context menus and dialogs restore focus when closed with `Escape` or their close control.
- Shortcut functionality does not rely on timing or multi-step key sequences.

## Browser and operating-system conflicts

Some browser extensions, assistive technologies, operating systems, or managed-device policies may reserve a shortcut before CareConnect receives it. If a shortcut is unavailable, all actions remain accessible through the sidebar, context menu, search field, and visible controls.
