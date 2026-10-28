# CareConnect Desktop App

CareConnect is a React application built with Vite and Tailwind CSS. It can run in a browser or as a desktop app powered by Electron.

This README explains how to install, run, test, build, and deploy the CareConnect desktop application.

## Requirements

- Node.js
- npm
- Git
- Windows for building the Windows installer

Install dependencies from the project root:

```bash
npm install
```

## Run the Web App

To launch the application in a browser:

```bash
npm run dev
```

## Run the Desktop App

For development, launch Electron with the Vite renderer:

```bash
npm run desktop:dev
```

The command uses the Vite server at `PORT` (default `8443`) when available and starts one if needed.

To build the renderer and launch the production-style desktop application locally:

```bash
npm run desktop:build
npm run desktop:start
```

## Window State

The desktop app remembers its last window position and size, including maximized or fullscreen state.

Saved bounds are adjusted to fit a connected display, so moving between monitors does not leave the window off-screen.

Window state is stored in Electron's per-user data folder.

## Testing Instructions

### Run Jest Tests

```bash
npm test
```

### Run Jest Tests With Coverage

```bash
npm test -- --coverage --runInBand
```

### Latest Test Results

| Metric | Result |
|---|---|
| Test suites | 4 passed |
| Total tests | 75 passed |
| Statement coverage | 86.41% |
| Branch coverage | 75.81% |
| Function coverage | 81.13% |
| Line coverage | 87.86% |

All 75 tests passed during the latest recorded test run.

### Testing Evidence

Testing evidence includes screenshots of the Jest test summary and code coverage results.

## Build and Deployment Instructions

### Step 1: Install Dependencies

From the Electron project directory:

```bash
npm install
```

### Step 2: Verify the Application

Run the automated tests:

```bash
npm test -- --coverage --runInBand
```

Check the application build and TypeScript configuration:

```bash
npm run build
npm run typecheck
```

Resolve any reported errors before preparing a release.

### Step 3: Build the Desktop Application

```bash
npm run desktop:build
```

### Step 4: Verify the Production-Style Application

```bash
npm run desktop:start
```

Confirm that the desktop application launches and that its primary features work as expected.

### Step 5: Generate the Windows Installer

On a Windows computer, run:

```bash
npm run desktop:installer
```

This creates an NSIS installer in the `release/` directory.

The installer creates Start Menu and desktop shortcuts.

The Windows application ID is `com.careconnect.desktop`, matching the ID set by Electron for notification identity.

### Step 6: Test the Installer

On a Windows computer:

1. Locate the generated installer in `release/`.
2. Run the installer.
3. Launch CareConnect from the desktop or Start Menu.
4. Verify application navigation and major features.
5. Confirm that the application launches without a development server.

### Step 7: Distribute the Application

After successful validation, the installer can be distributed through an approved release process.

The Windows installer is the deployment artifact. The source code repository alone does not install the desktop application.

## Windows Notifications

The application's Windows identity is configured using `com.careconnect.desktop`.

The application must still send notifications, and Windows notification settings must allow them, for toast notifications to appear.

The header's **Notifications** button opens the in-app notification list.

In the Windows desktop application, use **Send test Windows notification** in that panel to verify native notifications.

Windows notification settings can suppress notifications even when the app sends them.

## Quality Assurance

The project includes automated testing and accessibility-focused improvements.

The latest Jest results demonstrate:

- 75 passing tests
- Four passing test suites
- Statement coverage above 85%
- Branch, function, and line coverage above 75%

## Repository

https://github.com/lnsoesie/CareConnect-Frontend

## Deployment Status

The project includes commands for building and generating a Windows installer. Successful production installer generation and deployment should be verified before marking deployment as complete.