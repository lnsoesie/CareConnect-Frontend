import 'package:flutter/material.dart';

import 'package:go_router/go_router.dart';

class DoctorMessagingScreen extends StatefulWidget {
  const DoctorMessagingScreen({super.key});

  @override
  State<DoctorMessagingScreen> createState() => _DoctorMessagingScreenState();
}

class _DoctorMessagingScreenState extends State<DoctorMessagingScreen> {
  static const Color careConnectBlue = Color(0xFF2C67BA);

  final TextEditingController _messageController = TextEditingController();

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final message = _messageController.text.trim();

    if (message.isEmpty) {
      return;
    }

    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Semantics(
                    label: 'Back to messages',
                    hint: 'Double tap to return to messages',
                    button: true,
                    child: IconButton(
                      onPressed: () {
                        context.go('/messages');
                      },
                      constraints: const BoxConstraints(
                        minWidth: 48,
                        minHeight: 48,
                      ),
                      icon: const Icon(
                        Icons.arrow_back,
                        color: careConnectBlue,
                      ),
                      iconSize: 26,
                    ),
                  ),

                  const SizedBox(width: 4),

                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Dr. Sarah Smith',
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w600,
                          color: careConnectBlue,
                        ),
                      ),
                      Text(
                        'Neurology',
                        style: TextStyle(fontSize: 14, color: Colors.black87),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const Divider(height: 1),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 40,
                ),
                child: Column(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Container(
                        constraints: const BoxConstraints(maxWidth: 230),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'Your test results are ready, '
                          'please let me know if you have '
                          'any questions.',
                          style: TextStyle(fontSize: 16, height: 1.3),
                        ),
                      ),
                    ),

                    const SizedBox(height: 28),

                    Align(
                      alignment: Alignment.centerRight,
                      child: Semantics(
                        label:
                            'Your message: Thank you, Dr. Smith. '
                            'I have a question but prefer to discuss '
                            'it during the upcoming visit.',
                        child: Container(
                          constraints: const BoxConstraints(maxWidth: 250),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 14,
                          ),
                          decoration: BoxDecoration(
                            color: careConnectBlue,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'Thank you, Dr. Smith. I have a '
                            'question but prefer to discuss it '
                            'during the upcoming visit.',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                              height: 1.3,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            Container(
              margin: const EdgeInsets.all(16),
              constraints: const BoxConstraints(minHeight: 68),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.black54),
              ),
              child: Row(
                children: [
                  Semantics(
                    label: 'Attach file',
                    hint: 'Double tap to attach a file',
                    button: true,
                    child: IconButton(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) => const AlertDialog(
                            title: Text('Coming soon'),
                            content: Text('Attachment feature coming soon.'),
                          ),
                        );
                      },
                      constraints: const BoxConstraints(
                        minWidth: 48,
                        minHeight: 48,
                      ),
                      icon: const Icon(Icons.attach_file),
                      iconSize: 24,
                    ),
                  ),

                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      minLines: 1,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        labelText: 'Message',
                        hintText: 'Enter a message to send',
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(horizontal: 8),
                      ),
                    ),
                  ),

                  Semantics(
                    label: 'Send message',
                    hint: 'Double tap to send your message',
                    button: true,
                    child: IconButton(
                      onPressed: _sendMessage,
                      constraints: const BoxConstraints(
                        minWidth: 48,
                        minHeight: 48,
                      ),
                      icon: const Icon(Icons.send_outlined),
                      iconSize: 25,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
