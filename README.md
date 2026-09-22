# SWEN-661: CareConnect User Interface
## Project Description
This is the repository for the CareConnect User Interface implementation for users with Cerebral Palsy and Multiple Sclerosis (MS). This will involve producing a customized user interface for the CareConnect mobile application for care recipients with cerebral palsy and/or MS, ensuring that the interface meets relevant accessibility concerns for said users as laid out under WCAG 2.2 standards.
## Team Members
- Vindhya Sood - GitHub: pristine-cpu
- Ian Ard - GitHub: ianscottard
- Lucrece Nsoesie - GitHub: lnsoesie
- Ashvini Tandale - GitHub: CybernetCatgirl

## Team Charter
The team charter can be found at the following link: https://umuc365-my.sharepoint.com/:w:/g/personal/vsood_student_umgc_edu/IQAzqldJc9OIT4xptp6mU8mPATRAUvpZWsxfeGpoIplOEbI?e=1UQcwP

## Setup

Once you have cloned this repo, you can set up each user interface with the instructions below.

{{ROOT}} refers to the root folder the project was cloned to.

### Prerequisites
- Elevated Powershell or other command line interface
- Node.js LTS: https://nodejs.org/
- Flutter SDK: https://docs.flutter.dev/get-started/install
- React Native Command Line Interface: https://reactnative.dev/docs/environment-setup
- Expo Command Line Interface: https://docs.expo.dev/get-started/installation/
- Electron: https://www.electronjs.org/docs/latest/tutorial/installation
- Vite with React: https://vitejs.dev/guide/
- Android device with Expo Go: https://docs.expo.dev/get-started/set-up-your-environment/?mode=expo-go

### Flutter Mobile UI
- Navigate to {{ROOT}}\care_connect_flutter in your command line interface
- Check your devices with `flutter devices`; if none are available, either activate an Android emulator or connect a debug-capable developer mode Android device
- Activate the application with `flutter run` to run the application on your connected mobile device

### Expo Mobile UI
- Navigate to {{ROOT}}\Expo\CareConnectAndroid in your command line interface
- Download dependencies with `npm install`
- Activate Expo Go on your mobile device
- Run the Expo application with `npm start`
- Scan the provided QR code with your Expo Go device to run the application

### Electron Desktop UI
- Navigate to {{ROOT}}\Electron in your command line interface
- Download dependencies with `npm install`
- Run Electron with `npm start` to open a new desktop window with the Electron UI

### Vite Web UI
- Navigate to {{ROOT}}\Vite\vite in your command line interface
- Run `npm install` to download dependencies
- Run Vite with `npm run dev` to start the local web server
- Navigate to the shown localhost page in your browser to access the web interface

# Flutter Documentation

**Team 8:** Ian Ard, Lucrece Nsoesie, Vindhya Sood

## Project Description

CareConnect is a Flutter-based mobile application designed to help patients manage common healthcare activities in one application. The application was implemented this week based on the CareConnect interface designed in Figma last week.

The application has a total of 9 screens:

- Login
- Reset Password
- Home
- Appointments
- Medications
- Messages
- Doctor Messaging
- New Message
- Profile

The application uses GoRouter for navigation and Riverpod for state management. Various accessibility features were implemented throughout the application, including semantic labels to help users who use screen readers and appropriately sized interactive elements.

## How to Run the App

The CareConnect app is a Flutter project that can be run from VS Code.

The basic Flutter process is to get the dependencies, select a device or emulator, and run `flutter run`.

### 1. Open the CareConnect Project

Open the folder containing the CareConnect project. It will contain folders and files similar to those below:

```text
care_connect
├── .dart_tool
├── .idea
├── android
├── ios
└── lib
    └── main.dart
```

### 2. Open the Terminal in the Project Folder

In VS Code, select:

**Terminal → New Terminal**

Make sure the terminal is opened in the CareConnect project folder.

### 3. Check That Flutter Is Installed

Run:

```bash
flutter doctor
```

`flutter doctor` verifies that the development environment is configured properly.

### 4. Install CareConnect Dependencies

Run:

```bash
flutter pub get
```

This downloads the packages listed in `pubspec.yaml`.

### 5. Check Available Devices

Run:

```bash
flutter devices
```

You should see the devices available on your computer, which may include:

1. Chrome
2. Desktop
3. Android Emulator
4. iOS Simulator, when using macOS

### 6. Run CareConnect

Run:

```bash
flutter run
```

This builds and launches the application on the selected emulator, simulator, or connected device.

## How to Run Tests

The repository contains both unit tests and widget tests. The unit tests verify medication state management logic, including marking medications as taken and resetting medication status.

The widget tests verify application screens, displayed content, button interactions, and navigation.

To run all unit and widget tests in the VS Code terminal:


flutter test


This reports whether the tests pass or fail.

To run the tests and generate coverage data:

flutter test --coverage


This determines which lines of the application code were executed by the tests. The coverage results are stored in:


coverage/lcov.info


To generate the HTML coverage report, run:


genhtml coverage/lcov.info -o coverage/html


To open the generated coverage report on macOS, run:


open coverage/html/index.html

## Link to Test Coverage Report

https://github.com/ianscottard/CareConnect-Frontend-Team-8/blob/main/swen_661/coverage/html/index.html

Current test coverage: **65.5%**

## Flutter Accessibility Testing

The Flutter application includes accessibility support and automated accessibility testing for WCAG-related requirements.

Accessibility features and tests include:

