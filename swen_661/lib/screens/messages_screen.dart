import 'package:flutter/material.dart';

import 'package:go_router/go_router.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  static const Color careConnectBlue = Color(0xFF2C67BA);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Messages',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: careConnectBlue,
                ),
              ),

              const SizedBox(height: 44),

              Center(
                child: Semantics(
                  label: 'Create new message',
                  hint: 'Double tap to compose a message',
                  button: true,
                  child: SizedBox(
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () {
                        context.go('/new-message');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: careConnectBlue,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(48, 48),
                        padding: const EdgeInsets.symmetric(horizontal: 28),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      child: const Text(
                        '+ New message',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 90),

              const MessageCard(
                doctorName: 'Dr. Barrow',
                specialty: 'Gastroenterology',
                messagePreview: 'Your test results are ready',
                time: 'Today 09:00 AM',
              ),

              const SizedBox(height: 56),

              const MessageCard(
                doctorName: 'Dr. Smith',
                specialty: 'Neurology',
                messagePreview: 'Please let us know if...',
                time: 'Yesterday 03:00 PM',
              ),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 2,
        onTap: (index) {
          if (index == 0) {
            context.go('/home');
          } else if (index == 1) {
            context.go('/appointments');
          } else if (index == 3) {
            context.go('/medications');
          } else if (index == 4) {
            context.go('/profile');
          }
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: careConnectBlue,
        unselectedItemColor: Colors.black,
        iconSize: 28,
        selectedFontSize: 14,
        unselectedFontSize: 14,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month_outlined),
            label: 'Appointments',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.message_outlined),
            label: 'Messages',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.medication_outlined),
            label: 'Medications',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

class MessageCard extends StatelessWidget {
  final String doctorName;
  final String specialty;
  final String messagePreview;
  final String time;

  const MessageCard({
    super.key,
    required this.doctorName,
    required this.specialty,
    required this.messagePreview,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      label: '$doctorName, $specialty, $messagePreview, $time',
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(minHeight: 145),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.black54),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              doctorName,
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
            ),

            const SizedBox(height: 4),

            Text(
              specialty,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),

            const SizedBox(height: 14),

            Text(messagePreview, style: const TextStyle(fontSize: 16)),

            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: Text(time, style: const TextStyle(fontSize: 15)),
                ),

                Semantics(
                  label: 'See message details for $doctorName',
                  hint: 'Double tap to open this conversation',
                  button: true,
                  child: SizedBox(
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () {
                        context.go('/doctor-messaging');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: MessagesScreen.careConnectBlue,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(48, 48),
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                      child: const Text(
                        'See details',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
