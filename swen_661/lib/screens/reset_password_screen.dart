import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ResetPasswordScreen extends StatelessWidget {
  const ResetPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
        leading: Semantics(
              label: 'Back to login',
              hint: 'Double tap to return to login',
          button: true,
          child: IconButton(
            icon: const Icon(Icons.arrow_back),
            constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
            onPressed: () {
              context.go('/login');
            },
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            children: [
              const SizedBox(height: 150),

              // Reset password instructions
              Semantics(
                label: 'Enter your email to receive a password reset link',
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F1F3),
                    borderRadius: BorderRadius.circular(3),
                  ),
                  child: const Text(
                    'Enter your email to receive a\npassword reset link:',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),

              const SizedBox(height: 48),

              // Email field
              TextField(
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  labelText: 'Email address',
                  hintText: 'Enter your email address',
                  border: OutlineInputBorder(),
                ),
              ),

              const SizedBox(height: 24),

              // Send Reset Link button
              Semantics(
                label: 'Send reset link',
                hint: 'Double tap to send the password reset link',
                button: true,
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const AlertDialog(
                          title: Text('Coming soon'),
                          content: Text(
                            'Password reset link request coming soon.',
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2C67BA),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(48, 48),
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.zero,
                      ),
                    ),
                    child: const Text(
                      'Send Reset Link',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