- Meaningful semantic labels for interactive elements
- Screen-reader semantics using Flutter `Semantics` widgets
- Minimum 48 x 48 logical pixel touch targets
- 200% text scaling testing
- Keyboard and focus-order support
- WCAG color contrast testing
- Flutter built-in `androidTapTargetGuideline` testing
- Flutter built-in `textContrastGuideline` testing

The complete Flutter test suite currently contains **15 passing tests**.

Run the Flutter accessibility-specific tests with:

```bash
flutter test test/accessibility_test.dart
```

Run the complete Flutter test suite with:

```bash
flutter test
```

Android TalkBack testing was performed as part of the Flutter accessibility work. The required Flutter screen-reader demonstration video is submitted separately with the assignment materials.

## Known Issues or Limitations

### Known Issues

Dark mode is not yet implemented, which may prove an issue to some users who have a need for darker screens for visual accessibility.

Several buttons on the home screen do not currently have navigation results defined, and thus when pressed do not lead anywhere. This both makes the buttons useless and provides a lessened degree of test coverage due to the buttons being functionally pointless to test while still being considered in test coverage analysis.

Issues such as performance, startup, and device detection related to the emulator on Android Studio may occur when running CareConnect from VS Code.

### Limitations

CareConnect is currently a prototype and does not represent a fully implemented system. User research was conducted using a total of 3 mock users and personas, which does not realistically represent the full range of potential users.

Currently, the CareConnect application is entirely a frontend application, with no functional backend. The login screen, for example, automatically redirects to the home screen regardless of a "valid" login due to not actually currently storing any user data (`login_screen.dart`).

Messaging functionality currently only consists of a visual prototype. Due to the lack of a backend, no actual messages may be exchanged at this time; as such, the page largely serves as a prototype proof-of-concept design.

At the time of writing, the bottom navigation bar is copy-pasted across multiple pages. By converting it to a singular widget, the navigation bar will be more modular and quicker and easier to test.

# React Native Documentation

## Project Description

The React Native version of CareConnect is a healthcare mobile application built with React Native, Expo, and TypeScript. It includes screens for managing appointments, medications, messages, and patient profile information.

The React Native project is located at:

```text
Expo/CareConnectAndroid
```

## How to Run the React Native App

From the root of the repository, navigate to the React Native project:

```bash
cd Expo/CareConnectAndroid
```

Install the required dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Follow the Expo terminal instructions to open the application using an available device, simulator, emulator, or Expo Go.

For iOS:

```bash
npx expo start --ios
```

For Android:

```bash
npx expo start --android
```

## React Native Testing

The React Native application uses Jest and React Native Testing Library for automated testing.

Run the complete test suite with:

```bash
npm test
```

Run the tests and generate a coverage report with:

```bash
npm test -- --coverage
```

The most recent React Native test run completed successfully with **29 passing tests**.

### React Native Test Coverage

The most recent coverage results were:

- Statements: **93.82%**
- Branches: **79.16%**
- Functions: **83.92%**
- Lines: **94.87%**

These results exceed the assignment requirement of 60% test coverage.

## React Native Accessibility

Accessibility features implemented in the React Native application include:

- Meaningful screen-reader labels and roles
- Accessibility hints for interactive controls
- `accessible`, `accessibilityLabel`, `accessibilityRole`, and `accessibilityHint` properties
- Minimum 44 x 44 point touch targets
- Improved text and interface color contrast
- Dynamic text scaling support
- Accessible bottom navigation
- Screen-reader announcements for medication status changes

Manual accessibility testing was performed across iOS and Android as part of the team testing process. VoiceOver testing was performed on an iPhone, and Android testing was completed by other team members. Automated React Native accessibility tests are also included in the Jest test suite.

A React Native iOS VoiceOver demonstration was recorded as part of the Week 6 accessibility testing evidence.




## Team Member Contributions This Week

| Team Member | Contributions |
| --- | --- |
| **Vindhya** | Refined the CareConnect Screens which include login, reset password, reset password, dashboard/home screen, appointment, messages, medications, profile, new message and doctor message. <br><br> Updated README *"How to run the app"* and *"known issues and limitations".* <br><br> 15 minutes of video recording. |
| **Ian** | Additional work on documentation, to further analyze limitations and potential issues. <br><br> Analysis of codebase and test suite results to note additional limitations and areas of improvement. |
| **Lucrece** | Completed preliminary CareConnect codes in iOS for screens which include login, reset password, home screen, messages, doctor messaging, new message and doctor message. <br><br> Included some initial tests and coverage results obtained into a pull request to GitHub. |

## Using AI for This Assignment

- AI provided code suggestions for the screens while I implemented the different application screens. I reviewed and adapted these suggestions to maintain a consistent code structure and design across the CareConnect application.

- AI also assisted in finding solutions whenever added codes would not produce expected results. AI was used to help interpret the errors and suggest possible solutions. The suggestions were reviewed and necessary code changes were made and tested to confirm that the issues were resolved.

- AI was used to suggest unit and widget test cases for the CareConnect application. For example, I described the Riverpod medication state management functionality, and AI suggested testing both marking a medication as taken and resetting its status. AI also helped identify widget test cases for navigation, such as verifying that the login button opens the home screen, Forgot Password opens the Reset Password screen, and New Message opens the correct messaging screen. The suggested tests were reviewed, implemented, and run using Flutter to verify if they pass.

- Figma Make was used for creating screen visuals where necessary, including several icons used in the final product.
