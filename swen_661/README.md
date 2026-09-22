# CareConnect

CareConnect is a Flutter healthcare application for managing appointments,
medications, messages, and patient profile information.

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

### Accessibility Checks

Run the dedicated accessibility checks with:

```bash
flutter test test/accessibility_test.dart
```

These tests cover semantics labels, 200% text scaling, 48 x 48 touch targets,
and WCAG contrast ratios. Run the complete test suite with:

```bash
flutter test
```

Before a release, also perform a manual Android TalkBack pass through each
screen, using swipe navigation and double-tap activation.

## Getting Started

Install dependencies and run the application:

```bash
flutter pub get
flutter run
```

For more information, see the [Flutter documentation](https://docs.flutter.dev/).
