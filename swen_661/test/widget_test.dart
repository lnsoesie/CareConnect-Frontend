import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:swen_661/main.dart';
import 'package:swen_661/app_router.dart';

void main() {
  testWidgets('CareConnect displays login screen', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));

    await tester.pumpAndSettle();

    expect(find.text('Login'), findsOneWidget);
    expect(find.text('Forgot Password'), findsOneWidget);
  });

  testWidgets('Forgot Password navigates to reset password screen', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));

    await tester.pumpAndSettle();

    await tester.tap(find.text('Forgot Password'));
    await tester.pumpAndSettle();

    expect(
      find.text('Enter your email to receive a\npassword reset link:'),
      findsOneWidget,
    );
  });

  testWidgets('Login button navigates to home screen', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
    appRouter.go('/login');
    await tester.pumpAndSettle();
    await tester.pumpAndSettle();

    await tester.tap(find.text('Login'));
    await tester.pumpAndSettle();

    expect(find.text('Welcome back!'), findsOneWidget);
  });

  testWidgets('Medications screen displays active medications', (
    WidgetTester tester,
  ) async {
    appRouter.go('/medications');

    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));

    await tester.pumpAndSettle();

    expect(find.text('Lisinopril'), findsOneWidget);
    expect(find.text('Fingolimod'), findsOneWidget);
    expect(find.text('Mark as Taken'), findsNWidgets(2));
  });

  testWidgets('Profile screen displays profile information', (
    WidgetTester tester,
  ) async {
    appRouter.go('/profile');

    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));

    await tester.pumpAndSettle();

    expect(find.text('John Doe'), findsNWidgets(2));
  });

  testWidgets('Messages screen displays messages', (WidgetTester tester) async {
    appRouter.go('/messages');

    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));

    await tester.pumpAndSettle();

    expect(find.text('Messages'), findsWidgets);
  });

  testWidgets('New Message button navigates to new message screen', (
    WidgetTester tester,
  ) async {
    appRouter.go('/messages');

    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));

    await tester.pumpAndSettle();

    await tester.tap(find.text('+ New message'));
    await tester.pumpAndSettle();

    expect(find.text('New Message'), findsOneWidget);
    expect(find.text('Enter provider name'), findsOneWidget);
    expect(find.text('Send Message'), findsOneWidget);
  });

  testWidgets('Doctor messaging sends a valid message and clears input', (
    WidgetTester tester,
  ) async {
    appRouter.go('/doctor-messaging');

    await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
    await tester.pumpAndSettle();

    final messageField = find.byType(TextField);
    expect(messageField, findsOneWidget);

    await tester.enterText(messageField, 'Hello Dr. Smith');
    await tester.tap(find.bySemanticsLabel('Send message'));
    await tester.pump();

    final field = tester.widget<TextField>(messageField);
    expect(field.controller?.text, isEmpty);
  });
}

