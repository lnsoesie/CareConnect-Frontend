import 'package:flutter/material.dart';

import 'package:go_router/go_router.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  static const Color careConnectBlue = Color(0xFF2C67BA);
  static const Color logoutGreen = Color(0xFF087568);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(32, 20, 32, 120),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Profile',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: careConnectBlue,
                ),
              ),

              const SizedBox(height: 10),

              const Center(
                child: Column(
                  children: [
                    Icon(Icons.person, size: 38),
                    SizedBox(height: 8),
                    Text(
                      'John Doe',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text('Patient', style: TextStyle(fontSize: 15)),
                  ],
                ),
              ),

              const SizedBox(height: 10),

              const Text(
                'Personal Information',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
              ),

              const SizedBox(height: 20),

              const ProfileInfoItem(label: 'Name', value: 'John Doe'),

              const SizedBox(height: 16),

              const ProfileInfoItem(
                label: 'Email',
                value: 'john.doe@gmail.com',
              ),

              const SizedBox(height: 16),

              const ProfileInfoItem(label: 'Phone', value: '(111) 111-1111'),

              const SizedBox(height: 10),

              ProfileSettingsButton(label: 'Account Settings', onTap: () {}),

              const SizedBox(height: 6),

              ProfileSettingsButton(
                label: 'Accessibility Settings',
                onTap: () {},
              ),

              const SizedBox(height: 10),

              ProfileSettingsButton(
                label: 'Notification Settings',
                onTap: () {},
              ),

              const SizedBox(height: 10),

              ProfileSettingsButton(
                label: 'Privacy and Security',
                onTap: () {},
              ),

              const SizedBox(height: 10),

              Semantics(
                label: 'Log out',
                hint: 'Double tap to return to the login screen',
                button: true,
                child: SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      context.go('/login');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: logoutGreen,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(48, 48),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                    child: const Text(
                      'Log out',
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

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 4,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: careConnectBlue,
        unselectedItemColor: Colors.black,
        iconSize: 28,
        selectedFontSize: 14,
        unselectedFontSize: 14,

        onTap: (index) {
          if (index == 0) {
            context.go('/home');
          } else if (index == 1) {
            context.go('/appointments');
          } else if (index == 2) {
            context.go('/messages');
          } else if (index == 3) {
            context.go('/medications');
          }
        },

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

class ProfileInfoItem extends StatelessWidget {
  final String label;
  final String value;

  const ProfileInfoItem({super.key, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '$label: $value',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(fontSize: 16)),
        ],
      ),
    );
  }
}

class ProfileSettingsButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const ProfileSettingsButton({
    super.key,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: label,
      hint: 'Double tap to open $label',
      button: true,
      child: SizedBox(
        width: double.infinity,
        height: 48,
        child: OutlinedButton(
          onPressed: onTap,
          style: OutlinedButton.styleFrom(
            foregroundColor: Colors.black,
            minimumSize: const Size(48, 48),
            side: const BorderSide(color: Colors.black26),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(6),
            ),
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(horizontal: 16),
          ),
          child: Row(
            children: [
              Expanded(
                child: Text(label, style: const TextStyle(fontSize: 15)),
              ),
              const Icon(
                Icons.chevron_right,
                color: ProfileScreen.careConnectBlue,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
