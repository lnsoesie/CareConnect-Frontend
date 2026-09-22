# CareConnect

CareConnect is a Flutter healthcare application that gives patients one place
to review appointments, manage medications, communicate with providers, and
view their profile information.

## Features

- Login and password-reset flows
- Home dashboard with quick access to patient tasks
- Appointment overview
- Medication list with medication status actions
- Provider messaging and new-message composition
- Doctor messaging conversation view
- Patient profile and account actions
- Keyboard navigation, screen-reader semantics, and scalable text support

## Tech Stack

- Flutter and Dart
- Material widgets
- `go_router` for navigation
- `flutter_riverpod` for application state

## Requirements

- Flutter SDK compatible with Dart `^3.12.0`
- An Android emulator, iOS simulator, desktop target, or browser supported by
	your Flutter installation

Check the local installation before running the app:

```bash
flutter doctor
```

## Getting Started

Install dependencies and launch the application:

```bash
flutter pub get
flutter run
```

To target a specific device, list available devices first:

```bash
flutter devices
flutter run -d <device-id>
```

## Project Structure

```text
lib/
	main.dart                 Application entry point
	app_router.dart            Route definitions
	providers/                 Riverpod providers
	screens/                   Login and patient-facing screens
test/                        Widget, provider, and accessibility tests
docs/                        QA notes and accessibility evidence
```

## Testing

Run the complete test suite with:

```bash
flutter test
```

The latest full-suite run passes 18 tests. Generate the LCOV coverage report
with:

```bash
flutter test --coverage
```

The current report records 367 of 493 executable lines covered, or 74.44%
line coverage. The generated report is written to `coverage/lcov.info`.

Run the focused accessibility suite with:

```bash
flutter test test/accessibility_test.dart
```

The Flutter accessibility guideline tests verify the Android tap-target and
text-contrast guidelines:

```dart
meetsGuideline(androidTapTargetGuideline)
meetsGuideline(textContrastGuideline)
```

The same suite also checks meaningful semantics labels, the login flow, 200%
text scaling, 48 x 48 touch targets, WCAG contrast ratios, and feedback from
settings and detail actions.

## Accessibility

CareConnect includes the following accessibility features:

- **Screen reader semantics:** Interactive controls expose meaningful labels,
	roles, and action hints through Flutter `Semantics` widgets. This includes
	form fields, password visibility, navigation, appointment and message
	actions, attachments, medication actions, profile settings, and logout.
- **Native navigation semantics:** `BottomNavigationBar` items use descriptive
	labels for Home, Appointments, Messages, Medications, and Profile.
- **TalkBack support:** Android controls expose focusable and clickable roles
	to TalkBack. The login flow has been checked on the Android emulator with
	TalkBack enabled.
- **Keyboard navigation:** Routed content uses
	`ReadingOrderTraversalPolicy`, so focus follows the visual order. Native
	Flutter controls support keyboard activation, and custom quick-access tiles
	can receive focus.
- **Text scaling:** Layouts are tested with a 200% text scaler so enlarged text
	remains measurable and usable.
- **Touch targets:** Custom buttons and icon buttons use a minimum target size
	of 48 x 48 logical pixels. Larger navigation and quick-access controls retain
	their existing dimensions.
- **Color contrast:** Text color pairs are checked against a minimum WCAG
	contrast ratio of 4.5:1. Production constants are used for the medication
	status and logout colors tested by the contrast checks.

## TalkBack Verification

Before a release, perform a manual Android TalkBack pass on an emulator or
physical device.

### Setup

1. Enable TalkBack on the Android device or emulator:
   Settings > Accessibility > TalkBack.
2. Launch the app from the IDE or terminal with:

```bash
flutter run -d <device-id>
```

3. Use swipe navigation and double-tap activation to move through the app.

### Checklist

- Login screen: confirm the fields are announced as “Email address” and
  “Password”, and the login controls are described clearly.
- Password visibility toggle: confirm the control announces “Show password” or
  “Hide password” and responds correctly when activated.
- Forgot password link: confirm it is announced as a button and behaves as an
  action.
- Home screen: confirm the quick-access tiles and appointment summary are read
  clearly and in a logical order.
- Appointments, Messages, and Profile screens: confirm navigation and action
  buttons are announced and activated with expected results.
- Bottom navigation: confirm each tab label is announced correctly and the
  active tab is clear.

### Current evidence

The project’s automated accessibility suite currently passes:

```bash
flutter test test/accessibility_test.dart
```

with the latest recorded result:

```text
00:02 +8: All tests passed!
```

A live TalkBack session was also attempted on the Android emulator, but the
emulator connection dropped before a full manual pass could be completed.
Manual TalkBack verification should therefore be completed on a stable Android
device or emulator before release.

For more information, see the [Flutter documentation](https://docs.flutter.dev/).
