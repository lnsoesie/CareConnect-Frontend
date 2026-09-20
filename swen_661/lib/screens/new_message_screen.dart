import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NewMessageScreen extends StatelessWidget {
  const NewMessageScreen({super.key});

  static const Color careConnectBlue = Color(0xFF2C67BA);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Semantics(
          label: 'Back to messages',
          hint: 'Double tap to return to messages',
          button: true,
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black),
            constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
            onPressed: () {
              context.go('/messages');
            },
          ),
        ),
        title: const Text(
          'New Message',
          style: TextStyle(
            color: careConnectBlue,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'To',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 8),
              const TextField(
                decoration: InputDecoration(
                  labelText: 'Message recipient',
                  hintText: 'Enter provider name',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Message',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 8),
              const TextField(
                maxLines: 6,
                decoration: InputDecoration(
                  labelText: 'Message',
                  hintText: 'Type the message to send',
                  border: OutlineInputBorder(),
                ),
              ),
              Semantics(
                label: 'Add attachment',
                hint: 'Double tap to attach a file',
                button: true,
                child: TextButton.icon(
                  style: TextButton.styleFrom(
                    minimumSize: const Size(48, 48),
                  ),
                  onPressed: () {
                    // Attachment functionality can be connected later.
                  },
                  icon: const Icon(Icons.attach_file, color: careConnectBlue),
                  label: const Text(
                    'Add attachment',
                    style: TextStyle(
                      color: careConnectBlue,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: Semantics(
                  label: 'Send new message',
                  hint: 'Double tap to send the message',
                  button: true,
                  child: ElevatedButton(
                    onPressed: () {
                      context.go('/messages');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: careConnectBlue,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(48, 48),
                    ),
                    child: const Text(
                      'Send Message',
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
