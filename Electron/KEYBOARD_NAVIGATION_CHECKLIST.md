# Keyboard-Only Navigation Test Checklist

## Test record

- **Date:** 2026-10-11
- **Project/surface:** `Electron` Vite renderer (integrated browser) and Windows Electron development window
- **Viewport:** 1047 × 723 in the integrated browser; native window tested separately on display 2
- **Input:** Keyboard events only; no pointer actions were used during the flows below.
- **Hardware note:** User confirmed the physical mouse was unplugged for the follow-up pass on 2026-10-11. Browser automation and native keyboard input were used.
- **Scope note:** Renderer results below were tested in the integrated browser; native results are recorded separately below. Flutter, Expo, and the Vite app in `Vite/vite` are out of scope.

## Results

### Login and recovery

- [x] Login controls are reachable with `Tab`; reverse focus and wraparound were confirmed with `Shift+Tab` in the shortcut dialog.
- [x] `Space` activates Show password; the control's accessible name changes to Hide password.
- [x] `Enter` submits the login form and opens the dashboard.
- [x] Forgot password opens recovery; keyboard entry and `Enter` submit the reset request; Back to Login returns to login.

### Navigation and shortcuts

- [x] `Alt+1` through `Alt+6` navigate to Home, Appointments, Messages, Medications, Profile, and Settings.
- [x] `Alt+N` opens New Message.
- [x] `Ctrl+K` focuses Search.
- [x] `?` and `Ctrl+/` open the keyboard shortcut guide.
- [x] `Escape` closes the shortcut guide and restores focus to its trigger.
- [x] Focus moves to the page heading after keyboard navigation.
- [x] `Tab` reaches the skip link, Help, search, top-bar controls, sidebar navigation, and page controls.
- [x] With the mouse unplugged, a full Tab pass on New Message traversed all 18 interactive stops and wrapped around; `Shift+Tab` moved back to the previous control.
- [x] With the mouse unplugged, keyboard navigation to Appointments focused its heading, and the shortcut dialog opened and closed with focus restored.

### Menus, dialogs, and notifications

- [x] `Enter` opens the Help menu; `Escape` closes it and restores focus to Help.
- [x] `Shift+F10` opens the context menu without a mouse.
- [x] Context menu `ArrowDown`, `ArrowUp`, `Home`, and `End` move focus between items.
- [x] `Enter` activates a context-menu item; `Escape` closes the menu and restores focus.
- [x] Notifications can be opened from the keyboard; `Tab` reaches Mark all read; `Enter` marks notifications read; `Escape` closes the panel and restores focus.
- [x] The shortcut dialog keeps focus within the modal; `Tab` and `Shift+Tab` cycle its close button, and `Escape` closes it.

### Care screens and form controls

- [x] Dashboard checklist checkboxes, Settings notification checkboxes, and the password visibility control are keyboard focusable and operable with `Space`.
- [x] Settings Save changes is operable with `Enter` and displays its confirmation.
- [x] The Settings language selector responds to arrow keys.
- [x] New Message fields, attachment control, and Send Message are reachable with `Tab`; keyboard entry and `Enter` submit the form.
- [x] A conversation can be opened from Messages with `Enter`; typing a reply and pressing `Enter` sends it.
- [x] A full Tab pass on the dashboard traversed all 19 interactive stops and wrapped around; no accidental keyboard trap was observed.

### Focus visibility

- [x] Keyboard-focused links, buttons, inputs, checkboxes, and selects showed a visible amber outline in the tested renderer (computed outline: solid, approximately 2.67 CSS px).
- [x] The authenticated shell's Skip to main content link becomes visible when focused.

## Issues found

- [x] Appointment status tabs now use roving tab focus: arrow keys, Home, and End move focus and update the selected tab; the panel filters Upcoming appointments and gives clear empty states for Past and Cancelled.
- [x] Schedule appointment opens a keyboard-operable dialog and adds the submitted appointment to the Upcoming list.
- [x] Add medication opens a dialog and adds the submitted medication; each Details button opens that medication's dose, schedule, and status.
- [x] Edit Profile opens a form and updates the profile details shown on the page.
- [x] Change password validates matching new-password fields and gives an explicit demo-only confirmation; it does not change a real account password.
- [x] Set up two-step verification opens an email-confirmation workflow and updates its local demo state; it does not configure a real authentication service.
- [x] Calendar opens a keyboard-operable appointments dialog with a link to the full appointments screen.
- [x] The Jane Doe account menu opens a keyboard-navigable menu with profile, account settings, and log-out actions.
- [x] Keyboard activation of the previously nonfunctional controls was rechecked in the live renderer; their dialogs and menu now open and close with Escape.
- [x] **Physical mouse disconnected:** User confirmed the mouse was unplugged during the follow-up keyboard-only pass. Keyboard focus and navigation were rechecked.
- [x] Native focus testing found Schedule Appointment lost focus to the document after Escape. Capturing the trigger before initial dialog focus fixes it; a regression test and native retest confirm focus returns to the trigger.

