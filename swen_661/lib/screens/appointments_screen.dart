import 'package:flutter/material.dart';

import 'package:go_router/go_router.dart';

class AppointmentsScreen extends StatelessWidget {
  const AppointmentsScreen({super.key});

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
            children: const [
              Text(
                'Appointments',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: careConnectBlue,
                ),
              ),
              SizedBox(height: 28),

              Text(
                'Upcoming',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
              ),
              SizedBox(height: 12),

              AppointmentCard(
                doctorName: 'Dr. Smith',
                specialty: 'Neurology',
                dateTime: 'September 5 | 10:00 AM',
                showDetailsButton: true,
              ),

              SizedBox(height: 28),

              Text(
                'Past',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
              ),
              SizedBox(height: 12),

              AppointmentCard(
                doctorName: 'Dr. Barrow',
                specialty: 'Gastroenterology',
                dateTime: 'March 5 | 01:00 PM',
              ),

              SizedBox(height: 16),

              AppointmentCard(
                doctorName: 'Dr. George',
                specialty: 'Cardiology',
                dateTime: 'August 15 | 08:00 AM',
              ),

              SizedBox(height: 24),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        iconSize: 28,
        currentIndex: 1,
        onTap: (index) {
          if (index == 0) {
            context.go('/home');
          } else if (index == 2) {
            context.go('/messages');
          } else if (index == 3) {
            context.go('/medications');
          } else if (index == 4) {
            context.go('/profile');
          }
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: careConnectBlue,
        unselectedItemColor: Colors.black,
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

class AppointmentCard extends StatelessWidget {
  final String doctorName;
  final String specialty;
  final String dateTime;
  final bool showDetailsButton;

  const AppointmentCard({
    super.key,
    required this.doctorName,
    required this.specialty,
    required this.dateTime,
    this.showDetailsButton = false,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      label: '$doctorName, $specialty, $dateTime',
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(minHeight: 130),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade400),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    doctorName,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    specialty,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(dateTime, style: const TextStyle(fontSize: 14)),
                ],
              ),
            ),
            if (showDetailsButton) ...[
              const SizedBox(width: 12),
              Semantics(
                label: 'See appointment details',
                hint: 'Double tap to view appointment details',
                button: true,
                child: SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      // We will connect this later.
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppointmentsScreen.careConnectBlue,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(48, 48),
                      padding: const EdgeInsets.symmetric(horizontal: 18),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'See details',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
