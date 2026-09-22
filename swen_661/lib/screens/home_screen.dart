import 'package:flutter/material.dart';

import 'appointments_screen.dart';

import 'messages_screen.dart';

import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const Color careConnectBlue = Color(0xFF2C67BA);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 18),

                const Text(
                  'CareConnect',
                  style: TextStyle(
                    color: Color(0xFF2C67BA),
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 18),

                const Text(
                  'Welcome back!',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),

                const SizedBox(height: 30),

                // Upcoming Appointment Card
                Semantics(
                  label: 'Upcoming appointment with Doctor Smith, September 5 at 10 AM, Neurology',
                  child: Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.black54),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.fromLTRB(28, 8, 20, 0),
                          child: Text(
                            'Upcoming Appointment',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),

                        const SizedBox(height: 4),

                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 28),
                          child: Text(
                            'Dr. Smith\n'
                            'September 5 | 10:00 AM\n'
                            'Neurology',
                            style: TextStyle(fontSize: 14, height: 1.25),
                          ),
                        ),

                        Align(
                          alignment: Alignment.centerRight,
                          child: Semantics(
                            label: 'See appointment details',
                            button: true,
                            child: ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(
                                backgroundColor: careConnectBlue,
                                foregroundColor: Colors.white,
                                minimumSize: const Size(48, 48),
                                shape: const RoundedRectangleBorder(
                                  borderRadius: BorderRadius.only(
                                    topLeft: Radius.circular(4),
                                    bottomRight: Radius.circular(7),
                                  ),
                                ),
                              ),
                              child: const Text(
                                'See details',
                                style: TextStyle(fontSize: 12),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 40),

                const Text(
                  'Quick access',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),

                const SizedBox(height: 28),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    QuickAccessTile(
                      icon: Icons.calendar_month_outlined,
                      label: 'Appointments',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const AppointmentsScreen(),
                          ),
                        );
                      },
                    ),

                    QuickAccessTile(
                      icon: Icons.message_outlined,
                      label: 'Messages',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const MessagesScreen(),
                          ),
                        );
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 44),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    QuickAccessTile(
                      icon: Icons.medication_outlined,
                      label: 'Medications',
                      onTap: () {
                        context.go('/medications');
                      },
                    ),

                    QuickAccessTile(
                      icon: Icons.person_outline,
                      label: 'Profile',
                      onTap: () {
                        context.go('/profile');
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),

      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: 0,
        onTap: (index) {
          if (index == 1) {
            context.go('/appointments');
          } else if (index == 2) {
            context.go('/messages');
          } else if (index == 3) {
            context.go('/medications');
          } else if (index == 4) {
            context.go('/profile');
          }
        },
        selectedItemColor: careConnectBlue,
        unselectedItemColor: Colors.black,
        selectedFontSize: 11,
        unselectedFontSize: 11,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month),
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

class QuickAccessTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const QuickAccessTile({
    super.key,
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: label,
      hint: 'Double tap to open $label',
      button: true,
      child: InkWell(
        onTap: onTap,
        canRequestFocus: true,
        child: Container(
          width: 130,
          height: 90,
          decoration: BoxDecoration(border: Border.all(color: Colors.black54)),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 32),
              const SizedBox(height: 3),
              Text(
                label,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
