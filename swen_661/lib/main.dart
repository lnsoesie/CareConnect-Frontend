import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app_router.dart';

void main() {
  runApp(const ProviderScope(child: CareConnectApp()));
}

class CareConnectApp extends StatelessWidget {
  const CareConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'CareConnect',
      routerConfig: appRouter,
      builder: (context, child) {
        return FocusTraversalGroup(
          policy: ReadingOrderTraversalPolicy(),
          child: child ?? const SizedBox.shrink(),
        );
      },
    );
  }
}
