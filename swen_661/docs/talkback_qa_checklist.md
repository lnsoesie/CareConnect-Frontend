# TalkBack QA Checklist

Use this checklist for a manual Android accessibility check before release.

## Setup

- Enable TalkBack on the Android device or emulator.
- Launch the app with:

```bash
flutter run -d <device-id>
```

- Use swipe navigation and double-tap activation throughout.

## Login Screen

- [ ] Email field is announced as “Email address”.
- [ ] Password field is announced as “Password”.
- [ ] Password visibility icon announces the correct action state.
- [ ] Forgot password link is announced as a button and is focusable.
- [ ] Login button is announced clearly and activates successfully.

## Password Reset Screen

- [ ] Back button announces “Back to login”.
- [ ] Reset instructions are read in a logical order.
- [ ] Email field is announced clearly.
- [ ] Send reset link button announces the action and responds properly.

## Home Screen

- [ ] Screen title reads clearly.
- [ ] Upcoming appointment card is announced with the doctor, date, time, and specialty.
- [ ] “See details” button is announced as a button and activates the expected action.
- [ ] Quick access tiles are announced accurately as “Appointments”, “Messages”, “Medications”, and “Profile”.
- [ ] Bottom navigation items are announced with correct labels and order.

## Appointments Screen

- [ ] Screen title reads clearly.
- [ ] Upcoming and past appointment cards are announced with meaningful content.
- [ ] Appointment action buttons announce the correct action.
- [ ] Navigation to other screens works through TalkBack gestures.

## Messages Screen

- [ ] “New message” button is announced clearly and activates correctly.
- [ ] Message cards announce doctor, specialty, preview, and time.
- [ ] “See details” actions announce the correct conversation target.

## New Message Screen

- [ ] Recipient field is announced clearly.
- [ ] Message input is announced clearly.
- [ ] Add attachment button is announced as a button and activates the action.
- [ ] Send message button is announced clearly and sends the message.

## Profile Screen

- [ ] Profile header and user information are announced in a clear order.
- [ ] Settings buttons are announced with clear labels.
- [ ] Each settings button announces the correct action and shows a meaningful result.
- [ ] Log out button announces “Log out” and activates correctly.

## General Accessibility Checks

- [ ] Focus order follows the visual layout.
- [ ] Buttons and controls are large enough for touch interaction.
- [ ] Text is readable at 200% scaling.
- [ ] No unlabeled or confusing controls are encountered.
- [ ] Dialogs and alerts clearly announce their purpose.

## Evidence

Automated accessibility checks pass with:

```bash
flutter test test/accessibility_test.dart
```

Latest recorded result:

```text
00:02 +5: All tests passed!
```

Manual TalkBack validation should still be completed on a stable Android device or emulator before release.
