# CareConnect React Native Application

CareConnect is a React Native healthcare application built with Expo and TypeScript. It includes features for managing appointments, medications, messages, and patient profile information.

This project is located in `Expo/CareConnectAndroid` within the CareConnect-Frontend repository.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Testing

The React Native application uses Jest and React Native Testing Library for automated testing.

To run the complete test suite:

```bash
npm test
```

To run the tests and generate a coverage report:

```bash
npm test -- --coverage
```

The Week 6 test suite includes accessibility testing for component labels, roles, hints, touch targets, and other accessibility behavior.

The most recent test run completed successfully with 29 passing tests. Test coverage exceeded the required 60% threshold.
### Test Coverage Results

The most recent React Native coverage report showed:

- Statements: 93.82%
- Branches: 79.16%
- Functions: 83.92%
- Lines: 94.87%

Coverage evidence for Week 6 is stored in the project documentation/screenshots folder.

## Accessibility

CareConnect includes React Native accessibility support using properties such as `accessible`, `accessibilityLabel`, `accessibilityRole`, and `accessibilityHint`.

Accessibility improvements include:

- Meaningful screen-reader labels and roles
- Accessibility hints for interactive controls
- Minimum 44 x 44 point touch targets
- Improved text and interface color contrast
- Dynamic text scaling support
- Accessible bottom navigation
- Medication status announcements for screen readers

Manual accessibility testing was performed across iOS and Android as part of the team testing process. VoiceOver testing was performed on an iPhone, and Android testing was completed by other team members. Automated React Native accessibility tests are also included in the Jest test suite.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
