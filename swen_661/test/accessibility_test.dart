import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:swen_661/main.dart';
import 'package:swen_661/screens/home_screen.dart';
import 'package:swen_661/screens/login_screen.dart';
import 'package:swen_661/screens/medications_screen.dart';
import 'package:swen_661/screens/profile_screen.dart';

void main() {
  testWidgets('interactive controls expose meaningful semantics', (
    WidgetTester tester,
  ) async {
    final semanticsHandle = tester.ensureSemantics();

    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
    await tester.pumpAndSettle();

    expect(find.bySemanticsLabel('Email address'), findsOneWidget);
    expect(find.bySemanticsLabel('Password'), findsOneWidget);
    expect(find.bySemanticsLabel('Forgot password'), findsWidgets);
    expect(find.bySemanticsLabel('Login'), findsWidgets);

    semanticsHandle.dispose();
  });

  testWidgets('single screen accessibility guideline test', (
    WidgetTester tester,
  ) async {
    final semanticsHandle = tester.ensureSemantics();

    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
    await tester.pumpAndSettle();

    final emailField = find.bySemanticsLabel('Email address');
    final passwordField = find.bySemanticsLabel('Password');
    final visibilityToggle = find.bySemanticsLabel('Show password');
    final forgotPasswordLink = find.bySemanticsLabel('Forgot password');
    final loginButton = find.bySemanticsLabel('Login');

    expect(emailField, findsOneWidget);
    expect(passwordField, findsOneWidget);
    expect(visibilityToggle, findsOneWidget);
    expect(forgotPasswordLink, findsWidgets);
    expect(loginButton, findsWidgets);

    await tester.tap(visibilityToggle);
    await tester.pumpAndSettle();

    expect(find.bySemanticsLabel('Hide password'), findsOneWidget);

    semanticsHandle.dispose();
  });

  testWidgets('login flow meets accessibility guideline function', (
    WidgetTester tester,
  ) async {
    final semanticsHandle = tester.ensureSemantics();

    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
    await tester.pumpAndSettle();

    final emailField = find.bySemanticsLabel('Email address');
    final passwordField = find.bySemanticsLabel('Password');
    final loginButton = find.bySemanticsLabel('Login');
    final forgotPasswordLink = find.bySemanticsLabel('Forgot password');

    expect(emailField, findsOneWidget);
    expect(passwordField, findsOneWidget);
    expect(loginButton, findsWidgets);
    expect(forgotPasswordLink, findsWidgets);

    await tester.tap(emailField);
    await tester.enterText(emailField, 'user@example.com');
    await tester.pump();

    await tester.tap(passwordField);
    await tester.enterText(passwordField, 'Password123!');
    await tester.pump();

    await tester.tap(loginButton.first);
    await tester.pumpAndSettle();

    expect(find.text('CareConnect'), findsOneWidget);

    semanticsHandle.dispose();
  });

  testWidgets('text scales at 200 percent', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
    await tester.pumpAndSettle();
    final normalHeight = tester.getSize(find.text('Login')).height;

    await tester.pumpWidget(
      MaterialApp(
        home: MediaQuery(
          data: const MediaQueryData(textScaler: TextScaler.linear(2.0)),
          child: const LoginScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final scaledHeight = tester.getSize(find.text('Login')).height;
    expect(scaledHeight, greaterThan(normalHeight));
    expect(tester.takeException(), isNull);
  });

  testWidgets(
    'Android tap target guideline: interactive controls meet 48x48 touch targets',
    (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
      await tester.pumpAndSettle();

      final loginButton = find.bySemanticsLabel('Login').first;
      final forgotPasswordLink = find.bySemanticsLabel('Forgot password').first;
      final visibilityToggle = find.bySemanticsLabel('Show password').first;

      final loginSize = tester.getSize(loginButton);
      final forgotPasswordSize = tester.getSize(forgotPasswordLink);
      final visibilitySize = tester.getSize(visibilityToggle);

      expect(loginSize.width, greaterThanOrEqualTo(48));
      expect(loginSize.height, greaterThanOrEqualTo(48));
      expect(forgotPasswordSize.width, greaterThanOrEqualTo(48));
      expect(forgotPasswordSize.height, greaterThanOrEqualTo(48));
      expect(visibilitySize.width, greaterThanOrEqualTo(48));
      expect(visibilitySize.height, greaterThanOrEqualTo(48));
    },
  );

  testWidgets('settings and detail buttons provide feedback', (
    WidgetTester tester,
  ) async {
    final semanticsHandle = tester.ensureSemantics();

    await tester.pumpWidget(const MaterialApp(home: ProfileScreen()));
    await tester.pumpAndSettle();

    final accountSettings = tester.widget<ProfileSettingsButton>(
      find.byType(ProfileSettingsButton).first,
    );
    accountSettings.onTap();
    await tester.pumpAndSettle();
    expect(find.text('Account settings coming soon.'), findsOneWidget);

    await tester.pumpWidget(const MaterialApp(home: HomeScreen()));
    await tester.pumpAndSettle();

    final detailsButton = tester.widget<ElevatedButton>(
      find.widgetWithText(ElevatedButton, 'See details'),
    );
    detailsButton.onPressed?.call();
    await tester.pumpAndSettle();
    expect(find.text('Appointment details coming soon.'), findsOneWidget);

    semanticsHandle.dispose();
  });

  test('text colors meet WCAG contrast thresholds', () {
    expect(
      _contrast(Colors.white, HomeScreen.careConnectBlue),
      greaterThanOrEqualTo(4.5),
    );
    expect(
      _contrast(Colors.white, ProfileScreen.logoutGreen),
      greaterThanOrEqualTo(4.5),
    );
    expect(
      _contrast(
        MedicationsScreen.takenStatusText,
        MedicationsScreen.takenStatusBackground,
      ),
      greaterThanOrEqualTo(4.5),
    );
    expect(
      _contrast(Colors.grey.shade600, Colors.white),
      greaterThanOrEqualTo(4.5),
    );
  });

  testWidgets('Flutter accessibility guidelines are met', (
    WidgetTester tester,
  ) async {
    final semanticsHandle = tester.ensureSemantics();

    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
    await tester.pumpAndSettle();

    expect(tester, meetsGuideline(androidTapTargetGuideline));
    expect(tester, meetsGuideline(textContrastGuideline));

    semanticsHandle.dispose();
  });
}

double _contrast(Color foreground, Color background) {
  final foregroundLuminance = foreground.computeLuminance();
  final backgroundLuminance = background.computeLuminance();
  final lighter = foregroundLuminance > backgroundLuminance
      ? foregroundLuminance
      : backgroundLuminance;
  final darker = foregroundLuminance > backgroundLuminance
      ? backgroundLuminance
      : foregroundLuminance;
  return (lighter + 0.05) / (darker + 0.05);
}