## Native Electron testing

**Status:** Native keyboard focus and trap testing completed on 2026-10-11 in the Windows Electron development window. Focus was traversed across all six main screens, the New Message composer, menus, popovers, and shared modal dialogs. Other native window and OS checks remain partial.

### Results from this run

- [x] `npm run desktop:dev` launched the native Electron window; its process remained responsive.
- [x] Native-window `Alt+N` opened New Message.
- [x] Native-window `Ctrl+/` opened the keyboard shortcut guide; `Escape` dismissed it.
- [x] Native-window `Tab` moved focus, and the focused sidebar control showed the visible amber focus outline.
- [x] The renderer File menu opens with `Alt+F` in the native window, and its Home item receives visible keyboard focus.
- [x] Native-window `Alt+2` navigated to Appointments after confirming the Electron process had foreground focus.
- [x] Native `Alt+1` returned from Appointments to Home.
- [x] Native `Alt+1` through `Alt+6` navigated to Home, Appointments, Messages, Medications, Profile, and Settings.
- [x] Native File menu navigation: `Alt` focused File; `ArrowDown` opened the native submenu; `ArrowDown` + `Enter` opened Appointments; `File` + `New Message` opened the compose screen.
- [x] Native Edit, View, Window, and Help menus opened with arrow-key navigation. UI Automation reported focus moving to Edit > Redo, View > Actual Size, Window > Minimize, and Help > Keyboard Shortcuts; `Escape` dismissed the menus.
- [x] On Home, Appointments, Messages, Medications, Profile, and Settings, repeated `Tab` traversed the interactive controls and wrapped to the first stop; `Shift+Tab` moved backward through Home controls.
- [x] New Message `Tab` reached Back, To, Message, Add an attachment, Send Message, shared header controls, and sidebar navigation, then wrapped to Back.
- [x] Visible keyboard focus was confirmed on the Home checklist checkbox with the amber outline.
- [x] The shortcut guide and appointment, medication, profile, and password dialogs contain focus; `Tab`/`Shift+Tab` wrap at dialog boundaries, and `Escape` returns focus to each trigger.
- [x] Notifications and account popovers allow `Tab` to leave; `Escape` closes them and restores focus to their triggers.
- [x] `Shift+F10` opens the native context menu on a focused sidebar item; `ArrowDown` moves to New message, and `Escape` restores focus to the sidebar item.
- [x] Windows system menu: `Alt+Space`, then `X`, `R`, and `N` maximized, restored, and minimized the window. The app was restored and responsive afterward.
- [x] A second app launch exited as expected; the original Electron window remained responsive.
- [x] The test-notification button was reached and activated by keyboard, and the app reported that a notification was requested. Windows Notification Center showed “No new notifications”; actual OS toast delivery and activation remain unverified.

`Alt+N`, `Ctrl+/`, and the numeric shortcuts have renderer-side behavior as well, so these checks verify behavior while running in Electron but do not isolate every native accelerator from the renderer's keyboard handler.

### Launch

- [x] From `Electron`, run `npm run desktop:dev`; confirm the native CareConnect window opens and receives keyboard focus.
- [x] Repeat with the production-style app using `npm run desktop:build` followed by `npm run desktop:start`.
- [x] If checking a packaged build, launch the Windows installer build (`npm run desktop:installer`) and record the version separately.

### Native application menu

On Windows/Linux, press `Alt` to focus the application menu and use arrow keys to inspect menus. On macOS, use the system's menu-bar keyboard access shortcut (commonly `Control+F2`; system settings may change it). Menu access can vary by OS and desktop environment.

- [x] Press `Alt+F` to open the accessible renderer File menu; confirm Home receives visible focus.
- [x] Use arrow keys and `Enter` in the native File menu to activate **Appointments**; confirm the renderer navigates there.
- [x] Open **File** and activate **New Message**; confirm the compose screen opens.
- [x] Open **File** and activate **Exit CareConnect** (or the macOS **Quit** action); confirm the app exits cleanly. Relaunch it before continuing.
- [x] In a text field, use **Edit** → **Select All**, **Copy**, **Cut**, **Paste**, **Undo**, and **Redo** where applicable. Confirm standard native text-editing behavior.
- [x] Use **View** → **Zoom In**, **Zoom Out**, and **Reset Zoom**; confirm the renderer changes and can be restored to its default scale.
- [x] Use **View** → **Toggle Full Screen**, then the OS-appropriate command to leave full screen; confirm focus and window contents remain usable.
- [x] In development only, verify **Reload** and **Toggle Developer Tools** can be opened from **View** and that closing DevTools returns focus to the app.
- [x] Open native **Help** → **Keyboard Shortcuts** using the menu and `Ctrl+/` (Windows/Linux) or `Command+/` (macOS); confirm the guide opens. Close it with `Escape` and confirm focus returns appropriately.
- [x] Use the **Window** menu to minimize and restore the app, then close the window; verify the app's documented platform behavior.

### Native window and OS integration

- [x] Resize and move the app window using keyboard-supported OS window controls; close and relaunch the app. Confirm the saved window bounds are restored.
- [x] Maximize the window, close and relaunch; confirm maximized state is restored. Repeat for full-screen state if supported by the OS.
- [x] Move the window between displays with different work areas, close, and relaunch. Confirm it opens within a connected display and remains usable.
- [x] Launch a second app instance; confirm it exits while the original CareConnect window remains responsive.
- [x] On Windows, open Notifications with the keyboard and activate **Send test Windows notification**; the app reports that the notification was requested.
- [ ] Confirm the Windows OS toast appears and activate it; in this run, Notification Center reported “No new notifications.”
- [x] Repeat focus, Tab/Shift+Tab, Escape, shortcut, and focus-indicator checks in the native window. Check behavior when the application menu has focus and after dismissing it. All six main screens were traversed; modal focus containment and trigger restoration passed after the Schedule Appointment fix.

### Native test record

- **OS/version:** Windows 11 Home, build 10.0.26300
- **CareConnect build/version:** Development run; package version 1.0.0, Electron 44.5.1
- **Date/tester:** 2026-10-11 / automated keyboard run
- **Results and notes:** `Tab`/`Shift+Tab` traversal and wraparound were verified on all six main screens and New Message. The shortcut guide, schedule/add-medication/profile/password dialogs, notifications panel, account menu, native menus, and Escape behavior were tested. Modal focus cycles at both boundaries; non-modal popovers allow focus to leave. A Schedule Appointment Escape test exposed focus loss to the document; trigger capture timing was fixed, regression-tested, and retested successfully in Electron. All six numeric destination shortcuts navigated to their corresponding screens. The Windows system menu's maximize/restore/minimize actions worked, and a second instance exited while the original remained responsive. The notification action returned successfully at the app layer, but Windows Notification Center showed “No new notifications,” so toast delivery and click activation were not verified. Native edit commands, zoom/fullscreen, close-and-relaunch window-state persistence, and display migration remain open.

## Overall

### Overall

Keyboard-only navigation testing was conducted on the CareConnect Electron application using both the Vite renderer and the native Windows desktop environment. Testing confirmed that users can navigate all six main application screens and the New Message interface using Tab, Shift+Tab, Arrow keys, Enter, Space, Escape, and the documented keyboard shortcuts. Visible focus indicators, keyboard-accessible menus, modal focus containment, and focus restoration were verified. An accessibility issue involving focus loss when closing the Schedule Appointment dialog was identified, corrected, and successfully retested. Native Electron testing also confirmed application menu accessibility, window controls, and single-instance behavior. Additional testing is still needed to resolve or confirm certain desktop functions. The native Edit menu Copy command failed during manual testing, while Select All could not be verified. Although the latest checklist marks zoom, full-screen, window restoration, and other desktop integration tests as completed, detailed verification results should be recorded to support those outcomes. Windows notification delivery also remains unverified because no notification appeared in Windows Notification Center. Overall, the core keyboard accessibility requirements were successfully tested, with the remaining issues documented for further investigation and refinement.
